# 🚀 Deploy Your App NOW - Free Tier Guide

## ⏱️ Total Time: 30 Minutes | Cost: $0

---

## 📋 What You'll Need

- [ ] GitHub account (free)
- [ ] Vercel account (free) - https://vercel.com
- [ ] Render account (free) - https://render.com
- [ ] Railway account (free) - https://railway.app
- [ ] Your code pushed to GitHub

---

## 🎯 Overview

We'll deploy in this order:
1. **Database** (Railway) - 5 minutes
2. **Backend** (Render) - 10 minutes
3. **Frontend** (Vercel) - 10 minutes
4. **Connect & Test** - 5 minutes

---

## Step 1: Push to GitHub (If not done)

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

✅ **Checkpoint**: Your code is on GitHub

---

## Step 2: Deploy Database (Railway) - 5 minutes

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### 2.2 Create MySQL Database
1. Click "New Project"
2. Select "Provision MySQL"
3. Wait for deployment (30 seconds)

### 2.3 Get Database Credentials
1. Click on the MySQL service
2. Go to "Variables" tab
3. Copy these values (you'll need them):
   ```
   MYSQL_HOST=<copy-this>
   MYSQL_PORT=<copy-this>
   MYSQL_USER=<copy-this>
   MYSQL_PASSWORD=<copy-this>
   MYSQL_DATABASE=<copy-this>
   ```

### 2.4 Save Credentials
Create a temporary file on your computer:
```
Railway Database Credentials:
MYSQL_HOST=containers-us-west-xxx.railway.app
MYSQL_PORT=6543
MYSQL_USER=root
MYSQL_PASSWORD=abc123xyz
MYSQL_DATABASE=railway
```

✅ **Checkpoint**: Database is running, credentials saved

---

## Step 3: Deploy Backend (Render) - 10 minutes

### 3.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started" → "Sign in with GitHub"
3. Authorize Render

### 3.2 Create Web Service
1. Click "New +" → "Web Service"
2. Click "Connect account" (if needed)
3. Find your repository: `food-waste-reduction-app`
4. Click "Connect"

### 3.3 Configure Service
Fill in these settings:

**Basic Settings**:
```
Name: food-waste-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
```

**Build & Deploy**:
```
Build Command: npm install && npm run build
Start Command: npm start
```

**Instance Type**:
```
Select: Free
```

### 3.4 Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these one by one:

```env
PORT
5001

NODE_ENV
production

DB_HOST
<paste-from-railway-MYSQL_HOST>

DB_PORT
<paste-from-railway-MYSQL_PORT>

DB_USER
<paste-from-railway-MYSQL_USER>

DB_PASSWORD
<paste-from-railway-MYSQL_PASSWORD>

DB_NAME
<paste-from-railway-MYSQL_DATABASE>

JWT_SECRET
<generate-this-now>

FRONTEND_URL
https://temporary-will-update-later.vercel.app
```

### 3.5 Generate JWT Secret

Open a terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste as `JWT_SECRET` value.

### 3.6 Optional: Google OAuth

If you want Google login, add:
```env
GOOGLE_CLIENT_ID
<your-google-client-id>

GOOGLE_CLIENT_SECRET
<your-google-client-secret>
```

### 3.7 Deploy!

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Watch the logs - should see "Server running on port 5001"

### 3.8 Get Backend URL

Once deployed:
1. Copy your backend URL (top of page)
2. Example: `https://food-waste-backend.onrender.com`
3. Save it - you'll need it for frontend

### 3.9 Test Backend

Visit: `https://food-waste-backend.onrender.com/api/health`

Should see: `{"status":"ok","message":"Server is running"}`

✅ **Checkpoint**: Backend is live and responding

---

## Step 4: Deploy Frontend (Vercel) - 10 minutes

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Find your repository: `food-waste-reduction-app`
3. Click "Import"

### 4.3 Configure Project

**Framework Preset**:
```
Vite (should auto-detect)
```

**Root Directory**:
```
Click "Edit" → Select "frontend"
```

**Build Settings**:
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4.4 Add Environment Variables

Click "Environment Variables"

Add these:

```env
VITE_API_URL
<your-render-backend-url>/api

Example: https://food-waste-backend.onrender.com/api
```

Optional (if using Google OAuth):
```env
VITE_GOOGLE_CLIENT_ID
<your-google-client-id>
```

### 4.5 Deploy!

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Watch the build logs

### 4.6 Get Frontend URL

Once deployed:
1. Click "Visit" or copy the URL
2. Example: `https://food-waste-app-xyz.vercel.app`
3. Save this URL

✅ **Checkpoint**: Frontend is live!

---

## Step 5: Connect Frontend & Backend - 5 minutes

### 5.1 Update Backend CORS

1. Go back to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Find `FRONTEND_URL` variable
5. Click "Edit"
6. Replace with your actual Vercel URL:
   ```
   https://food-waste-app-xyz.vercel.app
   ```
7. Click "Save Changes"
8. Service will auto-redeploy (2-3 minutes)

### 5.2 Wait for Redeploy

Watch the logs until you see:
```
Server running on port 5001
```

✅ **Checkpoint**: Frontend and backend are connected!

---

## Step 6: Test Your Deployment - 5 minutes

### 6.1 Visit Your App

Open your Vercel URL: `https://food-waste-app-xyz.vercel.app`

### 6.2 Test Features

**Test Registration**:
1. Click "Get Started" or "Register"
2. Fill in details
3. Select role (Donor or Volunteer)
4. Click "Register"
5. Should see success message

**Test Login**:
1. Login with your credentials
2. Should redirect to dashboard

**Test Food Posting** (as Donor):
1. Click "Post Food"
2. Fill in details
3. Upload an image
4. Submit
5. Should appear in your posts

**Test Food Claiming** (as Volunteer):
1. Register another account as Volunteer
2. View available food
3. Claim a food item
4. Should get OTP

**Test OTP Verification** (as Donor):
1. Login as donor
2. See claimed food
3. Enter OTP from volunteer
4. Verify delivery

### 6.3 Check Real-time Features

1. Open app in two browser windows
2. Post food in one window
3. Should appear in other window (if volunteer view)

✅ **Checkpoint**: All features working!

---

## 🎉 Deployment Complete!

### Your Live URLs

**Frontend**: `https://your-app.vercel.app`
**Backend**: `https://your-backend.onrender.com/api`
**Database**: Railway (internal)

### What You Have

- ✅ Live application
- ✅ HTTPS enabled
- ✅ Auto-deploy from GitHub
- ✅ Database hosted
- ✅ Free hosting
- ✅ Global CDN (Vercel)

---

## 📊 Important Notes

### Free Tier Limitations

**Render (Backend)**:
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds
- ✅ Good for 100-1000 users
- ✅ 750 hours/month free

**Vercel (Frontend)**:
- ✅ No sleep
- ✅ Global CDN
- ✅ Unlimited bandwidth
- ✅ 100 GB-hours/month

**Railway (Database)**:
- ✅ $5 free credit
- ✅ ~500 hours free
- ⚠️ After credit: $0.01/hour (~$7/month)

### Auto-Deploy Setup

Now when you push to GitHub:
1. Vercel auto-deploys frontend
2. Render auto-deploys backend
3. No manual steps needed!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Wait 2-3 minutes - deployed!
```

---

## 🔧 Post-Deployment Tasks

### 1. Custom Domain (Optional)

**Vercel**:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records
4. Free SSL included

**Render**:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records
4. Free SSL included

### 2. Environment Variables

If you need to update:

**Render**:
1. Dashboard → Environment
2. Edit variables
3. Save (auto-redeploys)

**Vercel**:
1. Project Settings → Environment Variables
2. Edit variables
3. Redeploy (Settings → Deployments → Redeploy)

### 3. View Logs

**Render**:
- Dashboard → Logs tab
- Real-time logs

**Vercel**:
- Project → Deployments → Click deployment → View Function Logs

### 4. Monitor Usage

**Railway**:
- Dashboard → Usage tab
- Monitor credit usage

**Render**:
- Dashboard → Usage
- Monitor hours used

**Vercel**:
- Dashboard → Usage
- Monitor bandwidth

---

## 🐛 Troubleshooting

### Backend Takes Long to Respond

**Cause**: Render free tier sleeps after 15 min
**Solution**: 
- First request takes 30-60s (normal)
- Consider upgrading to paid tier ($7/mo)
- Or use UptimeRobot to ping every 14 min

### CORS Error

**Cause**: Frontend URL not in backend CORS
**Solution**:
1. Check `FRONTEND_URL` in Render
2. Should match your Vercel URL exactly
3. No trailing slash

### Database Connection Failed

**Cause**: Wrong credentials
**Solution**:
1. Go to Railway → MySQL → Variables
2. Copy exact values
3. Update in Render environment
4. Save (will redeploy)

### Images Not Loading

**Cause**: Upload path issue
**Solution**:
- Images stored on Render's filesystem
- Persist across deploys
- If issue persists, check backend logs

### Build Failed

**Cause**: Various
**Solution**:
1. Check build logs in Render/Vercel
2. Common issues:
   - Node version (need 18+)
   - Missing dependencies
   - TypeScript errors
3. Fix locally, push again

---

## 📈 Upgrade Path

### When to Upgrade

Upgrade when you experience:
- Backend sleep causing issues
- Database storage full (1GB)
- Need faster response times
- More than 1000 active users

### Upgrade Options

**Render**:
- Starter: $7/month (no sleep)
- Standard: $25/month (more resources)

**Railway**:
- Pay as you go: ~$7-10/month
- Or switch to PlanetScale (free tier)

**Vercel**:
- Pro: $20/month (team features)
- Usually free tier is enough

---

## 🎯 Next Steps

### Share Your App

1. Share your Vercel URL
2. Get feedback from users
3. Monitor usage and errors

### Monitor Performance

1. Set up error tracking (Sentry)
2. Monitor uptime (UptimeRobot)
3. Check analytics (Vercel Analytics)

### Keep Improving

1. Fix bugs based on feedback
2. Add new features
3. Push to GitHub (auto-deploys!)

---

## 📞 Need Help?

### Common Commands

```bash
# View local logs
npm run dev

# Test production build locally
cd frontend && npm run build && npm run preview
cd backend && npm run build && npm start

# Push updates
git add .
git commit -m "Update"
git push origin main
```

### Useful Links

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Railway Dashboard: https://railway.app/dashboard
- Your Frontend: <your-vercel-url>
- Your Backend: <your-render-url>

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway database created
- [ ] Database credentials saved
- [ ] Render backend deployed
- [ ] Backend environment variables set
- [ ] Backend health check passes
- [ ] Vercel frontend deployed
- [ ] Frontend environment variables set
- [ ] Backend FRONTEND_URL updated
- [ ] Registration works
- [ ] Login works
- [ ] Food posting works
- [ ] Food claiming works
- [ ] OTP verification works
- [ ] Real-time notifications work
- [ ] Images upload correctly

---

## 🎊 Congratulations!

Your Food Waste Reduction App is now LIVE! 🚀

**What you achieved**:
- ✅ Deployed full-stack application
- ✅ Zero cost hosting
- ✅ HTTPS enabled
- ✅ Auto-deploy setup
- ✅ Production-ready

**Share your app and make an impact!** 🌍

---

*Deployment completed: [Date]*
*Frontend URL: [Your Vercel URL]*
*Backend URL: [Your Render URL]*
