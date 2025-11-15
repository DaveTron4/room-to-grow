import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      systemInstruction: `
        You are an expert AI tutor for Room To Grow...
      `
    });

    // Convert your history into correct Gemini format:
    const chatHistory = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage([{ text: message }]);

    const text = result.response.text();

    res.status(200).json({
      message: text,
      role: "model"
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      details: error?.message || "Unknown error"
    });
  }
};

const newChat = async (req, res) => {
  res.status(200).json({
    message: 'New chat session created',
    chatId: Date.now().toString()
  });
};

export { sendMessage, newChat };
