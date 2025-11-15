# Room To Grow - Setup Guide

## Phase 1: Core Chat Application (Current Focus)

### 🎯 Goal
Build an unauthenticated AI tutor chat interface that communicates with the Gemini API.

---

## Setup Instructions

### Backend Setup

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Add your Gemini API key** to `.env`
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Update `package.json`** - Add `"type": "module"` after the version field
   ```json
   {
     "name": "server",
     "version": "1.0.0",
     "type": "module",
     ...
   }
   ```

6. **Start the server**
   ```bash
   npm start
   ```
   Server should run on `http://localhost:3000`

---

### Frontend Setup

1. **Navigate to the client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS and Framer Motion**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npm install framer-motion
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Client should run on `http://localhost:5173`

---

## Testing Phase 1

1. Start the backend server (port 3000)
2. Start the frontend dev server (port 5173)
3. Open `http://localhost:5173` in your browser
4. Try chatting with the AI tutor!

---

## Current Features

✅ AI tutor chat interface  
✅ Real-time conversation with Gemini API  
✅ Chat history maintained in the session  
✅ Clean, modern UI with animations  
✅ Loading states and error handling  

---

## Next Steps (Future Phases)

### Phase 2: Study Tools Generation
- Add buttons to generate flashcards, practice tests, and memory cards
- Create new endpoints in the backend for these tools
- Design UI components for displaying generated content

### Phase 3: User Authentication
- Implement GitHub OAuth with Passport.js
- Create user model in MongoDB
- Add login/logout functionality

### Phase 4: Data Persistence
- Connect to MongoDB Atlas
- Save chat histories for registered users
- Save generated study tools
- Implement chat management (view, delete, rename)

### Phase 5: Advanced Features
- ElevenLabs text-to-speech integration
- Openrouter for model flexibility
- Speech-to-text for voice input
- Export study tools (PDF, print, etc.)

---

## Troubleshooting

### Server won't start
- Make sure you added `"type": "module"` to `server/package.json`
- Verify your `.env` file has a valid `GEMINI_API_KEY`
- Check if port 3000 is already in use

### Frontend errors
- Run `npm install` in the client directory
- Make sure Tailwind and Framer Motion are installed
- Clear your browser cache

### CORS errors
- The backend has CORS enabled for all origins in development
- Make sure the backend is running on port 3000

---

## Project Structure

```
room-to-grow/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx        # Main chat interface
│   │   ├── index.css      # Tailwind imports
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   │   └── chatController.js    # AI chat logic
│   ├── routes/
│   │   └── chatRoutes.js        # API endpoints
│   ├── config/
│   │   └── dotenv.js
│   ├── server.js                # Main server file
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### POST `/api/chat`
Send a message to the AI tutor

**Request Body:**
```json
{
  "message": "Explain quantum physics",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "model",
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "message": "AI response here",
  "role": "model"
}
```

### POST `/api/chat/new`
Create a new chat session

**Response:**
```json
{
  "message": "New chat session created",
  "chatId": "1234567890"
}
```

---

## Tips for Hackathon Success

1. **Focus on Phase 1 first** - Get the core working before adding features
2. **Test frequently** - Make sure chat works before moving to study tools
3. **Keep it simple** - Start with basic UI, enhance later if time permits
4. **Document as you go** - Add comments to tricky code
5. **Version control** - Commit working versions frequently

Good luck with your hackathon! 🚀🌱
