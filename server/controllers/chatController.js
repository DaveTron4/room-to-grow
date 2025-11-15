import { GoogleGenAI } from '@google/genai';


const systemInstruction = `You are an expert AI tutor for "Room To Grow" - a personalized learning platform.
    Your goal is to help students learn any subject through:
    - Clear, patient explanations tailored to their level
    - Asking guiding questions to promote critical thinking
    - Breaking down complex topics into digestible pieces
    - Encouraging students and celebrating their progress
    - Adapting your teaching style based on the student's responses

    Be friendly, supportive, and engaging. Always aim to teach, not just answer.`;

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

        // Initi
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

export { sendMessage, newChat }
