# 🚀 Food Waste Reduction App - Complete Deployment Guide

## 📋 Using Render for Everything (Backend + Database + Frontend)

---

## Prerequisites

### Accounts Needed (All FREE):
- ✅ GitHub account (already done)
- ✅ Render account - https://render.com
- ✅ Vercel account - https://vercel.com

### Repository:
- ✅ Code pushed to: https://github.com/rahularani/reduction-app
- ✅ Backend code updated to support PostgreSQL

---

## Step 1: Create PostgreSQL Database on Render

### 1.1 Sign Up for Render

1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your GitHub

### 1.2 Create PostgreSQL Database

1. **In Render Dashboard**, click "New +" → "PostgreSQL"

2. **Configure Database**:
   ```
   Name: foodwastedb
   Database: foodwastedb
   User: foodwastedb_user
   Region: Oregon (US West) or closest to you
   ```

3. **Click "Create Database"**

4. **Wait 2-3 minutes** for database to be created

5. **Get Connection Details**:
   - Click on your database service
   - Go to "Connections" tab
   - Copy these details:
   ```
   Host: dpg-d6np1tea2pns73fm8st0-a
   Port: 5432
   Database: foodwastedb_iyx7
   Username: foodwastedb_iyx7_user
   Password: GiHLia3vp5yMfOFBMuwK8a1ugHg6Ltr3
   ```
   - **SAVE THESE DETAILS** - you'll need them for backend!

---

## Step 2: Deploy Backend on Render

### 2.1 Create Web Service

1. **In Render Dashboard**, click "New +" → "Web Service"

2. **Connect Repository**:
   - Click "Connect GitHub"
   - Find and select: `rahularani/reduction-app`
   - Click "Connect"

3. **Configure Service**:
   ```
   Name: food-waste-backend
   Region: Oregon (US West) or same as database
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

4. **Click "Advanced"** to add environment variables

### 2.2 Add Environment Variables

Click "Add Environment Variable" for each of these:

```bash
# Server Configuration
PORT=5001
NODE_ENV=production

# Database Configuration (from Render PostgreSQL)
DB_DIALECT=postgres
DB_HOST=dpg-d6np1tea2pns73fm8st0-a
DB_USER=foodwastedb_iyx7_user
DB_PASSWORD=GiHLia3vp5yMfOFBMuwK8a1ugHg6Ltr3
DB_NAME=foodwastedb_iyx7
DB_PORT=5432

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-random-string-make-it-very-long-and-complex

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (add after deploying frontend)
FRONTEND_URL=
```

### 2.3 Deploy Backend

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see: `https://food-waste-backend.onrender.com`
4. **COPY THIS URL** - you'll need it for frontend!

### 2.4 Initialize Database

1. In Render dashboard, click your backend service
2. Go to "Shell" tab
3. Run this command:
   ```bash
   node create-admin.mjs
   ```
4. You should see: "✅ Admin user created successfully!"
5. **Save the admin credentials** shown

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Sign Up for Vercel

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub
4. Authorize Vercel

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Find and click "Import" next to `rahularani/reduction-app`
3. Vercel will detect it's a monorepo

### 3.3 Configure Project

```
Framework Preset: Vite
Root Directory: Click "Edit" → Select "frontend"
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.4 Add Environment Variables

Click "Environment Variables" and add:

```bash
# Backend API URL (use your Render URL from Step 2.3)
VITE_API_URL=https://food-waste-backend.onrender.com/api

# Google OAuth Client ID (same as backend)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3.5 Deploy Frontend

1. Click "Deploy"
2. Wait 2-3 minutes
3. Once deployed, you'll see: `https://your-app-name.vercel.app`
4. **COPY THIS URL** - you need to update backend!

---

## Step 4: Update Backend with Frontend URL

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

---

## Step 5: Update Google OAuth Settings

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

---

## Step 6: Test Your Deployed App

### 6.1 Visit Your App

1. Go to: `https://your-app-name.vercel.app`

### 6.2 Test Features

- ✅ Login with admin credentials (from Step 2.4)
- ✅ Register new user
- ✅ Create food post (as donor)
- ✅ Upload image
- ✅ Claim food (as volunteer)
- ✅ Real-time updates
- ✅ Google OAuth login

### 6.3 Check Logs

**Backend Logs**:
- Go to Render Dashboard → Your service → "Logs"
- Look for any errors

**Frontend Logs**:
- Open browser console (F12)
- Look for any errors

---

## 🎯 Your Deployment URLs

```
Frontend: https://your-app-name.vercel.app
Backend: https://food-waste-backend.onrender.com
Database: Render PostgreSQL
Repository: https://github.com/rahularani/reduction-app
```

---

## 📊 Free Tier Limits

### Render Free Tier:
- ✅ 750 hours/month (enough for 1 app)
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Wakes up in ~30 seconds
- ✅ 512 MB RAM
- ✅ Automatic SSL
- ✅ Free PostgreSQL database

### Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Always online (no sleep)
- ✅ Automatic SSL
- ✅ Global CDN

---

## 🔄 Auto-Deploy

Both services auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Wait 2-3 minutes and your changes will be live!

---

## 🚨 Troubleshooting

### Backend Issues

**Problem**: Backend shows "Application failed to respond"
- **Solution**: Check Render logs for errors
- **Solution**: Verify all environment variables are set correctly
- **Solution**: Check database connection

**Problem**: Database connection errors
- **Solution**: Verify Render PostgreSQL credentials
- **Solution**: Check if database is running
- **Solution**: Verify DB_DIALECT is set to "postgres"

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

**Problem**: Cannot connect to database
- **Solution**: Verify Render PostgreSQL credentials are correct
- **Solution**: Check if database is running
- **Solution**: Verify DB_DIALECT=postgres in environment variables

**Problem**: Slow database queries
- **Solution**: Render PostgreSQL is good performance
- **Solution**: Check your queries
- **Solution**: Consider upgrading Render plan if needed

---

## ✅ Deployment Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database connection details saved
- [ ] Backend deployed on Render
- [ ] All environment variables added to Render
- [ ] Admin user created in database
- [ ] Frontend deployed on Vercel
- [ ] Environment variables added to Vercel
- [ ] Backend updated with frontend URL
- [ ] Google OAuth updated with production URLs
- [ ] App tested and working
- [ ] Admin password changed

---

## 📝 Admin Credentials

```
Email: admin@foodwaste.com
Password: admin123
```

**⚠️ IMPORTANT**: Change admin password after first login!

---

**🎉 Congratulations! Your app is now live!**

Frontend: https://your-app-name.vercel.app
Backend: https://food-waste-backend.onrender.com

Share your app and help reduce food waste! 🌱
