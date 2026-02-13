# Complete Setup Instructions

## Google OAuth Authentication - Ready to Use!

Your Food Waste Reduction App now has Google OAuth authentication integrated! Here's how to set it up and use it.

## 🎯 What You Get

Users can now:
- ✅ Sign in with their Google account
- ✅ Register with their Google account
- ✅ One-click authentication
- ✅ No password needed for Google users
- ✅ Automatic account creation

## 📋 Setup Steps

### Step 1: Get Google OAuth Credentials (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "OAuth consent screen" and configure:
   - App name: Food Waste Reduction App
   - User support email: Your email
   - Developer contact: Your email
5. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
6. Select "Web application"
7. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:5174`
8. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:5174`
9. Click "Create" and copy:
   - Client ID
   - Client Secret

### Step 2: Update Environment Variables

**Backend (.env)**
```env
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

**Frontend (.env)**
```env
VITE_GOOGLE_CLIENT_ID=paste-your-client-id-here
```

**Important:** Use the SAME Client ID in both files!

### Step 3: Restart Your Servers

```bash
# Stop both servers (Ctrl+C in each terminal)

# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Step 4: Test It!

1. Open http://localhost:5173/login
2. You'll see the "Sign in with Google" button
3. Click it and select your Google account
4. You're logged in! 🎉

## 🎨 What Users See

### Login Page
```
┌──────────────────────────────┐
│   Email: [____________]      │
│   Password: [________]       │
│   [Sign In Button]           │
│                              │
│   ─── Or continue with ───   │
│                              │
│   [🔵 Sign in with Google]   │
│                              │
│   Don't have an account?     │
│   Register here              │
└──────────────────────────────┘
```

### Register Page
```
┌──────────────────────────────┐
│   Name: [____________]       │
│   Email: [____________]      │
│   Password: [________]       │
│   Confirm: [________]        │
│   Role: [Donor] [Volunteer]  │
│   [Create Account]           │
│                              │
│   ─── Or continue with ───   │
│                              │
│   [🔵 Sign up with Google]   │
│                              │
│   Already have an account?   │
│   Sign in                    │
└──────────────────────────────┘
```

## 🔄 How It Works

### For New Users
1. Click "Sign up with Google" on register page
2. Select role (Donor/Volunteer)
3. Click Google button
4. Select Google account
5. Account created automatically
6. Redirected to dashboard

### For Existing Users
1. Click "Sign in with Google" on login page
2. Select Google account
3. Logged in automatically
4. Redirected to dashboard

### For Users with Same Email
- If you registered with email/password
- You can also sign in with Google (same email)
- It's the same account!

## 📦 What Was Installed

### Backend Packages
```json
{
  "google-auth-library": "^9.x.x",
  "passport": "^0.7.x",
  "passport-google-oauth20": "^2.x.x"
}
```

### Frontend Packages
```json
{
  "@react-oauth/google": "^0.12.x"
}
```

## 🔐 Security Features

- ✅ Google handles authentication
- ✅ Secure token verification
- ✅ JWT tokens for sessions
- ✅ No password storage for OAuth users
- ✅ Industry-standard implementation

## 🐛 Troubleshooting

### Google button not showing?
**Solution:**
1. Check `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`
2. Restart frontend server
3. Clear browser cache

### "Invalid client" error?
**Solution:**
1. Check `GOOGLE_CLIENT_ID` in `backend/.env`
2. Verify credentials are correct
3. Restart backend server

### "Redirect URI mismatch" error?
**Solution:**
1. Go to Google Cloud Console
2. Add `http://localhost:5173` to authorized origins
3. Add `http://localhost:5173` to redirect URIs
4. Save and try again

### "Error 400: redirect_uri_mismatch"?
**Solution:**
- Make sure authorized origins match exactly
- No trailing slashes
- Use http (not https) for localhost
- Include port number

## 📚 Documentation Files

- `GOOGLE_OAUTH_SETUP.md` - Detailed setup guide
- `GOOGLE_OAUTH_QUICK_START.md` - Quick reference
- `GOOGLE_AUTH_IMPLEMENTATION.md` - Technical details

## ✅ Testing Checklist

Before going live, test:
- [ ] Google Sign-In on login page
- [ ] Google Sign-Up on register page
- [ ] New user account creation
- [ ] Existing user login
- [ ] Role selection for new users
- [ ] Redirect to correct dashboard
- [ ] Error handling
- [ ] Email/password auth still works

## 🚀 Production Deployment

When deploying to production:

1. **Update Google Console:**
   - Add production domain to authorized origins
   - Add production domain to redirect URIs
   - Set OAuth consent to "Production"

2. **Update Environment Variables:**
   - Set production URLs
   - Use HTTPS (required by Google)
   - Keep credentials secure

3. **Test on Production:**
   - Test Google sign-in
   - Test Google sign-up
   - Verify redirects work

## 💡 Tips

- Keep your Client Secret confidential
- Never commit .env files
- Use different credentials for dev/prod
- Monitor usage in Google Cloud Console
- Set up billing alerts

## 🎉 You're All Set!

Your app now has professional Google OAuth authentication! Users can sign in with one click, and you have a secure, industry-standard authentication system.

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the detailed setup guide
3. Check browser console for errors
4. Check backend terminal for logs
5. Verify all environment variables

---

**Last Updated:** February 14, 2026
**Status:** ✅ Ready to Use
