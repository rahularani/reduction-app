# RENDER DEPLOYMENT - FINAL FIX

## The Problem

Render is showing:
```
Error: Cannot find module '/opt/render/project/src/backend/dist/server.js'
```

This means the TypeScript is NOT being compiled. The `npm run build` command is not running.

## The Solution

You need to manually set the Build Command in Render Dashboard:

### Step 1: Go to Render Dashboard
- Visit: https://render.com/dashboard
- Click your backend service

### Step 2: Click "Settings" Tab

### Step 3: Update Build Command
- **Find**: "Build Command" field
- **Current value**: `npm install` (WRONG - doesn't compile TypeScript)
- **Change to**: `npm install && npm run build` (CORRECT - compiles TypeScript)

### Step 4: Verify Start Command
- **Find**: "Start Command" field
- **Should be**: `npm start`

### Step 5: Save and Redeploy
- Click "Save"
- Click "Manual Deploy" → "Deploy latest commit"
- Wait 5-10 minutes

## Expected Result

You should see in logs:
```
==> Running build command 'npm install && npm run build'...
> feedforward-backend@1.0.0 build
> tsc
==> Build successful 🎉
==> Running 'npm start'
=== BACKEND SERVER STARTING ===
✅ Server listening on port 10000
```

## Why This Happens

- Render has a monorepo (frontend + backend)
- It needs to know to compile TypeScript BEFORE running the server
- The Build Command must include `npm run build`
- The Start Command runs the compiled server

## Checklist

- [ ] Go to Render Dashboard
- [ ] Click backend service
- [ ] Click Settings
- [ ] Change Build Command to: `npm install && npm run build`
- [ ] Verify Start Command is: `npm start`
- [ ] Click Save
- [ ] Click Manual Deploy
- [ ] Wait for deployment
- [ ] Check logs for "✅ Server listening on port 10000"

**DO THIS NOW!** This is the final fix needed. 🎯
