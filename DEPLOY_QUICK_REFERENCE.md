# Quick Deployment Reference

## 🚀 30-Minute Deployment Guide

### Prerequisites (5 min)
```bash
# 1. Commit and push your code
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Have these ready:
# - GitHub account
# - Google OAuth credentials
# - 30 minutes of time
```

### Step 1: Render Backend (15 min)

**A. Create Database**
1. Go to https://render.com → Sign up with GitHub
2. New + → PostgreSQL
3. Name: `food-waste-db`, Plan: Free
4. Create → Copy "Internal Database URL"

**B. Deploy Backend**
1. New + → Web Service
2. Connect GitHub repo
3. Settings:
   - Name: `food-waste-backend`
   - Root: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Plan: Free

**C. Environment Variables**
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste-internal-db-url>
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONTEND_URL=<will-add-later>
```

4. Create Web Service → Wait 5-10 min
5. Copy URL: `https://food-waste-backend.onrender.com`

### Step 2: Netlify Frontend (10 min)

**A. Deploy Site**
1. Go to https://netlify.com → Sign up with GitHub
2. Add new site → Import from GitHub
3. Select your repo
4. Settings:
   - Base: `frontend`
   - Build: `npm run build`
   - Publish: `frontend/dist`

**B. Environment Variables**
```env
VITE_API_URL=https://food-waste-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

5. Deploy → Wait 3-5 min
6. Copy URL: `https://your-app.netlify.app`

### Step 3: Connect Everything (5 min)

**A. Update Render**
1. Go to Render → Your backend service
2. Environment → Add:
```env
FRONTEND_URL=https://your-app.netlify.app
```
3. Save → Auto redeploys

**B. Update Google Console**
1. Go to https://console.cloud.google.com
2. Credentials → Your OAuth Client
3. Add to Authorized origins:
   - `https://your-app.netlify.app`
4. Add to Redirect URIs:
   - `https://your-app.netlify.app`
5. Save

### Step 4: Test (5 min)

Visit: `https://your-app.netlify.app`

✅ Welcome page loads
✅ Can register
✅ Can login
✅ Google OAuth works
✅ Can post food
✅ Can claim food
✅ Notifications work

## 🎯 URLs You'll Need

| Service | URL | Purpose |
|---------|-----|---------|
| Render | https://render.com | Backend hosting |
| Netlify | https://netlify.com | Frontend hosting |
| Google Console | https://console.cloud.google.com | OAuth setup |
| Your Backend | https://food-waste-backend.onrender.com | API |
| Your Frontend | https://your-app.netlify.app | Website |

## 🔑 Environment Variables Cheat Sheet

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgres://user:pass@host/db
JWT_SECRET=<64-char-random-string>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
FRONTEND_URL=https://your-app.netlify.app
```

### Frontend (Netlify)
```env
VITE_API_URL=https://food-waste-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=<from-google-console>
```

## 🐛 Quick Fixes

**Backend not responding?**
```bash
# Check Render logs
# Verify DATABASE_URL is Internal URL
# Check all env vars are set
```

**CORS error?**
```bash
# Update FRONTEND_URL in Render
# Redeploy backend
# Clear browser cache
```

**Google OAuth not working?**
```bash
# Add Netlify URL to Google Console
# Check VITE_GOOGLE_CLIENT_ID
# Clear browser cache
```

**Images not loading?**
```bash
# Check image URLs in database
# Verify CORS headers
# Consider using Cloudinary
```

## 💰 Cost

**Total: $0/month**

- Netlify: Free (100GB bandwidth)
- Render: Free (750 hours)
- PostgreSQL: Free (1GB storage)

**Note:** Render free tier sleeps after 15 min inactivity. First request after sleep takes ~30 seconds.

## 📊 What's Deployed

```
┌─────────────────────────────────┐
│  Netlify (Frontend)             │
│  - React + TypeScript           │
│  - TailwindCSS                  │
│  - Google OAuth                 │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Render (Backend)               │
│  - Express.js API               │
│  - Socket.IO                    │
│  - JWT Auth                     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Render PostgreSQL              │
│  - Users                        │
│  - Food Posts                   │
│  - Notifications                │
└─────────────────────────────────┘
```

## 🎉 Success Checklist

- [ ] Backend deployed and responding
- [ ] Frontend deployed and loading
- [ ] Database connected
- [ ] Can register new user
- [ ] Can login
- [ ] Google OAuth works
- [ ] Can post food
- [ ] Can claim food
- [ ] Notifications work
- [ ] OTP verification works
- [ ] Images upload (if using Cloudinary)

## 📞 Need Help?

1. Check `DEPLOYMENT_CHECKLIST.md` for detailed steps
2. Check `DEPLOYMENT_GUIDE.md` for full guide
3. Check Render logs for backend errors
4. Check Netlify deploy logs for frontend errors
5. Check browser console for client errors

---

**Time to Deploy:** ~30 minutes
**Difficulty:** Easy
**Cost:** Free
**Status:** Production Ready ✅
