# 🚀 Food Waste Reduction App - Complete Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Accounts Needed (All FREE):
- ✅ GitHub account (already done)
- ✅ Render account - https://render.com
- ✅ Vercel account - https://vercel.com
- ✅ Free MySQL database - https://www.db4free.net

### Repository:
- ✅ Code pushed to: https://github.com/rahularani/reduction-app

---

## Database Setup

### Step 1: Create Free MySQL Database

1. **Go to**: https://www.db4free.net/signup.php

2. **Fill in the form**:
   ```
   Database Name: foodwastedb (or any name you want)
   Username: your_username (remember this!)
   Password: your_password (remember this!)
   Email: your_email@example.com
   ```

3. **Click "Signup"**

4. **Check your email** and click the confirmation link

5. **Save these details** (you'll need them later):
   ```
   Host: db4free.net
   Port: 3306
   Database: foodwastedb
   Username: your_username
   Password: your_password
   ```

---

## Backend Deployment (Render)

### Step 1: Sign Up for Render

1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your GitHub

### Step 2: Create Web Service

1. **In Render Dashboard**, click "New +" → "Web Service"

2. **Connect Repository**:
   - Click "Connect GitHub"
   - Find and select: `rahularani/reduction-app`
   - Click "Connect"

3. **Configure Service**:
   ```
   Name: food-waste-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Click "Advanced"** to add environment variables

### Step 3: Add Environment Variables

Click "Add Environment Variable" for each of these:

```bash
# Server Configuration
PORT=5001
NODE_ENV=production

# Database Configuration (from db4free.net)
DB_HOST=db4free.net
DB_USER=your_username_from_db4free
DB_PASSWORD=your_password_from_db4free
DB_NAME=foodwastedb
DB_PORT=3306

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-random-string-make-it-very-long-and-complex

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (add after deploying frontend - leave empty for now)
FRONTEND_URL=
```

### Step 4: Deploy Backend

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see: `https://food-waste-backend.onrender.com`
4. **COPY THIS URL** - you'll need it for frontend!

### Step 5: Initialize Database

1. In Render dashboard, click your service
2. Go to "Shell" tab
3. Run this command:
   ```bash
   node create-admin.mjs
   ```
4. You should see: "✅ Admin user created successfully!"
5. **Save the admin credentials** shown

---

## Frontend Deployment (Vercel)

### Step 1: Sign Up for Vercel

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub
4. Authorize Vercel

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Find and click "Import" next to `rahularani/reduction-app`
3. Vercel will detect it's a monorepo

### Step 3: Configure Project

```
Framework Preset: Vite
Root Directory: Click "Edit" → Select "frontend"
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```bash
# Backend API URL (use your Render URL from above)
VITE_API_URL=https://food-waste-backend.onrender.com/api

# Google OAuth Client ID (same as backend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Step 5: Deploy Frontend

1. Click "Deploy"
2. Wait 2-3 minutes
3. Once deployed, you'll see: `https://your-app-name.vercel.app`
4. **COPY THIS URL** - you need to update backend!

---

## Post-Deployment Configuration

### Step 1: Update Backend with Frontend URL

1. Go back to **Render Dashboard**
2. Click your backend service
3. Go to "Environment" tab
4. Find `FRONTEND_URL` variable
5. Update it with your Vercel URL:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
6. Click "Save Changes"
7. Service will auto-redeploy (wait 2-3 minutes)

### Step 2: Update Google OAuth Settings

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to "Credentials" → Click your OAuth 2.0 Client
4. Add to "Authorized JavaScript origins":
   ```
   https://your-app-name.vercel.app
   ```
5. Add to "Authorized redirect URIs":
   ```
   https://your-app-name.vercel.app
   ```
6. Click "Save"

### Step 3: Update Backend CORS (if needed)

If you get CORS errors, update `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app-name.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}))
```

Then commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Both Render and Vercel will auto-deploy!

---

## Testing

### Test Your Deployed App

1. **Visit your app**: `https://your-app-name.vercel.app`

2. **Test Login**:
   - Use admin credentials from database initialization
   - Email: `admin@foodwaste.com`
   - Password: `admin123`

3. **Test Features**:
   - ✅ Register new user
   - ✅ Login with new user
   - ✅ Create food post (as donor)
   - ✅ Upload image
   - ✅ Claim food (as volunteer)
   - ✅ Real-time updates
   - ✅ Google OAuth login

4. **Check Backend Logs**:
   - Go to Render Dashboard → Your service → "Logs"
   - Look for any errors

5. **Check Frontend Logs**:
   - Open browser console (F12)
   - Look for any errors

---

## Troubleshooting

### Backend Issues

**Problem**: Backend shows "Application failed to respond"
- **Solution**: Check Render logs for errors
- **Solution**: Verify all environment variables are set correctly
- **Solution**: Check database connection (db4free.net might be slow)

**Problem**: Database connection errors
- **Solution**: Verify db4free.net credentials
- **Solution**: Try pinging db4free.net to check if it's online
- **Solution**: Consider using Railway or PlanetScale for better reliability

**Problem**: Backend sleeps after 15 minutes
- **Solution**: This is normal for Render free tier
- **Solution**: Use cron-job.org to ping your backend every 10 minutes
- **Solution**: First request after sleep takes ~30 seconds

### Frontend Issues

**Problem**: "Failed to fetch" errors
- **Solution**: Check if backend URL is correct in environment variables
- **Solution**: Verify backend is running (visit backend URL in browser)
- **Solution**: Check CORS settings in backend

**Problem**: Images not loading
- **Solution**: Images are stored on Render's filesystem
- **Solution**: Files are deleted when service restarts
- **Solution**: Consider using Cloudinary for image hosting (free tier)

**Problem**: Google OAuth not working
- **Solution**: Verify authorized origins and redirect URIs in Google Console
- **Solution**: Make sure GOOGLE_CLIENT_ID matches in both frontend and backend

### Database Issues

**Problem**: "Too many connections"
- **Solution**: db4free.net has connection limits
- **Solution**: Restart your backend service
- **Solution**: Consider upgrading to Railway or PlanetScale

**Problem**: Slow database queries
- **Solution**: db4free.net is slow (free tier)
- **Solution**: This is normal, queries may take 1-2 seconds
- **Solution**: For production, use Railway ($5/month) or PlanetScale (free tier)

---

## 🎯 Quick Reference

### Your Deployment URLs

```
Frontend: https://your-app-name.vercel.app
Backend: https://food-waste-backend.onrender.com
Database: db4free.net:3306
Repository: https://github.com/rahularani/reduction-app
```

### Admin Credentials

```
Email: admin@foodwaste.com
Password: admin123
```

**⚠️ IMPORTANT**: Change admin password after first login!

### Auto-Deploy

Both services auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Wait 2-3 minutes and your changes will be live!

---

## 📊 Free Tier Limits

### Render Free Tier:
- ✅ 750 hours/month (enough for 1 app)
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Wakes up in ~30 seconds
- ✅ 512 MB RAM
- ✅ Automatic SSL

### Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Always online (no sleep)
- ✅ Automatic SSL
- ✅ Global CDN

### db4free.net:
- ✅ 200 MB storage
- ⚠️ Slow performance
- ⚠️ Not for production
- ✅ MySQL 8.0

---

## 🚀 Next Steps

1. **Test thoroughly** - Make sure all features work
2. **Change admin password** - Security first!
3. **Monitor logs** - Check for errors regularly
4. **Consider upgrades**:
   - Railway for better database ($5/month)
   - Cloudinary for image hosting (free tier)
   - Render paid tier for no sleep ($7/month)

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Check Render logs for backend errors
3. Check browser console for frontend errors
4. Verify all environment variables are correct
5. Make sure database is accessible

---

## ✅ Deployment Checklist

- [ ] Database created on db4free.net
- [ ] Backend deployed on Render
- [ ] All environment variables added to Render
- [ ] Admin user created in database
- [ ] Frontend deployed on Vercel
- [ ] Environment variables added to Vercel
- [ ] Backend updated with frontend URL
- [ ] Google OAuth updated with production URLs
- [ ] CORS configured for production
- [ ] App tested and working
- [ ] Admin password changed

---

**🎉 Congratulations! Your app is now live!**

Frontend: https://your-app-name.vercel.app
Backend: https://food-waste-backend.onrender.com

Share your app and help reduce food waste! 🌱
