import { GoogleGenAI } from '@google/genai';


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
 * Body: { message: string, history?: array }
 */
const sendMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        console.log('[sendMessage] Incoming message:', message);
        console.log('[sendMessage] History length:', history.length);
        console.log('[sendMessage] History:', history);

        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
        }

        // Initialize chat with system instruction
        // Start a chat session with history if provided
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

        res.status(200).json({
            message: text,
            role: 'model'
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
        res.status(200).json({
            message: 'New chat session created',
            chatId: Date.now().toString() // Simple ID for unregistered users
        });
    } catch (error) {
        console.error('Error creating new chat:', error);
        res.status(500).json({ error: 'Failed to create new chat' });
    }
};

/**
 * Generate flash cards from chat history
 * POST /api/chat/flashcards
 * Body: { history: array }
 */
const generateFlashCards = async (req, res) => {
    try {
        const { history = [] } = req.body;
        console.log('[generateFlashCards] History length:', history.length);

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
        }

        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const flashCardPrompt = `Based on the following conversation, generate flash cards to help the student review key concepts.
                                Conversation:
                                ${history.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

                                Generate 5-10 flash cards in JSON format. Each flash card should have a "question" and "answer" field.
                                Return ONLY a JSON object with this structure:
                                {
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
 * Body: { history: array }
 */
const generateQuiz = async (req, res) => {
    try {
        const { history = [] } = req.body;
        console.log('[generateQuiz] History length:', history.length);

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
        }

        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const quizPrompt = `Based on the following conversation, generate a quiz to test the student's understanding.
                            Conversation:
                            ${history.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}

                            Generate 5 multiple-choice questions in JSON format. Each question should have:
                            - "question": the question text
                            - "options": array of 4 possible answers
                            - "correctAnswer": the index (0-3) of the correct option
                            - "explanation": brief explanation of why the answer is correct

                            Return ONLY a JSON object with this structure:
                            {
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
        
        res.status(200).json(quiz);
    } catch (error) {
        console.error('[generateQuiz] Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate quiz',
            details: error?.message || 'Unknown error'
        });
    }
};

export { sendMessage, newChat, generateFlashCards, generateQuiz }
