# Quick Render Deployment Steps - Fix "No Open Ports" Error

## The Problem
Your Render deployment is failing with: "No open ports detected"

## The Solution
You need to set the `PORT` environment variable in Render. Here's exactly what to do:

---

## Step-by-Step Fix

### 1. Go to Render Dashboard
- Visit: https://render.com/dashboard
- Click on your backend service (food-waste-backend)

### 2. Go to Environment Variables
- Click "Environment" tab
- Look for the `PORT` variable

### 3. Add/Update PORT Variable
- If `PORT` doesn't exist, click "Add Environment Variable"
- Set:
  - **Key**: `PORT`
  - **Value**: `10000`
- Click "Save"

### 4. Verify All Required Variables
Make sure you have ALL of these (click "Add Environment Variable" for any missing):

```
PORT = 10000
NODE_ENV = production
DB_DIALECT = postgres
DB_HOST = dpg-d6np1tea2pns73fm8st0-a (your Render PostgreSQL host)
DB_USER = foodwastedb_iyx7_user (your Render PostgreSQL user)
DB_PASSWORD = GiHLia3vp5yMfOFBMuwK8a1ugHg6Ltr3 (your Render PostgreSQL password)
DB_NAME = foodwastedb_iyx7 (your Render PostgreSQL database)
DB_PORT = 5432
JWT_SECRET = any-random-string-here-make-it-long
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
```

### 5. Verify Build Settings
- Click "Settings" tab
- Check these are correct:
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
  - **Root Directory**: `backend`

### 6. Redeploy
- Click "Manual Deploy" → "Deploy latest commit"
- Wait 5-10 minutes

### 7. Check Logs
- Click "Logs" tab
- Look for: `Server listening on port 10000`
- If you see this, it's working!

### 8. Test
- Copy your service URL (e.g., `https://food-waste-backend.onrender.com`)
- Visit: `https://food-waste-backend.onrender.com/api/health`
- Should see: `{"status":"ok","message":"Server is running"}`

---

## If Still Not Working

1. **Check the detailed troubleshooting guide**: `RENDER_DEPLOYMENT_TROUBLESHOOTING.md`
2. **Delete and recreate the service** (if nothing else works)
3. **Verify database is running** on Render PostgreSQL

---

## Key Points

✅ **PORT must be set** - Render doesn't set it automatically
✅ **Must use `npm run build`** - To compile TypeScript
✅ **Root directory must be `backend`** - Not the root folder
✅ **Server binds to `0.0.0.0`** - Not localhost
✅ **Server starts immediately** - Doesn't wait for database

---

## Success Indicators

- ✅ Service shows "Live" (green) in Render Dashboard
- ✅ Logs show: `Server listening on port 10000`
- ✅ Health endpoint returns: `{"status":"ok","message":"Server is running"}`
- ✅ No "No open ports detected" error

---

**That's it! Your backend should now deploy successfully on Render.**

Once working, update your frontend with the backend URL and deploy to Vercel.
