import OpenAI from 'openai';
import Chat from '../models/Chat.js';
import Activity from '../models/Activity.js';

const systemInstruction = `You are an expert AI tutor for "Room To Grow" - a personalized learning platform.
    Your goal is to help students learn any subject through:
    - Clear, patient explanations tailored to their level
    - Asking guiding questions to promote critical thinking
    - Breaking down complex topics into digestible pieces
    - Encouraging students and celebrating their progress
    - Adapting your teaching style based on the student's responses

    Be friendly, supportive, and engaging. Always aim to teach, not just answer.
    
    IMPORTANT: If you detect that the student is switching to a significantly different topic (e.g., from math to science, history to programming),
    acknowledge it naturally in your response and gently suggest they start a new chat to keep their flash cards and quizzes focused.
    For example: "I see you want to learn about [new topic] now! I'd recommend starting a new chat for this to keep your study materials organized and focused on one topic at a time."
    Only mention this for major topic shifts, not minor variations within the same subject.`;

// Initialize OpenRouter client
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Model configuration - easily switch between different models
const CHAT_MODEL = process.env.OPENROUTER_CHAT_MODEL || "google/gemini-2.0-flash-exp:free";
const GENERATION_MODEL = process.env.OPENROUTER_GENERATION_MODEL || "google/gemini-2.0-flash-exp:free";

// Fallback models in case of rate limiting
const FALLBACK_MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "nousresearch/hermes-3-llama-3.1-405b:free"
];

// Vision-capable models (support image inputs)
const VISION_FALLBACK_MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.2-90b-vision-instruct:free",
    "openai/gpt-4-turbo",
    "anthropic/claude-3.5-sonnet"
];

/**
 * Handle chat messages with streaming using OpenRouter
 * POST /api/chat/stream
 * Body: { message: string, history?: array, chatId?: string, model?: string }
 */
const sendMessageStream = async (req, res) => {
    try {
        // Extract data - handle both JSON and FormData (multipart)
        let message, history, chatId, model;
        
        if (req.is('multipart/form-data')) {
            // FormData with potential image
            message = req.body.message;
            history = req.body.history ? JSON.parse(req.body.history) : [];
            chatId = req.body.chatId;
            model = req.body.model;
        } else {
            // Regular JSON
            ({ message, history = [], chatId, model } = req.body);
        }
        
        const user = req.user;
        const imageFile = req.file; // Multer puts uploaded file here
        
        console.log('[sendMessageStream] Incoming message:', message);
        console.log('[sendMessageStream] Using model:', model || CHAT_MODEL);
        console.log('[sendMessageStream] Image attached:', !!imageFile);

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
        }

        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Build user content - support text + image
        let userContent;
        if (imageFile) {
            // Convert image buffer to base64
            const base64Image = imageFile.buffer.toString('base64');
            const imageUrl = `data:${imageFile.mimetype};base64,${base64Image}`;
            
            // Vision API format - array of content parts
            userContent = [
                { type: 'text', text: message },
                { type: 'image_url', image_url: { url: imageUrl } }
            ];
        } else {
            // Text-only message
            userContent = message;
        }

        // Build messages array
        const messages = [
            { role: 'system', content: systemInstruction },
            ...history.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: userContent }
        ];

        const selectedModel = model || CHAT_MODEL;
        let fullText = '';
        let usedModel = selectedModel;

        // Choose appropriate fallback list based on whether image is attached
        const fallbackList = imageFile ? VISION_FALLBACK_MODELS : FALLBACK_MODELS;
        
        // Try primary model with automatic fallback on rate limit
        let streamSuccess = false;
        const modelsToTry = [selectedModel, ...fallbackList.filter(m => m !== selectedModel)];
        
        for (const tryModel of modelsToTry) {
            try {
                console.log(`[sendMessageStream] Trying model: ${tryModel}`);
                const stream = await openrouter.chat.completions.create({
                    model: tryModel,
                    messages: messages,
                    temperature: 0.7,
                    stream: true,
                });

                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        fullText += content;
                        res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
                    }
                }
                
                usedModel = tryModel;
                streamSuccess = true;
                console.log(`[sendMessageStream] Success with model: ${tryModel}`);
                break;
                
            } catch (streamError) {
                console.error(`[sendMessageStream] Model ${tryModel} failed:`, streamError.message);
                
                // If rate limited or invalid model, try next model
                if ((streamError.status === 429 || streamError.status === 400) && tryModel !== modelsToTry[modelsToTry.length - 1]) {
                    console.log(`[sendMessageStream] ${streamError.status === 429 ? 'Rate limited' : 'Invalid model'}, trying next model...`);
                    fullText = ''; // Reset accumulated text
                    continue;
                } else {
                    // Last model or non-recoverable error
                    throw streamError;
                }
            }
        }
        
        if (!streamSuccess) {
            throw new Error('All models failed or rate-limited');
        }

        // Save to database if user is authenticated
        let savedChatId = chatId;
        if (user) {
            console.log('[sendMessageStream] User authenticated, saving to database');
            try {
                let chatDoc;
                
                if (chatId) {
                    chatDoc = await Chat.findById(chatId);
                    if (chatDoc && chatDoc.userId.toString() === user._id.toString()) {
                        chatDoc.messages.push(
                            { role: 'user', content: message },
                            { role: 'model', content: fullText }
                        );
                        await chatDoc.save();
                    }
                } else {
                    // Generate title
                    let chatTitle = message.substring(0, 50) + (message.length > 50 ? '...' : '');
                    try {
                        const titleCompletion = await openrouter.chat.completions.create({
                            model: GENERATION_MODEL,
                            messages: [{ role: 'user', content: `Based on this student's question, generate a short, descriptive title (max 50 characters) for this learning session. Return ONLY the title, no quotes or extra text.\n\nQuestion: ${message}\n\nRespond with just the title:` }],
                            temperature: 0.5,
                        });
                        chatTitle = titleCompletion.choices[0].message.content.trim().replace(/^["']|["']$/g, '').substring(0, 50);
                    } catch (titleErr) {
                        console.error('[sendMessageStream] Failed to generate title');
                    }
                    
                    chatDoc = await Chat.create({
                        userId: user._id,
                        title: chatTitle,
                        messages: [
                            { role: 'user', content: message },
                            { role: 'model', content: fullText }
                        ]
                    });
                    savedChatId = chatDoc._id.toString();
                }
            } catch (dbError) {
                console.error('[sendMessageStream] Database error:', dbError);
            }
        }

        // Send final message with chatId
        res.write(`data: ${JSON.stringify({ content: '', done: true, chatId: savedChatId })}\n\n`);
        res.end();

    } catch (error) {
        console.error('[sendMessageStream] Error:', error);
        if (!res.headersSent) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        } else {
            res.status(500).json({ error: 'Failed to process message' });
        }
    }
};

/**
 * Handle chat messages with the AI tutor using OpenRouter (non-streaming fallback)
 * POST /api/chat
 * Body: { message: string, history?: array, chatId?: string, model?: string }
 */
const sendMessage = async (req, res) => {
    try {
        const { message, history = [], chatId, model } = req.body;
        const user = req.user; // From passport authentication
        
        console.log('[sendMessage] Incoming message:', message);
        console.log('[sendMessage] History length:', history.length);
        console.log('[sendMessage] User:', user?.username || 'guest');
        console.log('[sendMessage] ChatId:', chatId);
        console.log('[sendMessage] Using model:', model || CHAT_MODEL);

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
        }

        // Build messages array with system instruction and history
        const messages = [
            { role: 'system', content: systemInstruction },
            ...history.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        // Try primary model with automatic fallback on rate limit
        let text;
        const selectedModel = model || CHAT_MODEL;
        let usedModel = selectedModel;
        
        try {
            const completion = await openrouter.chat.completions.create({
                model: selectedModel,
                messages: messages,
                temperature: 0.7,
            });
            text = completion.choices[0].message.content;
        } catch (primaryError) {
            // If rate limited (429), try fallback models
            if (primaryError.status === 429) {
                console.log('[sendMessage] Primary model rate limited, trying fallbacks...');
                
                for (const fallbackModel of FALLBACK_MODELS) {
                    if (fallbackModel === CHAT_MODEL) continue; // Skip the one that failed
                    
                    try {
                        console.log(`[sendMessage] Trying fallback: ${fallbackModel}`);
                        const completion = await openrouter.chat.completions.create({
                            model: fallbackModel,
                            messages: messages,
                            temperature: 0.7,
                        });
                        text = completion.choices[0].message.content;
                        usedModel = fallbackModel;
                        console.log(`[sendMessage] Success with fallback: ${fallbackModel}`);
                        break;
                    } catch (fallbackError) {
                        console.log(`[sendMessage] Fallback ${fallbackModel} failed:`, fallbackError.message);
                        continue;
                    }
                }
                
                // If all fallbacks failed, throw the original error
                if (!text) {
                    throw primaryError;
                }
            } else {
                throw primaryError;
            }
        }

        console.log('[sendMessage] Response received, length:', text.length, 'Model:', usedModel);

        // Save to database if user is authenticated
        let savedChatId = chatId;
        if (user) {
            console.log('[sendMessage] User authenticated, saving to database. User ID:', user._id);
            try {
                let chatDoc;
                
                if (chatId) {
                    // Update existing chat
                    console.log('[sendMessage] Updating existing chat:', chatId);
                    chatDoc = await Chat.findById(chatId);
                    if (chatDoc && chatDoc.userId.toString() === user._id.toString()) {
                        chatDoc.messages.push(
                            { role: 'user', content: message },
                            { role: 'model', content: text }
                        );
                        await chatDoc.save();
                        console.log('[sendMessage] Chat updated successfully');
                    } else {
                        console.log('[sendMessage] Chat not found or user mismatch');
                    }
                } else {
                    // Create new chat - generate title using AI
                    console.log('[sendMessage] Creating new chat');
                    let chatTitle = message.substring(0, 50) + (message.length > 50 ? '...' : '');
                    
                    try {
                        const titlePrompt = `Based on this student's question, generate a short, descriptive title (max 50 characters) for this learning session. Return ONLY the title, no quotes or extra text.\n\nQuestion: ${message}\n\nRespond with just the title:`;
                        
                        let titleText;
                        try {
                            const titleCompletion = await openrouter.chat.completions.create({
                                model: GENERATION_MODEL,
                                messages: [{ role: 'user', content: titlePrompt }],
                                temperature: 0.5,
                            });
                            titleText = titleCompletion.choices[0].message.content;
                        } catch (titleError) {
                            // Try fallback models if rate limited
                            if (titleError.status === 429) {
                                console.log('[sendMessage] Title generation rate limited, trying fallbacks...');
                                for (const fallbackModel of FALLBACK_MODELS) {
                                    if (fallbackModel === GENERATION_MODEL) continue;
                                    try {
                                        const titleCompletion = await openrouter.chat.completions.create({
                                            model: fallbackModel,
                                            messages: [{ role: 'user', content: titlePrompt }],
                                            temperature: 0.5,
                                        });
                                        titleText = titleCompletion.choices[0].message.content;
                                        break;
                                    } catch (fallbackError) {
                                        continue;
                                    }
                                }
                            }
                            if (!titleText) throw titleError;
                        }
                        
                        chatTitle = titleText.trim().replace(/^["']|["']$/g, '').substring(0, 50);
                        console.log('[sendMessage] Generated title:', chatTitle);
                    } catch (titleErr) {
                        console.error('[sendMessage] Failed to generate title:', titleErr.message);
                        // Fall back to truncated message
                    }
                    
                    chatDoc = await Chat.create({
                        userId: user._id,
                        title: chatTitle,
                        messages: [
                            { role: 'user', content: message },
                            { role: 'model', content: text }
                        ]
                    });
                    savedChatId = chatDoc._id.toString();
                    console.log('[sendMessage] New chat created successfully, ID:', savedChatId);
                }
                
                console.log('[sendMessage] Saved to database, chatId:', savedChatId);
            } catch (dbError) {
                console.error('[sendMessage] Database error:', dbError);
                console.error('[sendMessage] Database error stack:', dbError.stack);
                // Don't fail the request if database save fails
            }
        } else {
            console.log('[sendMessage] User not authenticated, skipping database save');
        }

        res.status(200).json({
            message: text,
            role: 'model',
            chatId: savedChatId
        });

    } catch (error) {
        const code = (error && (error.status || error.code)) || 'UNKNOWN';
        console.error('[sendMessage] Error code:', code);
        console.error('[sendMessage] Error object:', error);
        const details = (error && (error.message || error.toString())) || 'Unknown error';
        res.status(500).json({ 
          error: 'Failed to process chat message',
          code,
          details
        });
    }
};

/**
 * Get chat history for authenticated user
 * GET /api/chat/history
 */
const getChatHistory = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const chats = await Chat.find({ userId: user._id })
            .sort({ updatedAt: -1 })
            .select('_id title createdAt updatedAt')
            .lean();
        
        res.status(200).json({ chats });
    } catch (error) {
        console.error('[getChatHistory] Error:', error);
        res.status(500).json({ 
            error: 'Failed to get chat history',
            details: error?.message || 'Unknown error'
        });
    }
};

/**
 * Get a specific chat by ID
 * GET /api/chat/:chatId
 */
const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const chat = await Chat.findOne({ _id: chatId, userId: user._id }).lean();
        
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        
        res.status(200).json({ chat });
    } catch (error) {
        console.error('[getChatById] Error:', error);
        res.status(500).json({ 
            error: 'Failed to get chat',
            details: error?.message || 'Unknown error'
        });
    }
};

/**
 * Delete a chat by ID
 * DELETE /api/chat/:chatId
 */
const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const chat = await Chat.findOneAndDelete({ _id: chatId, userId: user._id });
        
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        
        // Also delete associated activities
        await Activity.deleteMany({ chatId: chatId, userId: user._id });
        
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('[deleteChat] Error:', error);
        res.status(500).json({ 
            error: 'Failed to delete chat',
            details: error?.message || 'Unknown error'
        });
    }
};

/**
 * Get activities (flashcards and quizzes) for a chat
 * GET /api/chat/activities
 * Query: chatId (optional)
 */
const getActivities = async (req, res) => {
    try {
        const user = req.user;
        const { chatId } = req.query;
        
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const query = { userId: user._id };
        if (chatId) {
            query.chatId = chatId;
        }
        
        const activities = await Activity.find(query)
            .sort({ createdAt: -1 })
            .lean();
        
        res.status(200).json({ activities });
    } catch (error) {
        console.error('[getActivities] Error:', error);
        res.status(500).json({ 
            error: 'Failed to get activities',
            details: error?.message || 'Unknown error'
        });
    }
};

/**
 * Generate flash cards from chat history using OpenRouter
 * POST /api/chat/flashcards
 * Body: { history: array, chatId?: string, model?: string }
 */
const generateFlashCards = async (req, res) => {
    try {
        const { history = [], chatId, model } = req.body;
        const user = req.user;
        
        console.log('[generateFlashCards] History length:', history.length);
        console.log('[generateFlashCards] User:', user?.username || 'guest');
        console.log('[generateFlashCards] ChatId:', chatId);
        console.log('[generateFlashCards] Using model:', model || GENERATION_MODEL);

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
        }

        const flashCardPrompt = `Based on the following conversation, generate flash cards to help the student review key concepts.
Conversation:
${history.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

Generate 5-10 flash cards and a descriptive title (max 40 characters) in JSON format.
Return ONLY a JSON object with this structure:
{
  "title": "descriptive title for these flashcards",
  "flashcards": [
    { "question": "...", "answer": "..." },
    ...
  ]
}`;

        // Try primary model with automatic fallback on rate limit
        let text;
        const selectedModel = model || GENERATION_MODEL;
        let usedModel = selectedModel;
        
        try {
            const completion = await openrouter.chat.completions.create({
                model: selectedModel,
                messages: [{ role: 'user', content: flashCardPrompt }],
                temperature: 0.5,
                response_format: { type: "json_object" }
            });
            text = completion.choices[0].message.content;
        } catch (primaryError) {
            // If rate limited (429), try fallback models
            if (primaryError.status === 429) {
                console.log('[generateFlashCards] Primary model rate limited, trying fallbacks...');
                
                for (const fallbackModel of FALLBACK_MODELS) {
                    if (fallbackModel === selectedModel) continue;
                    
                    try {
                        console.log(`[generateFlashCards] Trying fallback: ${fallbackModel}`);
                        const completion = await openrouter.chat.completions.create({
                            model: fallbackModel,
                            messages: [{ role: 'user', content: flashCardPrompt }],
                            temperature: 0.5,
                            response_format: { type: "json_object" }
                        });
                        text = completion.choices[0].message.content;
                        usedModel = fallbackModel;
                        console.log(`[generateFlashCards] Success with fallback: ${fallbackModel}`);
                        break;
                    } catch (fallbackError) {
                        console.log(`[generateFlashCards] Fallback ${fallbackModel} failed:`, fallbackError.message);
                        continue;
                    }
                }
                
                if (!text) throw primaryError;
            } else {
                throw primaryError;
            }
        }
        
        console.log('[generateFlashCards] Using model:', usedModel);
        
        // Strip markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response
        const flashCards = JSON.parse(cleanText);
        
        // Save to database if user is authenticated
        if (user && chatId) {
            try {
                const activity = await Activity.create({
                    userId: user._id,
                    chatId: chatId,
                    type: 'flashcard',
                    title: flashCards.title || `Flash Cards (${new Date().toLocaleDateString()})`,
                    data: flashCards.flashcards
                });
                
                console.log('[generateFlashCards] Saved to database, activityId:', activity._id);
                
                return res.status(200).json({
                    ...flashCards,
                    activityId: activity._id.toString()
                });
            } catch (dbError) {
                console.error('[generateFlashCards] Database error:', dbError);
                // Don't fail the request if database save fails
            }
        }
        
        res.status(200).json(flashCards);

    } catch (error) {
        console.error('[generateFlashCards] Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate flash cards',
            details: error?.message || 'Unknown error'
        });
    }
};

/**
 * Generate a quiz from chat history using OpenRouter
 * POST /api/chat/quiz
 * Body: { history: array, chatId?: string, model?: string }
 */
const generateQuiz = async (req, res) => {
    try {
        const { history = [], chatId, model } = req.body;
        const user = req.user;
        
        console.log('[generateQuiz] History length:', history.length);
        console.log('[generateQuiz] User:', user?.username || 'guest');
        console.log('[generateQuiz] ChatId:', chatId);
        console.log('[generateQuiz] Using model:', model || GENERATION_MODEL);

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
        }

        const quizPrompt = `Based on the following conversation, generate a quiz to test the student's understanding.
Conversation:
${history.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

Generate a descriptive title (max 40 characters) and 5 multiple-choice questions in JSON format. Each question should have:
- "question": the question text
- "options": array of 4 possible answers
- "correctAnswer": the index (0-3) of the correct option
- "explanation": brief explanation of why the answer is correct

Return ONLY a JSON object with this structure:
{
  "title": "descriptive title for this quiz",
  "quiz": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "..."
    },
    ...
  ]
}`;

        // Try primary model with automatic fallback on rate limit
        let text;
        const selectedModel = model || GENERATION_MODEL;
        let usedModel = selectedModel;
        
        try {
            const completion = await openrouter.chat.completions.create({
                model: selectedModel,
                messages: [{ role: 'user', content: quizPrompt }],
                temperature: 0.5,
                response_format: { type: "json_object" }
            });
            text = completion.choices[0].message.content;
        } catch (primaryError) {
            // If rate limited (429), try fallback models
            if (primaryError.status === 429) {
                console.log('[generateQuiz] Primary model rate limited, trying fallbacks...');
                
                for (const fallbackModel of FALLBACK_MODELS) {
                    if (fallbackModel === selectedModel) continue;
                    
                    try {
                        console.log(`[generateQuiz] Trying fallback: ${fallbackModel}`);
                        const completion = await openrouter.chat.completions.create({
                            model: fallbackModel,
                            messages: [{ role: 'user', content: quizPrompt }],
                            temperature: 0.5,
                            response_format: { type: "json_object" }
                        });
                        text = completion.choices[0].message.content;
                        usedModel = fallbackModel;
                        console.log(`[generateQuiz] Success with fallback: ${fallbackModel}`);
                        break;
                    } catch (fallbackError) {
                        console.log(`[generateQuiz] Fallback ${fallbackModel} failed:`, fallbackError.message);
                        continue;
                    }
                }
                
                if (!text) throw primaryError;
            } else {
                throw primaryError;
            }
        }
        
        console.log('[generateQuiz] Using model:', usedModel);
        
        // Strip markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response
        const quiz = JSON.parse(cleanText);
        
        // Save to database if user is authenticated
        if (user && chatId) {
            try {
                const activity = await Activity.create({
                    userId: user._id,
                    chatId: chatId,
                    type: 'quiz',
                    title: quiz.title || `Quiz (${new Date().toLocaleDateString()})`,
                    data: quiz.quiz
                });
                
                console.log('[generateQuiz] Saved to database, activityId:', activity._id);
                
                return res.status(200).json({
                    ...quiz,
                    activityId: activity._id.toString()
                });
            } catch (dbError) {
                console.error('[generateQuiz] Database error:', dbError);
                // Don't fail the request if database save fails
            }
        }
        
        res.status(200).json(quiz);

    } catch (error) {
        console.error('[generateQuiz] Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate quiz',
            details: error?.message || 'Unknown error'
        });
    }
};

export {
    sendMessage,
    sendMessageStream,
    getChatHistory,
    getChatById,
    deleteChat,
    getActivities,
    generateFlashCards,
    generateQuiz
};
