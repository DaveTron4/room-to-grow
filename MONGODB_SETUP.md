# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/room-to-grow?retryWrites=true&w=majority

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (M0 tier is free forever)
3. Create a new cluster (choose AWS, region closest to you)

## 2. Configure Database Access

1. In MongoDB Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create a username and password (save these!)
5. Set **Database User Privileges** to "Atlas admin"
6. Click **Add User**

## 3. Configure Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. For development, click **Allow Access from Anywhere** (0.0.0.0/0)
   - For production, restrict to specific IPs
4. Click **Confirm**

## 4. Get Connection String

1. Go to **Database** (in left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 5. Update Your .env File

Create `server/.env` file (if it doesn't exist) with:

```env
# API Keys
GEMINI_API_KEY=your_actual_gemini_key

# Server
PORT=3000
NODE_ENV=development

# MongoDB Atlas - REPLACE WITH YOUR VALUES
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/room-to-grow?retryWrites=true&w=majority

# GitHub OAuth - REPLACE WITH YOUR VALUES
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
```

**Important**: 
- Replace `<username>` with your MongoDB username
- Replace `<password>` with your MongoDB password
- Add `/room-to-grow` after `.net` to specify database name
- URL encode special characters in password (e.g., `@` becomes `%40`)

## 6. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Room To Grow
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Click **Register application**
5. Copy **Client ID** to `.env` as `GITHUB_CLIENT_ID`
6. Click **Generate a new client secret**
7. Copy the secret to `.env` as `GITHUB_CLIENT_SECRET`

## 7. Test the Connection

Start your server:
```bash
cd server
npm run dev
```

You should see:
```
📦 MongoDB Atlas connected successfully
🚀 Server is running on http://localhost:3000
```

## Database Structure

Your MongoDB will have 3 collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  githubId: String,
  username: String,
  displayName: String,
  email: String,
  profileUrl: String,
  avatarUrl: String,
  createdAt: Date
}
```

### Chats Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  messages: [{
    role: 'user' | 'model',
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Activities Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  chatId: ObjectId (ref: Chat),
  type: 'flashcard' | 'quiz',
  title: String,
  data: Mixed (flashcards array or quiz array),
  createdAt: Date
}
```

## Troubleshooting

### Connection Errors
- Check if IP is whitelisted in Network Access
- Verify username/password are correct
- Ensure special characters in password are URL encoded

### Authentication Errors
- Verify GitHub OAuth credentials are correct
- Check callback URL matches exactly
- Ensure GitHub app is not suspended

## Next Steps

After setup, you'll need to:
1. Update `chatController.js` to save/load chats from MongoDB
2. Create middleware to protect routes (require authentication)
3. Add API endpoints for:
   - GET `/api/chats` - Get user's chat history
   - POST `/api/chats` - Create new chat
   - GET `/api/chats/:id` - Get specific chat
   - DELETE `/api/chats/:id` - Delete chat
   - GET `/api/activities` - Get user's activities
   - DELETE `/api/activities/:id` - Delete activity
