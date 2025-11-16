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

        // Set headers for audio streaming
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Stream the audio chunks to the response
        for await (const chunk of audio) {
            res.write(chunk);
        }

        res.end();
        console.log('[textToSpeech] Audio generation complete');

    } catch (error) {
        console.error('[textToSpeech] Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate speech',
            details: error?.message || 'Unknown error'
        });
    }
};



export { textToSpeech };