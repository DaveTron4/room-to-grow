import express from 'express';
import { 
    sendMessage, 
    newChat, 
    generateFlashCards, 
    generateQuiz,
    getChatHistory,
    getChatById,
    getActivities,
    deleteChat,
    deleteActivity
} from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Send a message to the AI tutor
router.post('/', sendMessage);

// POST /api/chat/new - Create a new chat session
router.post('/new', newChat);

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

// DELETE /api/chat/activities/:activityId - Delete an activity
router.delete('/activities/:activityId', deleteActivity);

// DELETE /api/chat/:chatId - Delete a chat
router.delete('/:chatId', deleteChat);

export default router;
