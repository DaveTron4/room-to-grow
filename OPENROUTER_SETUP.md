# OpenRouter Integration Guide

## What is OpenRouter?

OpenRouter is an AI model aggregator that provides access to multiple AI models (GPT-4, Claude, Gemini, Llama, etc.) through a single unified API. This means:

✅ **No more Gemini-specific code** - Access Gemini and many other models
✅ **Easy model switching** - Change models with just an environment variable
✅ **Better pricing** - Often cheaper than using APIs directly
✅ **Built-in fallbacks** - Switch models if one is down
✅ **Usage tracking** - Monitor costs across all models in one place

## Setup Instructions

### 1. Get Your OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Go to [Keys](https://openrouter.ai/keys) in your dashboard
4. Create a new API key
5. Add credits to your account (minimum $5 recommended)

### 2. Install Dependencies

```powershell
cd server
npm install openai
```

The `openai` package is compatible with OpenRouter's API.

### 3. Update Your Environment Variables

Add to your `server/.env` file:

```env
# OpenRouter API Key (required)
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Optional: Choose your models (defaults to free Gemini)
OPENROUTER_CHAT_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_GENERATION_MODEL=google/gemini-2.0-flash-exp:free

# Legacy (optional - only needed if you want to keep old Gemini controller)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Choose Your Models

OpenRouter supports many models. Here are some popular options:

#### Free Models (Great for Development)
- `google/gemini-2.0-flash-exp:free` - Fast, free Gemini (current default)
- `meta-llama/llama-3.2-3b-instruct:free` - Free Llama model

#### Premium Models (Better Quality)
- `google/gemini-2.0-flash-thinking-exp:free` - Gemini with reasoning
- `openai/gpt-4-turbo` - OpenAI's GPT-4 Turbo
- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `google/gemini-pro-1.5` - Gemini Pro (paid)
- `meta-llama/llama-3.1-70b-instruct` - Large Llama model

#### Budget Options
- `openai/gpt-3.5-turbo` - Cheaper than GPT-4, still good
- `google/gemini-flash-1.5` - Fast and affordable

See all models at: https://openrouter.ai/models

### 5. Model Configuration

You can use different models for different tasks:

```env
# Use free Gemini for chat (fast responses)
OPENROUTER_CHAT_MODEL=google/gemini-2.0-flash-exp:free

# Use Claude for quiz/flashcard generation (better structured output)
OPENROUTER_GENERATION_MODEL=anthropic/claude-3.5-sonnet
```

Or use the same model for everything:

```env
OPENROUTER_CHAT_MODEL=openai/gpt-4-turbo
OPENROUTER_GENERATION_MODEL=openai/gpt-4-turbo
```

## What Changed?

### Files Modified
1. **New Controller**: `server/controllers/chatControllerOpenRouter.js`
   - Replaces Google Gemini SDK with OpenRouter
   - Uses OpenAI-compatible API
   - All existing functionality preserved

2. **Updated Routes**: `server/routes/chatRoutes.js`
   - Now imports from OpenRouter controller
   - No frontend changes needed!

3. **Environment**: `server/.env.example`
   - Added `OPENROUTER_API_KEY`
   - Made `GEMINI_API_KEY` optional

### Key Benefits

**Before (Gemini only):**
```javascript
import { GoogleGenAI } from '@google/genai';
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Locked into Gemini only
```

**After (OpenRouter - any model):**
```javascript
import OpenAI from 'openai';
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});
// Can use GPT-4, Claude, Gemini, Llama, etc.
```

## Testing

Start your server and test:

```powershell
cd server
npm start
```

The chat should work exactly as before, but now using OpenRouter!

## Monitoring Usage

1. Go to your [OpenRouter Dashboard](https://openrouter.ai/activity)
2. View real-time usage and costs
3. Monitor which models you're using

## Troubleshooting

### Error: "OPENROUTER_API_KEY is not configured"
- Make sure you added the key to `server/.env`
- Restart your server after adding the key

### Error: "Insufficient credits"
- Add credits at https://openrouter.ai/credits
- Free models don't require credits

### Want to use multiple models?
Set different models for chat vs generation:
```env
OPENROUTER_CHAT_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_GENERATION_MODEL=anthropic/claude-3.5-sonnet
```

### Want to go back to Gemini directly?
Just change the import in `server/routes/chatRoutes.js`:
```javascript
// From:
import { ... } from '../controllers/chatControllerOpenRouter.js';
// To:
import { ... } from '../controllers/chatController.js';
```

## Cost Optimization

### Free Tier Strategy
```env
OPENROUTER_CHAT_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_GENERATION_MODEL=google/gemini-2.0-flash-exp:free
```
Cost: **$0.00** ✅

### Balanced Strategy
```env
OPENROUTER_CHAT_MODEL=google/gemini-flash-1.5  # $0.075 / 1M tokens
OPENROUTER_GENERATION_MODEL=google/gemini-flash-1.5
```
Cost: **Very low** (~$0.01 per 100 chats) ✅

### Premium Strategy
```env
OPENROUTER_CHAT_MODEL=anthropic/claude-3.5-sonnet  # $3 / 1M tokens
OPENROUTER_GENERATION_MODEL=anthropic/claude-3.5-sonnet
```
Cost: **Higher quality** (~$0.30 per 100 chats) 💎

## Next Steps

1. ✅ Get OpenRouter API key
2. ✅ Run `npm install openai` in server folder
3. ✅ Add `OPENROUTER_API_KEY` to `.env`
4. ✅ Choose your models (or use free Gemini default)
5. ✅ Restart server
6. ✅ Test chat functionality
7. 🎉 Enjoy access to multiple AI models!
