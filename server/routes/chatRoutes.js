import express from 'express';
import { sendMessage, newChat, generateFlashCards, generateQuiz } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Send a message to the AI tutor
router.post('/', sendMessage);

// POST /api/chat/new - Create a new chat session
router.post('/new', newChat);

// POST /api/chat/flashcards - Generate flash cards from chat history
router.post('/flashcards', generateFlashCards);

// POST /api/chat/quiz - Generate quiz from chat history
router.post('/quiz', generateQuiz);

export default router;
