import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Handle chat messages with the AI tutor
 * POST /api/chat
 * Body: { message: string, history?: array }
 */
export const sendMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            systemInstruction: `You are an expert AI tutor for "Room To Grow" - a personalized learning platform. 
Your goal is to help students learn any subject through:
- Clear, patient explanations tailored to their level
- Asking guiding questions to promote critical thinking
- Breaking down complex topics into digestible pieces
- Encouraging students and celebrating their progress
- Adapting your teaching style based on the student's responses

Be friendly, supportive, and engaging. Always aim to teach, not just answer.`
        });

        // Start a chat session with history if provided
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        // Send the message and get response
        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        res.status(200).json({
            message: text,
            role: 'model'
        });

    } catch (error) {
        console.error('Error in chat controller:', error);
        res.status(500).json({ 
            error: 'Failed to process chat message',
            details: error.message 
        });
    }
};

/**
 * Generate a new chat session
 * POST /api/chat/new
 */
export const newChat = async (req, res) => {
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
