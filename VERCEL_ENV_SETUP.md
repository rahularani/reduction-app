# Vercel Environment Variables Setup

## The Problem

The frontend is calling `/auth/register` instead of `/api/auth/register` because the `VITE_API_URL` environment variable is not set in Vercel.

## The Solution

You need to set environment variables in Vercel Dashboard:

### Step 1: Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click your frontend project

### Step 2: Go to Settings
- Click "Settings" tab
- Click "Environment Variables" in the left sidebar

### Step 3: Add Environment Variables

Add these variables:

| Key | Value |
|-----|-------|
| VITE_API_URL | https://food-waste-backend-vid3.onrender.com/api |
| VITE_GOOGLE_CLIENT_ID | 650046308336-l9soafee3e38kn6udel9kaoe04rulgjl.apps.googleusercontent.com |

### Step 4: Redeploy
- Go back to "Deployments" tab
- Click "Redeploy" on the latest deployment
- Wait 2-3 minutes

## Expected Result

After redeployment, the frontend should:
- ✅ Call `/api/auth/register` (not `/auth/register`)
- ✅ Connect to backend successfully
- ✅ Allow user registration
- ✅ Allow user login

## Why This Matters

- `.env` files are NOT deployed to Vercel
- Environment variables must be set in Vercel Dashboard
- Vite reads environment variables at build time
- The build must be redone after setting variables

## Checklist

- [ ] Go to Vercel Dashboard
- [ ] Click your frontend project
- [ ] Click Settings
- [ ] Click Environment Variables
- [ ] Add VITE_API_URL
- [ ] Add VITE_GOOGLE_CLIENT_ID
- [ ] Go to Deployments
- [ ] Click Redeploy
- [ ] Wait 2-3 minutes
- [ ] Test registration

**DO THIS NOW!** This is the final fix needed. 🎯
