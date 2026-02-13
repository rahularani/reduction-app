# Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Preparation
- [x] Database config supports both MySQL (dev) and PostgreSQL (prod)
- [x] CORS configuration includes production URL
- [x] Production scripts added to package.json
- [x] Netlify configuration created (netlify.toml)
- [x] Render configuration created (render.yaml)
- [x] PostgreSQL driver installed (pg, pg-hstore)
- [x] .gitignore properly configured

### Environment Variables Ready
- [ ] GOOGLE_CLIENT_ID (from Google Console)
- [ ] GOOGLE_CLIENT_SECRET (from Google Console)
- [ ] JWT_SECRET (generate a strong secret)
- [ ] FRONTEND_URL (will get from Netlify)
- [ ] DATABASE_URL (will get from Render)

### Accounts Created
- [ ] GitHub account (code repository)
- [ ] Netlify account (frontend hosting)
- [ ] Render account (backend + database)
- [ ] Cloudinary account (optional - for images)

## 🚀 Deployment Steps

### Step 1: Push to GitHub ✅
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy Backend to Render (15 minutes)

#### 2.1 Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render to access your repository

#### 2.2 Create PostgreSQL Database
- [ ] Click "New +" → "PostgreSQL"
- [ ] Name: `food-waste-db`
- [ ] Database: `food_waste_app`
- [ ] User: `food_waste_user`
- [ ] Region: Choose closest to you
- [ ] Plan: Free
- [ ] Click "Create Database"
- [ ] Wait for database to be ready (2-3 minutes)
- [ ] Copy "Internal Database URL" (starts with postgres://)

#### 2.3 Deploy Backend Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Name: `food-waste-backend`
- [ ] Root Directory: `backend` (or leave blank if using root render.yaml)
- [ ] Environment: Node
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Plan: Free
- [ ] Click "Advanced" to add environment variables

#### 2.4 Add Environment Variables to Render
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste-internal-database-url-from-step-2.2>
JWT_SECRET=<generate-a-strong-random-string>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONTEND_URL=<will-add-after-netlify-deployment>
```

**Generate JWT_SECRET:**
```bash
# Run this in terminal to generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Check logs for any errors
- [ ] Copy your backend URL: `https://food-waste-backend.onrender.com`
- [ ] Test health endpoint: `https://food-waste-backend.onrender.com/api/health`

### Step 3: Deploy Frontend to Netlify (10 minutes)

#### 3.1 Create Netlify Account
- [ ] Go to https://netlify.com
- [ ] Sign up with GitHub
- [ ] Authorize Netlify

#### 3.2 Deploy Site
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Choose GitHub
- [ ] Select your repository
- [ ] Configure build settings:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- [ ] Click "Show advanced" to add environment variables

#### 3.3 Add Environment Variables to Netlify
```env
VITE_API_URL=<your-render-backend-url>/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

Example:
```env
VITE_API_URL=https://food-waste-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
```

- [ ] Click "Deploy site"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Copy your Netlify URL: `https://your-app-name.netlify.app`

#### 3.4 Update Site Name (Optional)
- [ ] Go to Site settings → General → Site details
- [ ] Click "Change site name"
- [ ] Choose a memorable name: `food-waste-reduction`
- [ ] Your new URL: `https://food-waste-reduction.netlify.app`

### Step 4: Update Backend with Frontend URL

#### 4.1 Add Frontend URL to Render
- [ ] Go back to Render dashboard
- [ ] Select your backend service
- [ ] Go to Environment
- [ ] Update `FRONTEND_URL` variable:
```env
FRONTEND_URL=https://your-app-name.netlify.app
```
- [ ] Save changes
- [ ] Wait for automatic redeploy (2-3 minutes)

### Step 5: Update Google OAuth Configuration

#### 5.1 Add Production URLs to Google Console
- [ ] Go to https://console.cloud.google.com
- [ ] Select your project
- [ ] Go to "APIs & Services" → "Credentials"
- [ ] Click on your OAuth 2.0 Client ID
- [ ] Add to "Authorized JavaScript origins":
  - `https://your-app-name.netlify.app`
- [ ] Add to "Authorized redirect URIs":
  - `https://your-app-name.netlify.app`
- [ ] Click "Save"

### Step 6: Final Testing (15 minutes)

#### 6.1 Test Basic Functionality
- [ ] Visit your Netlify URL
- [ ] Check if welcome page loads
- [ ] Click "Get Started" → Should go to login page
- [ ] Check browser console for errors

#### 6.2 Test Registration
- [ ] Click "Register here"
- [ ] Fill in the form
- [ ] Select role (Donor/Volunteer)
- [ ] Submit
- [ ] Should redirect to login page
- [ ] Check for success message

#### 6.3 Test Login
- [ ] Enter credentials from registration
- [ ] Click "Sign In"
- [ ] Should redirect to appropriate dashboard
- [ ] Check if user info displays correctly

#### 6.4 Test Google OAuth
- [ ] Go back to login page
- [ ] Click "Sign in with Google"
- [ ] Select Google account
- [ ] Grant permissions
- [ ] Should redirect to dashboard
- [ ] Check if user info is correct

#### 6.5 Test Donor Features (if logged in as donor)
- [ ] Click "Post Surplus Food"
- [ ] Fill in all fields
- [ ] Upload an image
- [ ] Get current location
- [ ] Submit
- [ ] Check if post appears in dashboard
- [ ] Verify image loads correctly

#### 6.6 Test Volunteer Features (if logged in as volunteer)
- [ ] Check "Available Food" tab
- [ ] Should see posts from donors
- [ ] Click "Claim" on a post
- [ ] Confirm claim
- [ ] Check "My Claims" tab
- [ ] Verify OTP is displayed
- [ ] Copy OTP

#### 6.7 Test Notifications
- [ ] Create a new post as donor
- [ ] Check if volunteer receives notification
- [ ] Claim a post as volunteer
- [ ] Check if donor receives notification

#### 6.8 Test OTP Verification
- [ ] As donor, click "Complete Delivery"
- [ ] Enter OTP from volunteer
- [ ] Submit
- [ ] Check if status changes to "Completed"
- [ ] Verify location is hidden

#### 6.9 Test Admin Dashboard (if you have admin account)
- [ ] Login as admin
- [ ] Check Overview tab (statistics)
- [ ] Check Users tab (list of users)
- [ ] Check Food Posts tab (all posts)
- [ ] Test delete functionality

## 🐛 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- [ ] Check Render logs for errors
- [ ] Verify DATABASE_URL is correct (use Internal URL)
- [ ] Check all environment variables are set
- [ ] Verify build completed successfully

**"Database connection failed"**
- [ ] Use Internal Database URL (not External)
- [ ] Check database is running in Render
- [ ] Verify SSL settings in database config
- [ ] Check database credentials

**"CORS error"**
- [ ] Verify FRONTEND_URL in Render matches Netlify URL
- [ ] Check CORS configuration in server.ts
- [ ] Redeploy backend after updating FRONTEND_URL
- [ ] Clear browser cache

### Frontend Issues

**"Failed to fetch" or "Network error"**
- [ ] Check VITE_API_URL in Netlify
- [ ] Verify backend is running (visit /api/health)
- [ ] Check browser console for exact error
- [ ] Verify backend URL is correct (with /api)

**"Google OAuth not working"**
- [ ] Add Netlify URL to Google Console
- [ ] Check VITE_GOOGLE_CLIENT_ID in Netlify
- [ ] Verify Google Console configuration
- [ ] Clear browser cache and try again

**"Images not loading"**
- [ ] Check if images uploaded successfully
- [ ] Verify image URLs in database
- [ ] Check CORS headers for images
- [ ] Consider using Cloudinary for production

**"Page not found" on refresh**
- [ ] Verify netlify.toml has redirects configured
- [ ] Check if file is in repository
- [ ] Redeploy if needed

## 📊 Performance Checks

### Backend Performance
- [ ] Check response times in Render logs
- [ ] Monitor database query performance
- [ ] Check memory usage
- [ ] Verify no memory leaks

### Frontend Performance
- [ ] Run Lighthouse audit
- [ ] Check bundle size
- [ ] Verify images are optimized
- [ ] Test on mobile devices

### Database Performance
- [ ] Check connection pool usage
- [ ] Monitor query execution times
- [ ] Verify indexes are created
- [ ] Check for slow queries

## 🔐 Security Checks

- [ ] HTTPS enabled (automatic on Netlify/Render)
- [ ] Environment variables secured
- [ ] No secrets in code
- [ ] CORS properly configured
- [ ] JWT secret is strong
- [ ] Google OAuth configured correctly
- [ ] Database SSL enabled
- [ ] Input validation working
- [ ] SQL injection prevention active
- [ ] XSS protection enabled

## 📈 Post-Deployment

### Monitoring Setup
- [ ] Set up Render alerts
- [ ] Monitor Netlify analytics
- [ ] Check error logs regularly
- [ ] Set up uptime monitoring (optional)

### Documentation
- [ ] Update README with production URLs
- [ ] Document any deployment issues
- [ ] Create user guide (optional)
- [ ] Document API endpoints (optional)

### Backup Strategy
- [ ] Enable Render database backups
- [ ] Document backup restoration process
- [ ] Test backup restoration (optional)

### Future Improvements
- [ ] Set up CI/CD pipeline
- [ ] Add automated testing
- [ ] Implement caching
- [ ] Add rate limiting
- [ ] Set up monitoring dashboard
- [ ] Implement analytics

## 🎉 Deployment Complete!

Once all items are checked:

**Your app is live at:**
- Frontend: `https://your-app-name.netlify.app`
- Backend: `https://food-waste-backend.onrender.com`
- Database: Render PostgreSQL

**Share your app:**
- [ ] Share URL with team
- [ ] Post on social media
- [ ] Add to portfolio
- [ ] Submit to hackathon (if applicable)

## 📞 Support Resources

- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Google OAuth Docs: https://developers.google.com/identity

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Status:** ⬜ In Progress | ⬜ Complete | ⬜ Issues

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
