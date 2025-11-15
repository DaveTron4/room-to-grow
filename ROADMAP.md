# Room To Grow - Development Roadmap

## 🎯 Project Vision
An AI-powered tutoring platform that helps students learn any subject through interactive conversations and generates personalized study materials.

---

## 📋 Phase Breakdown

### ✅ Phase 1: Core Chat (CURRENT - 2-3 hours)
**Status:** In Progress

**Goals:**
- [x] Set up Express server with proper ES modules
- [x] Configure Gemini API integration
- [x] Create chat controller and routes
- [x] Build React + TypeScript frontend
- [x] Implement Tailwind CSS styling
- [x] Add Framer Motion animations
- [ ] Test end-to-end chat functionality
- [ ] Polish UI/UX

**Files Created:**
- `server/controllers/chatController.js` - AI chat logic
- `server/routes/chatRoutes.js` - API endpoints
- `client/src/App.tsx` - Main chat interface

**Next Action:** 
1. Add `"type": "module"` to `server/package.json`
2. Install `@google/generative-ai` in server
3. Install `tailwindcss` and `framer-motion` in client
4. Test the chat!

---

### 🔨 Phase 2: Study Tools Generation (3-4 hours)
**Status:** Not Started

**Goals:**
- [ ] Design study tool UI components
- [ ] Create flashcard component
- [ ] Create practice test component
- [ ] Create memory card component
- [ ] Add generation endpoints to backend
- [ ] Implement tool generation from chat context
- [ ] Add export/print functionality

**Estimated Tasks:**
1. Create `studyToolsController.js`
2. Add routes for `/api/tools/flashcards`, `/api/tools/tests`, `/api/tools/memory-cards`
3. Build UI components for each tool type
4. Add "Generate" buttons in chat interface
5. Implement Gemini prompts for structured output

**Key Features:**
- Generate flashcards from conversation
- Create practice tests with multiple choice/short answer
- Build memory cards for memorization
- Allow customization (number of questions, difficulty)

---

### 🔐 Phase 3: User Authentication (2-3 hours)
**Status:** Not Started

**Goals:**
- [ ] Set up GitHub OAuth application
- [ ] Install and configure Passport.js
- [ ] Create authentication routes
- [ ] Add login/logout UI
- [ ] Implement session management
- [ ] Create user model (prepare for MongoDB)

**Estimated Tasks:**
1. Register OAuth app on GitHub
2. Install `passport`, `passport-github2`, `express-session`
3. Create `authController.js` and `authRoutes.js`
4. Add login button to frontend header
5. Create user context/state management
6. Implement protected routes

**Key Features:**
- GitHub OAuth login
- User session management
- Differentiate between guest/authenticated users
- Show user profile in header

---

### 💾 Phase 4: Data Persistence (3-4 hours)
**Status:** Not Started

**Goals:**
- [ ] Set up MongoDB Atlas cluster
- [ ] Install and configure Mongoose
- [ ] Create database models (User, Chat, StudyTool)
- [ ] Implement save/load chat functionality
- [ ] Add chat history sidebar
- [ ] Save generated study tools
- [ ] Create user dashboard

**Estimated Tasks:**
1. Create MongoDB Atlas account and cluster
2. Install `mongoose`
3. Create models: `User.js`, `Chat.js`, `StudyTool.js`
4. Add database connection in server
5. Update controllers to save data
6. Build chat history UI
7. Create dashboard to view saved tools

**Database Schema Ideas:**
```javascript
User: {
  githubId, username, email, avatar,
  chats: [ChatId], 
  studyTools: [StudyToolId]
}

Chat: {
  userId, title, messages: [{role, content}],
  createdAt, updatedAt
}

StudyTool: {
  userId, chatId, type: 'flashcard|test|memory',
  content: {}, createdAt
}
```

---

### 🚀 Phase 5: Advanced Features (If Time Permits)
**Status:** Not Started

**Goals:**
- [ ] ElevenLabs text-to-speech
- [ ] OpenRouter integration for model flexibility
- [ ] Speech-to-text for voice input
- [ ] Share study tools with others
- [ ] Study tool analytics (track progress)
- [ ] Mobile responsive design improvements

**Optional Enhancements:**
- Dark mode
- Custom AI personality settings
- Subject-specific tutors
- Gamification (XP, badges)
- Study streaks and reminders

---

## 🛠 Technical Decisions

### Why These Technologies?

**Frontend:**
- **React + TypeScript:** Type safety, component reusability
- **Tailwind CSS:** Rapid UI development, consistent styling
- **Framer Motion:** Smooth animations, better UX
- **Vite:** Fast builds and HMR

**Backend:**
- **Express.js:** Lightweight, flexible, easy to learn
- **MongoDB + Mongoose:** Document-based storage perfect for chat history
- **Passport.js:** Well-established OAuth library

**APIs:**
- **Gemini API:** Powerful, affordable, good for conversations
- **GitHub OAuth:** Easy to implement, fits developer audience

---

## 📊 Time Estimates

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| Phase 1: Core Chat | 2-3 hours | HIGH |
| Phase 2: Study Tools | 3-4 hours | HIGH |
| Phase 3: Authentication | 2-3 hours | MEDIUM |
| Phase 4: Data Persistence | 3-4 hours | MEDIUM |
| Phase 5: Advanced Features | 4+ hours | LOW |

**Total Core Functionality:** ~10-14 hours  
**Hackathon Realistic Goal:** Phases 1-3 (7-10 hours)

---

## 🎨 UI/UX Considerations

### Design Principles
1. **Simple and Clean** - Focus on the chat, minimize distractions
2. **Friendly and Encouraging** - Use warm colors, positive messaging
3. **Responsive** - Mobile-first design
4. **Accessible** - Proper contrast, keyboard navigation

### Color Scheme
- Primary: Purple (#8b5cf6) - Growth, creativity, learning
- Accent: Blue - Trust, intelligence
- Background: Light gradients - Clean, modern
- Success: Green - Achievement, progress

---

## 🐛 Known Considerations

### Potential Issues
1. **API Rate Limits** - Gemini API might have limits
2. **Chat Context Size** - Long conversations may exceed token limits
3. **Cost Management** - Monitor API usage
4. **Session Management** - Handle disconnections gracefully

### Solutions
1. Implement request queuing and retry logic
2. Summarize old messages or limit context window
3. Add usage tracking and warnings
4. Use local storage for guest users, sessions for authenticated

---

## 📝 Notes for Future

### Ideas to Explore
- [ ] Collaborative study sessions (multiplayer)
- [ ] AI-generated quizzes with scoring
- [ ] Integration with learning management systems
- [ ] Export to Anki format
- [ ] Subject-specific tutor modes
- [ ] Parent/teacher dashboard

### Community Features
- [ ] Share study guides publicly
- [ ] Upvote/review generated materials
- [ ] Study groups and challenges

---

## 🏆 Success Metrics

### Minimum Viable Product (MVP)
- ✅ User can chat with AI tutor
- ✅ Conversation maintains context
- ✅ Clean, functional UI
- ⬜ Generate at least one type of study tool
- ⬜ User authentication works

### Stretch Goals
- ⬜ Save and load chat history
- ⬜ All three study tool types working
- ⬜ Polished, professional UI
- ⬜ Voice features implemented
- ⬜ Mobile responsive

---

Good luck! Remember: **Working beats perfect.** Get Phase 1 solid, then iterate! 🌱
