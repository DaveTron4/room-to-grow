# 🌱 Room To Grow

> An AI-powered tutoring platform that helps students learn through interactive conversations, generates personalized study materials, and provides intelligent tutoring with voice capabilities.

![Status](https://img.shields.io/badge/status-live-green)
![Deployment](https://img.shields.io/badge/deployment-vercel%20%2B%20render-blue)

**Live App:** [www.roomtogrow.fit](https://www.roomtogrow.fit)

---

## 🎯 Project Vision

**Room To Grow** is an intelligent tutoring system that combines:
- 💬 **AI Tutor Chat** - Conversational learning with multiple AI models
- 📸 **Image Analysis** - Upload images for vision-based learning
- 📚 **Study Tool Generation** - Auto-generated flashcards and quizzes
- 🎙️ **Voice Features** - Text-to-speech for tutor responses
- 🔐 **User Authentication** - GitHub OAuth for saving progress
- 💾 **Data Persistence** - Save chats, flashcards, and quiz history
- 🌐 **Guest Access** - Full functionality without account (no saving)

---

## ✨ Completed Features

### Core Functionality
- ✅ Real-time streaming chat with AI tutor
- ✅ Multiple AI model selection (6+ models via OpenRouter)
- ✅ Image upload and analysis with vision models
- ✅ Auto-generated flashcards from conversations
- ✅ Auto-generated quizzes with explanations
- ✅ Text-to-speech for tutor responses
- ✅ Loading indicators for async operations

### User Experience
- ✅ GitHub OAuth authentication
- ✅ Guest user access (all features except saving)
- ✅ Conversation history panel
- ✅ Activity history (flashcards & quizzes)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Error handling and fallback models

### Data & Persistence
- ✅ Save chat conversations to database
- ✅ Save flashcards and quizzes
- ✅ Load and resume previous chats
- ✅ Delete conversations
- ✅ Auto-generated chat titles

---

## 🔮 Future Features

### Planned Enhancements
- 📄 **PDF Upload & Analysis** - Upload PDFs to generate flashcards and quizzes based on document content
- 📞 **AI Tutor Voice Calls** - Direct voice conversations with the AI tutor agent
- 🎨 **Customizable Study Materials** - Edit and customize generated flashcards and quizzes
- 📊 **Learning Analytics** - Track progress, quiz scores, and learning patterns
- 🔔 **Study Reminders** - Spaced repetition notifications for flashcard review
- 👥 **Collaborative Learning** - Share study materials with other students
- 🌍 **Multi-language Support** - Learn in your preferred language

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- MongoDB Atlas account ([Sign up here](https://www.mongodb.com/cloud/atlas))
- GitHub OAuth App ([Create one here](https://github.com/settings/developers))
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DaveTron4/room-to-grow.git
   cd room-to-grow
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```
   
   - Create `.env` file: `cp .env.example .env`
   - Add your environment variables to `.env`:
     ```
     OPENROUTER_API_KEY=your_openrouter_key_here
     MONGODB_URI=your_mongodb_connection_string
     GITHUB_CLIENT_ID=your_github_client_id
     GITHUB_CLIENT_SECRET=your_github_client_secret
     GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
     SESSION_SECRET=your_random_session_secret
     FRONTEND_URL=http://localhost:5173
     ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   ```
   
   - Create `.env.development` file:
     ```
     VITE_API_URL=http://localhost:3000
     ```

4. **Run the app** (use 2 terminals)
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start chatting with your AI tutor! 🎓

### Production Deployment

The app is deployed on:
- **Frontend**: Vercel ([www.roomtogrow.fit](https://www.roomtogrow.fit))
- **Backend**: Render ([api.roomtogrow.fit](https://api.roomtogrow.fit))

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[ROADMAP.md](./ROADMAP.md)** - Full project roadmap and phases

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js + Express.js
- **AI Integration**: OpenRouter API (multi-model access)
  - Google Gemini 2.0 Flash
  - Meta Llama 3.2
  - Anthropic Claude 3.5
  - OpenAI GPT-4
  - And more...
- **Database**: MongoDB Atlas
- **Authentication**: GitHub OAuth (Passport.js)
- **File Upload**: Multer (image processing)
- **Voice**: Browser Speech Synthesis API
- **Deployment**: Render

### AI & APIs
- **OpenRouter**: Multi-model AI access with automatic fallbacks
- **Vision Models**: Support for image analysis and understanding
- **Text Generation**: Streaming responses for real-time chat
- **JSON Mode**: Structured output for flashcards and quizzes

### DevOps & Tools
- **Version Control**: Git + GitHub
- **Environment Management**: dotenv
- **CORS**: Configured for cross-origin requests
- **Session Management**: Express session with MongoDB store
- **Security**: Helmet.js, secure cookies

---

## 🎨 Key Features Demo

### AI Model Selection
Choose from 6+ AI models including:
- Google Gemini 2.0 Flash (Free, Fast)
- Meta Llama 3.2 90B Vision (Free, Vision)
- Anthropic Claude 3.5 Sonnet (Paid, Premium)
- OpenAI GPT-4 Turbo (Paid, Premium)

### Image Analysis
Upload images to get:
- Diagram explanations
- Problem-solving help
- Visual concept understanding
- Handwriting recognition

### Study Tools
Auto-generate from any conversation:
- **Flashcards**: Question & answer pairs
- **Quizzes**: Multiple-choice with explanations
- **Organized**: Saved by topic/chat

---

## 📋 Development Status

### Completed (All Phases)
- [x] **Phase 1:** Core chat functionality with streaming
- [x] **Phase 2:** Study tool generation (flashcards & quizzes)
- [x] **Phase 3:** User authentication (GitHub OAuth)
- [x] **Phase 4:** Data persistence (MongoDB)
- [x] **Phase 5:** Advanced features (TTS, image upload, multi-model)

### Production Ready
- [x] Deployed to production (Vercel + Render)
- [x] Environment configuration
- [x] Cross-origin setup (CORS)
- [x] SPA routing
- [x] Guest user access
- [x] Error handling & fallbacks

See [ROADMAP.md](./ROADMAP.md) for detailed timeline.

---

## 🎨 Screenshots

![Home Page](./img/Screenshot%202025-11-15%20110131.png)
![Chat Page](./img/Screenshot%202025-11-16%20062721.png)
![Login Page](./img/Screenshot%202025-11-16%20062742.png)

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for learning!

---

## 👨‍💻 Author

**David Salas C.** - Full-Stack AI Learning Platform 2025

---

## 🙏 Acknowledgments

- **OpenRouter** for multi-model AI access and API aggregation
- **MongoDB Atlas** for cloud database hosting
- **GitHub** for OAuth authentication
- **Vercel & Render** for seamless deployment
- **Google Gemini** for powerful AI capabilities
- **React and Vite** teams for amazing development tools
- **Tailwind CSS** for rapid styling
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons

---

**Built with ❤️ for learners everywhere** 🌱
