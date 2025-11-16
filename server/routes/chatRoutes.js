import express from 'express';
import multer from 'multer';
import { 
    sendMessage,
    sendMessageStream,
    generateFlashCards, 
    generateQuiz,
    getChatHistory,
    getChatById,
    getActivities,
    deleteChat
} from '../controllers/chatControllerOpenRouter.js';

const router = express.Router();

// Configure multer for memory storage (stores file in buffer)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed!'), false);
            return;
        }
        cb(null, true);
    }
});

// POST /api/chat/stream - Send a message with streaming response (supports image upload)
router.post('/stream', upload.single('image'), sendMessageStream);

// POST /api/chat - Send a message to the AI tutor
router.post('/', sendMessage);

// POST /api/chat/flashcards - Generate flash cards from chat history
router.post('/flashcards', generateFlashCards);

// POST /api/chat/quiz - Generate quiz from chat history
router.post('/quiz', generateQuiz);

// GET /api/chat/history - Get all chats for authenticated user
router.get('/history', getChatHistory);

// GET /api/chat/activities - Get all activities for authenticated user
router.get('/activities', getActivities);

// GET /api/chat/:chatId - Get a specific chat by ID
router.get('/:chatId', getChatById);

// DELETE /api/chat/:chatId - Delete a chat
router.delete('/:chatId', deleteChat);

export default router;
