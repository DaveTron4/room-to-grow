import { GoogleGenAI } from '@google/genai';
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

/**
 * Handle chat messages with the AI tutor
 * POST /api/chat
 * Body: { message: string, history?: array, chatId?: string }
 */
const sendMessage = async (req, res) => {
    try {
        const { message, history = [], chatId } = req.body;
        const user = req.user; // From passport authentication
        
        console.log('[sendMessage] Incoming message:', message);
        console.log('[sendMessage] History length:', history.length);
        console.log('[sendMessage] User:', user?.username || 'guest');
        console.log('[sendMessage] ChatId:', chatId);

        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
        }

        // Initialize chat with system instruction
        const chat = genAI.chats.create({
            model: 'gemini-2.0-flash',
            config: { 
                systemInstruction, 
                temperature: 0.7 
            },
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            }))
        });

        // Send the message and get response
        let text = '';
        
        try {
            const result = await chat.sendMessage({
                message: message,
            });
            console.log('[sendMessage] Model raw response:', result);
            
            // Extract text from the response structure
            if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
                text = result.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Unexpected response structure from Gemini API');
            }

        } catch (modelErr) {
            console.error('[sendMessage] Model error name:', modelErr?.name);
            console.error('[sendMessage] Model error message:', modelErr?.message);
            console.error('[sendMessage] Model error stack:', modelErr?.stack);
            throw modelErr;
        }

        // Save to database if user is authenticated
        let savedChatId = chatId;
        if (user) {
            try {
                let chatDoc;
                
                if (chatId) {
                    // Update existing chat
                    chatDoc = await Chat.findById(chatId);
                    if (chatDoc && chatDoc.userId.toString() === user._id.toString()) {
                        chatDoc.messages.push(
                            { role: 'user', content: message },
                            { role: 'model', content: text }
                        );
                        await chatDoc.save();
                    }
                } else {
                    // Create new chat - generate title using AI
                    let chatTitle = message.substring(0, 50) + (message.length > 50 ? '...' : '');
                    
                    try {
                        const titleChat = genAI.chats.create({
                            model: 'gemini-2.0-flash',
                            config: { temperature: 0.5 }
                        });
                        const titlePrompt = `Based on this student's question, generate a short, descriptive title (max 50 characters) for this learning session. Return ONLY the title, no quotes or extra text.\n\nQuestion: ${message}\n\nRespond with just the title:`;
                        const titleResult = await titleChat.sendMessage({ message: titlePrompt });
                        if (titleResult.candidates && titleResult.candidates[0]?.content?.parts?.[0]?.text) {
                            chatTitle = titleResult.candidates[0].content.parts[0].text.trim().substring(0, 50);
                        }
                    } catch (titleErr) {
                        console.error('[sendMessage] Failed to generate title:', titleErr);
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
                }
                
                console.log('[sendMessage] Saved to database, chatId:', savedChatId);
            } catch (dbError) {
                console.error('[sendMessage] Database error:', dbError);
                // Don't fail the request if database save fails
            }
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
 * Generate a new chat session
 * POST /api/chat/new
 */
const newChat = async (req, res) => {
    try {
        const user = req.user;
        
        if (user) {
            // Create a new chat in database for authenticated user
            const chat = await Chat.create({
                userId: user._id,
                title: 'New Chat',
                messages: []
            });
            
            res.status(200).json({
                message: 'New chat session created',
                chatId: chat._id.toString()
            });
        } else {
            // Guest user - just return a timestamp ID
            res.status(200).json({
                message: 'New chat session created',
                chatId: Date.now().toString()
            });
        }
    } catch (error) {
        console.error('Error creating new chat:', error);
        res.status(500).json({ error: 'Failed to create new chat' });
    }
};

/**
 * Generate flash cards from chat history
 * POST /api/chat/flashcards
 * Body: { history: array, chatId?: string }
 */
const generateFlashCards = async (req, res) => {
    try {
        const { history = [], chatId } = req.body;
        const user = req.user;
        
        console.log('[generateFlashCards] History length:', history.length);
        console.log('[generateFlashCards] User:', user?.username || 'guest');
        console.log('[generateFlashCards] ChatId:', chatId);

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
        }

        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

        const chat = genAI.chats.create({
            model: 'gemini-2.0-flash',
            config: { 
                temperature: 0.5,
                responseType: 'json'
            }
        });

        const result = await chat.sendMessage({ message: flashCardPrompt });
        
        let text = '';
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            text = result.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected response structure from Gemini API');
        }

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
 * Generate a quiz from chat history
 * POST /api/chat/quiz
 * Body: { history: array, chatId?: string }
 */
const generateQuiz = async (req, res) => {
    try {
        const { history = [], chatId } = req.body;
        const user = req.user;
        
        console.log('[generateQuiz] History length:', history.length);
        console.log('[generateQuiz] User:', user?.username || 'guest');
        console.log('[generateQuiz] ChatId:', chatId);

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
        }

        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

        const chat = genAI.chats.create({
            model: 'gemini-2.0-flash',
            config: { 
                temperature: 0.5,
                responseType: 'json'
            }
        });

        const result = await chat.sendMessage({ message: quizPrompt });
        
        let text = '';
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            text = result.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected response structure from Gemini API');
        }

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

/**
 * Get all chats for authenticated user
 * GET /api/chat/history
 */
const getChatHistory = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const chats = await Chat.find({ userId: user._id })
            .select('_id title createdAt updatedAt')
            .sort({ updatedAt: -1 })
            .limit(50);
        
        res.status(200).json({ chats });
    } catch (error) {
        console.error('[getChatHistory] Error:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
};

/**
 * Get a specific chat by ID
 * GET /api/chat/:chatId
 */
const getChatById = async (req, res) => {
    try {
        const user = req.user;
        const { chatId } = req.params;
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const chat = await Chat.findOne({ _id: chatId, userId: user._id });
        
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        
        res.status(200).json({ chat });
    } catch (error) {
        console.error('[getChatById] Error:', error);
        res.status(500).json({ error: 'Failed to get chat' });
    }
};

/**
 * Get all activities for authenticated user
 * GET /api/chat/activities
 */
const getActivities = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const activities = await Activity.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(100);
        
        res.status(200).json({ activities });
    } catch (error) {
        console.error('[getActivities] Error:', error);
        res.status(500).json({ error: 'Failed to get activities' });
    }
};

/**
 * Delete a chat
 * DELETE /api/chat/:chatId
 */
const deleteChat = async (req, res) => {
    try {
        const user = req.user;
        const { chatId } = req.params;
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
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
        res.status(500).json({ error: 'Failed to delete chat' });
    }
};

/**
 * Delete an activity
 * DELETE /api/chat/activities/:activityId
 */
const deleteActivity = async (req, res) => {
    try {
        const user = req.user;
        const { activityId } = req.params;
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const activity = await Activity.findOneAndDelete({ _id: activityId, userId: user._id });
        
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('[deleteActivity] Error:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
};

export { 
    sendMessage, 
    newChat, 
    generateFlashCards, 
    generateQuiz,
    getChatHistory,
    getChatById,
    getActivities,
    deleteChat,
    deleteActivity
}