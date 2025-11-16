import express from 'express';
import cors from 'cors';
import "./config/dotenv.js";
import chatRoutes from './routes/chatRoutes.js';

import passport from "passport";
import session from "express-session";
import { Strategy as GitHubStrategy } from "passport-github2";
import { options, verify } from "./config/auth.js";
import authRouter from "./routes/auth.js";

// MongoDB
import connectDB from './config/database.js';
import User from './models/User.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  session({
    secret: "codepath",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Configure GitHub Strategy
passport.use(new GitHubStrategy(options, verify));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// CORS and JSON middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

// Routes
app.use('/auth', authRouter);
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Room To Grow API</h1>')
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});