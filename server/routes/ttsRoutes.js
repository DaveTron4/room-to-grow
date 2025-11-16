import express from 'express';
import { textToSpeech } from '../controllers/ElevenLabsController.js';

const router = express.Router();

// POST /api/tts - Convert text to speech
router.post('/', textToSpeech);

export default router;
