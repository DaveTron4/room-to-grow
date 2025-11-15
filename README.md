# 🌱 Room To Grow

> An AI-powered tutoring platform that helps students learn through interactive conversations and generates personalized study materials.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Phase](https://img.shields.io/badge/phase-1%20chat-blue)

---

## 🎯 Project Vision

**Room To Grow** is an intelligent tutoring system that combines:
- 💬 **AI Tutor Chat** - Conversational learning with Gemini AI
- 📚 **Study Tool Generation** - Flashcards, practice tests, and memory cards
- 🔐 **User Authentication** - GitHub OAuth for saving progress
- 💾 **Data Persistence** - Save chats and study materials

---

## ✨ Current Features (Phase 1)

- ✅ Real-time chat with AI tutor
- ✅ Conversation history maintained
- ✅ Clean, modern UI with animations
- ✅ Responsive design
- ✅ Error handling and loading states

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Gemini API key ([Get one here](https://ai.google.dev/))
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd room-to-grow
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```
   
   - Add `"type": "module"` to `server/package.json`
   - Create `.env` file: `cp .env.example .env`
   - Add your Gemini API key to `.env`:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npm install framer-motion
   ```

4. **Run the app** (use 2 terminals)
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start chatting with your AI tutor! 🎓

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[ROADMAP.md](./ROADMAP.md)** - Full project roadmap and phases

---

## 🛠 Tech Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS
- Framer Motion
- Vite

### Backend
- Node.js + Express.js
- Gemini API (Google AI)
- MongoDB (planned)
- Passport.js (planned)

---

## 📋 Roadmap

- [x] **Phase 1:** Core chat functionality
- [ ] **Phase 2:** Study tool generation
- [ ] **Phase 3:** User authentication
- [ ] **Phase 4:** Data persistence
- [ ] **Phase 5:** Advanced features (TTS, STT, etc.)

See [ROADMAP.md](./ROADMAP.md) for detailed timeline.

---

## 🎨 Screenshots

_Coming soon after Phase 1 is complete!_

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

**David** - Hackathon Project 2025

---

## 🙏 Acknowledgments

- Google Gemini API for the AI capabilities
- React and Vite teams for amazing tools
- Tailwind CSS for rapid styling
- Framer Motion for smooth animations

---

## 📞 Support

If you encounter issues:
1. Check [SETUP.md](./SETUP.md) for troubleshooting
2. Review [COMMANDS.md](./COMMANDS.md) for common fixes
3. Open an issue on GitHub

---

**Built with ❤️ for learners everywhere** 🌱
