# API URL Configuration Guide

## Problem Fixed
Previously, all API calls were hardcoded to `http://localhost:5000`, which caused errors when deploying to Vercel because the frontend couldn't reach the backend server.

## Solution
Created a centralized API utility that reads the backend URL from environment variables (`VITE_API_URL`).

## Files Changed

### New Files
1. **`frontend/src/utils/api.js`** - Centralized API utility
   - `buildApiUrl(endpoint)` - Constructs full API URLs
   - `apiFetch(endpoint, options)` - Fetch wrapper with auth
   - Reads `VITE_API_URL` from environment

2. **`frontend/.env.example`** - Template for local development
3. **`frontend/.env.production`** - Template for production (Vercel)

### Updated Files
All components now import and use `buildApiUrl()`:
- `Login.jsx` - `/auth/login`
- `Signup.jsx` - `/auth/signup`
- `Settings.jsx` - `/auth/update-api-keys`
- `ApiKeyInput.jsx` - `/test-api-key`
- `App.jsx` - `/auth/me`
- `Chat.jsx` - `/chats`, `/upload`, `/chat`

## Configuration

### Local Development
File: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### Vercel Production Deployment

#### Option 1: Using .env.production file
File: `frontend/.env.production`
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

#### Option 2: Vercel Dashboard (Recommended)
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api`
   - **Environment:** Production

3. Redeploy your application

## Backend URL Examples

### If backend is on Render.com:
```
VITE_API_URL=https://chat-bot-backend.onrender.com/api
```

### If backend is on Railway:
```
VITE_API_URL=https://your-app.railway.app/api
```

### If backend is on Heroku:
```
VITE_API_URL=https://your-app.herokuapp.com/api
```

## Testing

### Local Testing
```bash
cd frontend
npm run dev
# Should connect to http://localhost:5000/api
```

### Production Testing
```bash
cd frontend
npm run build
npm run preview
# Should connect to VITE_API_URL from .env.production
```

## How It Works

1. **Development Mode** (`npm run dev`):
   - Vite loads `.env` file
   - `VITE_API_URL=http://localhost:5000/api`
   - All API calls go to local backend

2. **Production Build** (`npm run build`):
   - Vite loads `.env.production` file
   - `VITE_API_URL=https://your-backend.com/api`
   - All API calls go to production backend

3. **Vercel Deployment**:
   - Vercel overrides with environment variables from dashboard
   - No need to commit production URLs to git

## Troubleshooting

### Issue: "Failed to fetch" or CORS errors
**Solution:** Make sure your backend URL in `VITE_API_URL` includes `/api` at the end and matches the actual backend deployment URL.

### Issue: Still getting localhost errors in production
**Solution:** 
1. Clear browser cache
2. Verify `VITE_API_URL` is set in Vercel dashboard
3. Redeploy from Vercel dashboard
4. Check browser console to see what URL is being called

### Issue: 404 Not Found
**Solution:** Your `VITE_API_URL` should end with `/api`:
- ✅ Correct: `https://backend.com/api`
- ❌ Wrong: `https://backend.com`

## Security Notes

- ✅ **Safe to commit:** `.env.example`, `.env.production` (with placeholder values)
- ❌ **Never commit:** `.env` (with real API keys)
- ✅ **Use Vercel dashboard:** For production environment variables

## Next Steps

1. **Deploy your backend** to Render.com or similar service
2. **Get the backend URL** (e.g., `https://chat-bot-backend.onrender.com`)
3. **Add `/api` to the URL** (e.g., `https://chat-bot-backend.onrender.com/api`)
4. **Set in Vercel:** Dashboard → Settings → Environment Variables → `VITE_API_URL`
5. **Redeploy** your frontend on Vercel

Your app should now work in production! 🎉
