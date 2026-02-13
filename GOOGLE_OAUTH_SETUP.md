# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Food Waste Reduction App.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: "Food Waste Reduction App"
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in the required information:
   - App name: Food Waste Reduction App
   - User support email: Your email
   - Developer contact email: Your email
5. Click "Save and Continue"
6. Skip the "Scopes" section (click "Save and Continue")
7. Add test users if needed (for development)
8. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Configure the following:
   - Name: Food Waste Reduction Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:5174`
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - `http://localhost:5174`
5. Click "Create"
6. Copy the "Client ID" and "Client Secret"

## Step 5: Update Environment Variables

### Backend (.env)
```env
GOOGLE_CLIENT_ID=your-client-id-from-step-4
GOOGLE_CLIENT_SECRET=your-client-secret-from-step-4
```

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-from-step-4
```

**Important:** Use the same Client ID in both frontend and backend!

## Step 6: Restart Your Servers

After updating the environment variables:

```bash
# Stop both servers (Ctrl+C)

# Restart backend
cd backend
npm run dev

# Restart frontend (in a new terminal)
cd frontend
npm run dev
```

## Step 7: Test Google Sign-In

1. Go to `http://localhost:5173/login`
2. Click the "Sign in with Google" button
3. Select your Google account
4. Grant permissions
5. You should be redirected to the appropriate dashboard

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure the redirect URIs in Google Cloud Console match your frontend URL exactly
- Common URLs to add:
  - `http://localhost:5173`
  - `http://localhost:5174`

### "Error 401: invalid_client"
- Check that your Client ID and Client Secret are correct
- Make sure there are no extra spaces in the .env files

### Google button not showing
- Check browser console for errors
- Verify VITE_GOOGLE_CLIENT_ID is set in frontend/.env
- Make sure you restarted the frontend server after adding the env variable

### "Google authentication failed"
- Check backend console for detailed error messages
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in backend/.env
- Make sure you restarted the backend server

## Production Deployment

For production deployment:

1. Update OAuth consent screen to "Production" status
2. Add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
3. Update environment variables with production URLs
4. Never commit .env files to version control

## Security Notes

- Keep your Client Secret confidential
- Never expose it in frontend code
- Use environment variables for all sensitive data
- Regularly rotate your credentials
- Monitor OAuth usage in Google Cloud Console

## Features

With Google OAuth enabled, users can:
- Sign in with their Google account (no password needed)
- Register with their Google account
- Automatically get their name and email from Google
- Choose their role (Donor/Volunteer) during registration
- Existing users can sign in with Google if they used the same email

## Support

If you encounter issues:
1. Check the browser console for frontend errors
2. Check the backend terminal for server errors
3. Verify all environment variables are set correctly
4. Ensure Google Cloud project is properly configured
5. Check that APIs are enabled in Google Cloud Console
