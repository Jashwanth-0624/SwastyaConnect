# Vercel Deployment Guide

This guide will help you deploy your SwasthyaConnect application to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Backend Deployment** - Your backend needs to be deployed separately (see Backend Deployment section)

## Step 1: Deploy Backend First

Since your frontend depends on the backend API, deploy the backend first.

### Option A: Deploy Backend to Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and choose the `backend` folder
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 5000 (or leave empty, Railway will assign one)
5. Railway will automatically deploy and give you a URL like: `https://your-app.railway.app`
6. Copy this URL - you'll need it for the frontend

### Option B: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 5000
6. Deploy and copy the URL

## Step 2: Deploy Frontend to Vercel

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root of your repo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
     (Replace with your actual backend URL from Step 1)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `https://your-app.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add `VITE_API_URL`

4. **For Production Deployment**
   ```bash
   vercel --prod
   ```

## Step 3: Update CORS in Backend

Make sure your backend allows requests from your Vercel domain:

In `backend/server.js`, update CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://your-app.vercel.app/*'
  ],
  credentials: true
}));
```

Or allow all origins (for development):
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Check browser console for any errors
3. Test adding a patient
4. Verify API calls are working

## Troubleshooting

### Issue: API calls failing
- **Solution**: Check that `VITE_API_URL` is set correctly in Vercel environment variables
- Verify your backend is running and accessible
- Check CORS settings in backend

### Issue: Build fails
- **Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Issue: Routes not working
- **Solution**: The `vercel.json` file should handle this with rewrites
- Ensure all routes redirect to `index.html` for client-side routing

## Environment Variables Summary

### Frontend (Vercel)
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app/api`)

### Backend (Railway/Render)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (optional, defaults to 5000)

## Next Steps

1. Set up a custom domain (optional)
2. Enable automatic deployments on git push
3. Set up monitoring and error tracking
4. Configure production environment variables

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check backend logs (Railway/Render dashboard)
3. Verify environment variables are set correctly
4. Check browser console for errors

