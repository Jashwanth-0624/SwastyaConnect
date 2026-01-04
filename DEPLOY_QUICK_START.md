# Quick Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Deploy Backend (Railway - Free)

1. Go to https://railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo → Choose **"backend"** folder
4. Add Environment Variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://rjashwanth562_db_user:nLK2pSF5Tukbaj3u@cluster0.o2sxngl.mongodb.net/?appName=Cluster0`
5. Wait for deployment → Copy the URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend (Vercel - Free)

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project" → Import your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-app.railway.app/api` (use your Railway URL from Step 1)
5. Click "Deploy"

### Step 3: Done! 🎉

Your app will be live at: `https://your-app.vercel.app`

## 📝 Important Notes

- Backend URL must end with `/api` (e.g., `https://backend.railway.app/api`)
- Make sure MongoDB connection string is correct
- CORS is already configured to allow Vercel domains

## 🔧 Troubleshooting

**API not working?**
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend is running (visit `https://your-backend.railway.app/api/health`)
- Check browser console for CORS errors

**Build failing?**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`

