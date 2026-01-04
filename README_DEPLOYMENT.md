# 🚀 Vercel Deployment - Complete Guide

Your SwasthyaConnect app is ready to deploy! Follow these steps:

## 📋 Prerequisites Checklist

- [ ] Code is ready (all features working)
- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Railway account (free) for backend

## 🎯 Quick Start (5 Steps)

### 1️⃣ Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 2️⃣ Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy Backend to Railway

1. Visit https://railway.app → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. In project settings, set **Root Directory** to: `backend`
5. Go to **Variables** tab, add:
   ```
   MONGODB_URI = mongodb+srv://rjashwanth562_db_user:nLK2pSF5Tukbaj3u@cluster0.o2sxngl.mongodb.net/?appName=Cluster0
   ```
6. Wait for deployment → Copy the URL (e.g., `https://swastya-backend.railway.app`)

### 4️⃣ Deploy Frontend to Vercel

1. Visit https://vercel.com → Sign up with GitHub
2. Click **"Add New Project"** → Import your repository
3. Configure:
   - Framework: **Vite** (auto-detected)
   - Root Directory: `.` (root)
   - Build Command: `npm run build` (auto)
   - Output Directory: `dist` (auto)
4. Go to **Environment Variables**, add:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
   (Replace with your actual Railway URL from step 3)
5. Click **"Deploy"**

### 5️⃣ Verify Deployment

- Frontend: Visit `https://your-app.vercel.app`
- Backend Health: Visit `https://your-backend.railway.app/api/health`
- Test: Try adding a patient in the deployed app

## ✅ What's Already Configured

- ✅ `vercel.json` - Vercel configuration
- ✅ CORS settings - Backend allows Vercel domains
- ✅ Environment variables - API client uses `VITE_API_URL`
- ✅ Build configuration - Vite build setup
- ✅ Routing - React Router rewrites configured

## 🔧 Environment Variables Reference

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway)
```
MONGODB_URI=mongodb+srv://rjashwanth562_db_user:nLK2pSF5Tukbaj3u@cluster0.o2sxngl.mongodb.net/?appName=Cluster0
PORT=5000 (optional)
```

## 🐛 Troubleshooting

### Issue: "API calls failing"
**Solution:**
- Verify `VITE_API_URL` in Vercel settings
- Check backend is running: visit `https://your-backend.railway.app/api/health`
- Open browser console → Check for CORS errors
- Verify backend URL ends with `/api`

### Issue: "Build failed"
**Solution:**
- Check Vercel build logs
- Ensure all dependencies in `package.json`
- Try clearing Vercel cache and redeploy

### Issue: "Routes not working"
**Solution:**
- `vercel.json` should handle this automatically
- All routes redirect to `index.html` for client-side routing

### Issue: "CORS errors"
**Solution:**
- Backend CORS is configured to allow Vercel domains
- If still issues, check `backend/server.js` CORS settings

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Full Deployment Guide**: See `VERCEL_DEPLOYMENT.md`

## 🎉 Success!

Once deployed, your app will be:
- ✅ Live on Vercel (frontend)
- ✅ Connected to MongoDB Atlas
- ✅ Backend running on Railway
- ✅ Fully functional with all features

## 🔄 Updating Your Deployment

After making changes:
1. Commit changes: `git add . && git commit -m "Update"`
2. Push: `git push`
3. Vercel and Railway will auto-deploy!

---

**Need Help?** Check the detailed guide in `VERCEL_DEPLOYMENT.md`

