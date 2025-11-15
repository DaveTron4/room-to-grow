import express from 'express';
import { sendMessage, newChat } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Send a message to the AI tutor
router.post('/', sendMessage);

// POST /api/chat/new - Create a new chat session
router.post('/new', newChat);

export default router;
