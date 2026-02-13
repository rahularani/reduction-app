# Google OAuth - Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Get Google Credentials
Visit: https://console.cloud.google.com/

1. Create new project
2. Enable Google+ API
3. Create OAuth 2.0 Client ID
4. Add authorized origins: `http://localhost:5173`
5. Copy Client ID and Client Secret

### 2. Update Environment Files

**backend/.env**
```env
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

**frontend/.env**
```env
VITE_GOOGLE_CLIENT_ID=paste-your-client-id-here
```

### 3. Restart Servers
```bash
# Stop both servers (Ctrl+C)
# Then restart them
```

### 4. Test It!
- Go to http://localhost:5173/login
- Click "Sign in with Google"
- Done! ✅

## 📱 What Users See

### Login Page
- Email/Password fields (existing)
- **NEW:** "Or continue with" divider
- **NEW:** Google Sign-In button

### Register Page
- All registration fields (existing)
- Role selection (Donor/Volunteer)
- **NEW:** "Or continue with" divider
- **NEW:** Google Sign-Up button

## 🔐 How It Works

1. User clicks "Sign in with Google"
2. Google popup opens
3. User selects their Google account
4. App receives user info (name, email)
5. Backend creates/finds user account
6. User is logged in automatically
7. Redirected to appropriate dashboard

## ✨ Benefits

- **Faster sign-up**: No password to remember
- **More secure**: Google handles authentication
- **Better UX**: One-click login
- **Trusted**: Users trust Google sign-in
- **Auto-fill**: Name and email from Google

## 🎯 User Flow

### New User with Google
1. Click "Sign in with Google" on Register page
2. Select role (Donor/Volunteer)
3. Click Google button
4. Account created automatically
5. Redirected to dashboard

### Existing User with Google
1. Click "Sign in with Google" on Login page
2. Select Google account
3. Logged in automatically
4. Redirected to dashboard

## 🔧 Troubleshooting

**Button not showing?**
- Check VITE_GOOGLE_CLIENT_ID in frontend/.env
- Restart frontend server

**"Invalid client" error?**
- Check GOOGLE_CLIENT_ID in backend/.env
- Verify credentials are correct
- Restart backend server

**"Redirect URI mismatch"?**
- Add `http://localhost:5173` to Google Console
- Check authorized origins

## 📝 Notes

- Same email = same account (Google or password)
- Google users get random password (not used)
- Role selected during first Google sign-in
- Existing users can switch to Google login
- All features work the same way

## 🎨 UI Preview

```
┌─────────────────────────────────┐
│     Email/Password Form         │
├─────────────────────────────────┤
│   ─────  Or continue with ───── │
├─────────────────────────────────┤
│  [🔵 Sign in with Google]       │
└─────────────────────────────────┘
```

## 🌐 Production Checklist

- [ ] Set OAuth consent to "Production"
- [ ] Add production domain to Google Console
- [ ] Update environment variables
- [ ] Test on production URL
- [ ] Monitor Google Cloud Console

---

**Need detailed setup?** See `GOOGLE_OAUTH_SETUP.md`
