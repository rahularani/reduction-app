# Render Deployment Troubleshooting - "No Open Ports Detected" Error

## Problem
When deploying to Render, you see:
```
==> No open ports detected, continuing to scan...
==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
==> Exited with status 2
```

## Root Causes

1. **PORT environment variable not set** - Render doesn't automatically set PORT
2. **Server not binding to correct host** - Must bind to `0.0.0.0`
3. **Build command not compiling TypeScript** - Must run `npm run build`
4. **Database connection blocking startup** - Server must start even if DB fails

## Solution Checklist

### ✅ Step 1: Verify Environment Variables in Render

1. Go to Render Dashboard
2. Click your backend service
3. Go to "Environment" tab
4. **MUST HAVE**:
   - `PORT=10000` (or any port number)
   - `NODE_ENV=production`
   - `DB_DIALECT=postgres`
   - `DB_HOST=` (your Render PostgreSQL host)
   - `DB_USER=` (your Render PostgreSQL user)
   - `DB_PASSWORD=` (your Render PostgreSQL password)
   - `DB_NAME=` (your Render PostgreSQL database)
   - `DB_PORT=5432`
   - `JWT_SECRET=` (any random string)

### ✅ Step 2: Verify Build Command

1. Go to Render Dashboard
2. Click your backend service
3. Go to "Settings" tab
4. Check "Build Command":
   ```
   npm install && npm run build
   ```
   - Must include `npm run build` to compile TypeScript
   - Must include `npm install` to install dependencies

### ✅ Step 3: Verify Start Command

1. In same "Settings" tab
2. Check "Start Command":
   ```
   npm start
   ```
   - This runs `node dist/server.js`
   - Must be exactly `npm start`

### ✅ Step 4: Verify Root Directory

1. In same "Settings" tab
2. Check "Root Directory":
   ```
   backend
   ```
   - Must be set to `backend` (not root)

### ✅ Step 5: Check Server Code

The server must:
1. Bind to `0.0.0.0` (not just localhost)
2. Start immediately without waiting for database
3. Handle errors gracefully

Your `backend/src/server.ts` should have:
```typescript
const PORT = parseInt(process.env.PORT || '5000')

httpServer.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server listening on port ${PORT}`)
})

// Database connects in background
connectDB().catch((error) => {
  logger.error('Database connection failed:', error)
  logger.warn('Server running without database')
})
```

### ✅ Step 6: Rebuild and Redeploy

1. Make sure all changes are committed:
   ```bash
   git add -A
   git commit -m "Fix Render deployment"
   git push origin main
   ```

2. In Render Dashboard:
   - Click your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait 5-10 minutes

3. Check logs:
   - Click "Logs" tab
   - Look for: `Server listening on port 10000`
   - If you see this, deployment is successful!

## Verification Steps

### ✅ Check if Server is Running

1. Go to Render Dashboard
2. Click your backend service
3. Look at the top - should show "Live" (green)
4. Copy the service URL (e.g., `https://food-waste-backend.onrender.com`)
5. Visit: `https://food-waste-backend.onrender.com/api/health`
6. Should see: `{"status":"ok","message":"Server is running"}`

### ✅ Check Logs for Errors

1. Go to Render Dashboard
2. Click your backend service
3. Click "Logs" tab
4. Look for any error messages
5. Common errors:
   - `Cannot find module` - Build didn't run
   - `EADDRINUSE` - Port already in use
   - `Database connection failed` - DB credentials wrong (but server should still start)

### ✅ Test API Endpoint

1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"ok","message":"Server is running"}`
3. If you get 404 or connection error, server isn't running

## Common Mistakes

❌ **Mistake 1**: Not setting PORT environment variable
- ✅ **Fix**: Add `PORT=10000` to environment variables

❌ **Mistake 2**: Build command doesn't include `npm run build`
- ✅ **Fix**: Change to `npm install && npm run build`

❌ **Mistake 3**: Root directory is `/` instead of `backend`
- ✅ **Fix**: Set root directory to `backend`

❌ **Mistake 4**: Server binds to `localhost` instead of `0.0.0.0`
- ✅ **Fix**: Use `httpServer.listen(PORT, '0.0.0.0', ...)`

❌ **Mistake 5**: Database connection blocks server startup
- ✅ **Fix**: Connect to database in background, start server immediately

## If Still Not Working

1. **Delete and recreate the service**:
   - Go to Render Dashboard
   - Click your service
   - Go to "Settings" → "Delete Service"
   - Create a new web service from scratch
   - Follow all steps above carefully

2. **Check GitHub integration**:
   - Make sure Render has access to your GitHub repo
   - Make sure the `backend` folder exists in your repo
   - Make sure `backend/package.json` exists

3. **Verify TypeScript compilation**:
   - Run locally: `cd backend && npm run build`
   - Check that `backend/dist/server.js` is created
   - If not, fix TypeScript errors first

4. **Check database connection**:
   - Verify Render PostgreSQL is running
   - Verify credentials are correct
   - Try connecting with a database client

## Success Indicators

✅ You'll see in Render logs:
```
[INFO] Serving uploads from: /opt/render/project/src/backend/uploads
[INFO] Server listening on port 10000
[INFO] Socket.IO initialized
[INFO] PostgreSQL Database connected successfully
[INFO] Database synchronized
```

✅ Service status shows "Live" (green)

✅ Health check returns: `{"status":"ok","message":"Server is running"}`

✅ Frontend can connect and make API calls

## Next Steps

Once backend is deployed successfully:

1. Update frontend environment variables with backend URL
2. Deploy frontend to Vercel
3. Test the complete application
4. Create admin user in production database

---

**Need more help?**
- Check Render docs: https://render.com/docs/web-services#port-binding
- Check your service logs in Render Dashboard
- Verify all environment variables are set correctly
