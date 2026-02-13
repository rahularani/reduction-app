# Deployment Guide - Food Waste Reduction App

## 🎯 Recommended Deployment Architecture

```
┌─────────────────────────────────────────────┐
│  Users                                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Netlify (Frontend)                         │
│  - React App                                │
│  - Static Files                             │
│  - CDN Distribution                         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Render (Backend)                           │
│  - Express.js API                           │
│  - Socket.IO                                │
│  - Authentication                           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Render PostgreSQL (Database)               │
│  - User data                                │
│  - Food posts                               │
│  - Notifications                            │
└─────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Cloudinary (Image Storage)                 │
│  - Food images                              │
│  - CDN delivery                             │
└─────────────────────────────────────────────┘
```

## 📋 Prerequisites

- [x] GitHub account
- [x] Netlify account (free)
- [x] Render account (free)
- [x] Cloudinary account (free)
- [x] Google OAuth credentials
- [x] Code pushed to GitHub

## 🚀 Step-by-Step Deployment

### Part 1: Prepare Your Code

#### 1.1 Update Backend for Production

Create `backend/src/config/database.production.ts`:
```typescript
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
})

export default sequelize
```

#### 1.2 Update CORS Configuration

In `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL || '',
    'https://your-app.netlify.app' // Add your Netlify URL
  ],
  credentials: true
}))
```

#### 1.3 Add Production Scripts

Update `backend/package.json`:
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

#### 1.4 Create Netlify Configuration

Create `frontend/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 1.5 Create Render Configuration

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: food-waste-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
```

### Part 2: Deploy Backend to Render

#### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render

#### 2.2 Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `food-waste-db`
3. Database: `food_waste_app`
4. User: `food_waste_user`
5. Region: Choose closest to you
6. Plan: Free
7. Click "Create Database"
8. Copy the "Internal Database URL"

#### 2.3 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `backend` folder (or root if monorepo)
4. Name: `food-waste-backend`
5. Environment: Node
6. Build Command: `npm install && npm run build`
7. Start Command: `npm start`
8. Plan: Free

#### 2.4 Add Environment Variables
In Render dashboard, add:
```env
NODE_ENV=production
PORT=5001
DATABASE_URL=<paste-internal-database-url>
JWT_SECRET=your-super-secret-jwt-key-change-this
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-app.netlify.app
```

#### 2.5 Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Copy your backend URL: `https://food-waste-backend.onrender.com`

### Part 3: Setup Cloudinary for Images

#### 3.1 Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up (free tier: 25GB)
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret

#### 3.2 Install Cloudinary in Backend
```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

#### 3.3 Update Upload Middleware

Create `backend/src/middleware/cloudinary.middleware.ts`:
```typescript
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'food-waste-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  } as any
})

export const upload = multer({ storage })
```

#### 3.4 Add Cloudinary Env Vars to Render
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Part 4: Deploy Frontend to Netlify

#### 4.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub
3. Authorize Netlify

#### 4.2 Deploy via GitHub
1. Click "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select your repository
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Click "Deploy site"

#### 4.3 Add Environment Variables
In Netlify dashboard → Site settings → Environment variables:
```env
VITE_API_URL=https://food-waste-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

#### 4.4 Update Site Name
1. Go to Site settings → General
2. Change site name to something memorable
3. Your URL: `https://your-app-name.netlify.app`

#### 4.5 Redeploy
- Go to Deploys tab
- Click "Trigger deploy" → "Clear cache and deploy site"

### Part 5: Update Google OAuth

#### 5.1 Add Production URLs to Google Console
1. Go to https://console.cloud.google.com
2. Select your project
3. Go to Credentials → OAuth 2.0 Client IDs
4. Add authorized JavaScript origins:
   - `https://your-app-name.netlify.app`
5. Add authorized redirect URIs:
   - `https://your-app-name.netlify.app`
6. Save

### Part 6: Final Configuration

#### 6.1 Update Backend CORS
In Render dashboard, update `FRONTEND_URL`:
```env
FRONTEND_URL=https://your-app-name.netlify.app
```

#### 6.2 Test Everything
1. Visit your Netlify URL
2. Test registration
3. Test login
4. Test Google OAuth
5. Test food posting
6. Test claiming
7. Test notifications
8. Test image upload

## 🔧 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs
- Verify DATABASE_URL is correct
- Check all env vars are set

**"Database connection failed"**
- Use Internal Database URL (not External)
- Check SSL settings
- Verify database is running

**"CORS error"**
- Add Netlify URL to CORS origins
- Check FRONTEND_URL env var
- Redeploy backend

### Frontend Issues

**"Failed to fetch"**
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console

**"Google OAuth not working"**
- Add production URL to Google Console
- Check VITE_GOOGLE_CLIENT_ID
- Clear cache and redeploy

**"Images not loading"**
- Check Cloudinary configuration
- Verify API keys
- Check image URLs in database

## 💰 Cost Breakdown

### Free Tier Limits

**Netlify (Frontend)**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Free SSL
- **Cost: $0/month**

**Render (Backend + Database)**
- ✅ 750 hours/month (enough for 1 service)
- ✅ 1GB RAM
- ✅ PostgreSQL 1GB storage
- ⚠️ Sleeps after 15 min inactivity
- **Cost: $0/month**

**Cloudinary (Images)**
- ✅ 25GB storage
- ✅ 25GB bandwidth/month
- ✅ 25,000 transformations/month
- **Cost: $0/month**

**Total: $0/month** 🎉

### Paid Upgrades (Optional)

**Render Pro ($7/month)**
- No sleep
- Faster performance
- More resources

**Netlify Pro ($19/month)**
- More bandwidth
- More build minutes
- Analytics

**Cloudinary Plus ($89/month)**
- More storage
- More bandwidth
- Advanced features

## 🚀 Alternative: Railway (All-in-One)

If you prefer everything in one place:

### Railway Deployment

1. **Sign up:** https://railway.app
2. **New Project:** Click "New Project"
3. **Deploy from GitHub:** Select your repo
4. **Add Services:**
   - Frontend (React)
   - Backend (Node.js)
   - MySQL Database
5. **Configure:**
   - Set environment variables
   - Connect services
6. **Deploy:** Automatic!

**Cost:** $5 free credit/month (then $5-20/month)

## 📊 Performance Optimization

### Frontend (Netlify)
- ✅ Automatic CDN
- ✅ Gzip compression
- ✅ HTTP/2
- ✅ Asset optimization

### Backend (Render)
- Add Redis for caching
- Enable connection pooling
- Optimize database queries
- Use compression middleware

### Database
- Add indexes on frequently queried fields
- Use connection pooling
- Regular backups
- Monitor performance

## 🔐 Security Checklist

- [ ] HTTPS enabled (automatic)
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] JWT secret is strong
- [ ] Google OAuth configured
- [ ] Database SSL enabled
- [ ] API rate limiting (optional)
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection

## 📈 Monitoring

### Render
- Check logs regularly
- Monitor uptime
- Set up alerts
- Track errors

### Netlify
- Check deploy logs
- Monitor bandwidth
- Track build times
- Review analytics

### Database
- Monitor connections
- Check query performance
- Regular backups
- Storage usage

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Frontend:** https://your-app-name.netlify.app
**Backend:** https://food-waste-backend.onrender.com
**Database:** Render PostgreSQL
**Images:** Cloudinary CDN

## 📞 Support

If you need help:
1. Check Render logs
2. Check Netlify deploy logs
3. Check browser console
4. Review this guide
5. Check service status pages

---

**Last Updated:** February 14, 2026
**Status:** ✅ Production Ready
