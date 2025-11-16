import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVEN_LABS_API_KEY,
});

/**
 * Convert text to speech
 * POST /api/tts
 * Body: { text: string, voiceId?: string }
 */
const textToSpeech = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!process.env.ELEVEN_LABS_API_KEY) {
            return res.status(500).json({ error: 'ELEVEN_LABS_API_KEY is not configured' });
        }

        console.log('[textToSpeech] Generating speech for text length:', text.length);

        // Generate speech using ElevenLabs
        const audio = await elevenlabs.textToSpeech.convert(
            "JBFqnCBsd6RMkjVDRZzb", // George voice ID - you can change this
            {
                text: text,
                model_id: "eleven_turbo_v2_5",
            }
        );

        // Collect all audio chunks into a buffer
        const chunks = [];
        for await (const chunk of audio) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);

        // Set headers and send complete audio
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.length);
        res.send(audioBuffer);

        console.log('[textToSpeech] Audio generation complete, sent', audioBuffer.length, 'bytes');

    } catch (error) {
        console.error('[textToSpeech] Error:', error);
        console.error('[textToSpeech] Error stack:', error.stack);
        console.error('[textToSpeech] Error details:', {
            message: error.message,
            name: error.name,
            statusCode: error.statusCode,
            body: error.body
        });
        res.status(500).json({ 
            error: 'Failed to generate speech',
            details: error?.message || 'Unknown error'
        });
    }
};



export { textToSpeech };