import express from 'express';
import cors from 'cors';
import "./config/dotenv.js";
import chatRoutes from './routes/chatRoutes.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Room To Grow API</h1>')
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});