# Testing Guide - Food Waste Reduction App

## Current Status ✅

- **Backend**: Running on `http://localhost:5001`
- **Frontend**: Running on `http://localhost:5173`
- **Database**: MySQL connected and synchronized
- **Socket.IO**: Initialized for real-time updates

## Test User Credentials

Use these credentials to test different user roles:

### Admin Account
- **Email**: `admin@foodwaste.com`
- **Password**: `admin123`
- **Role**: Admin (can view all posts, manage users, view statistics)

### Donor Account
- **Email**: `donor@test.com`
- **Password**: `test123`
- **Role**: Donor (can post food items for donation)

### Volunteer Account
- **Email**: `volunteer@test.com`
- **Password**: `test123`
- **Role**: Volunteer (can claim food items and complete deliveries)

### Farmer Account
- **Email**: `farmer@test.com`
- **Password**: `test123`
- **Role**: Farmer (can view waste food marketplace)

## Testing Workflow

### 1. Test Donor Flow
1. Go to `http://localhost:5173`
2. Click "Login"
3. Enter donor credentials (`donor@test.com` / `test123`)
4. Click "Post Food"
5. Fill in food details:
   - Food Type: e.g., "Vegetables"
   - Quantity: e.g., "5 kg"
   - Freshness Duration: e.g., "2 days"
   - Pickup Location: e.g., "123 Main St"
   - Upload an image
6. Click "Post Food"
7. You should see the post appear in your dashboard

### 2. Test Volunteer Flow
1. Open a new browser tab/window
2. Go to `http://localhost:5173`
3. Click "Login"
4. Enter volunteer credentials (`volunteer@test.com` / `test123`)
5. You should see available food posts from donors
6. Click "Claim" on any post
7. Confirm the claim
8. You'll receive an OTP to share with the donor
9. Go to "My Claims" tab to see claimed items

### 3. Test Admin Dashboard
1. Go to `http://localhost:5173`
2. Click "Login"
3. Enter admin credentials (`admin@foodwaste.com` / `admin123`)
4. View:
   - Total posts, claims, and completions
   - Available food posts
   - Claimed posts
   - Completed deliveries
   - Real-time updates when donors post new food

### 4. Test Real-Time Updates
1. Open admin dashboard in one window
2. Open donor dashboard in another window
3. Post a new food item as donor
4. Watch it appear instantly in the admin dashboard (no page refresh needed)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login

### Food Posts (Donor)
- `POST /api/food/create` - Create new food post (requires auth + donor role)
- `GET /api/food/my-posts` - Get donor's posts (requires auth + donor role)

### Food Posts (Volunteer)
- `GET /api/food/available` - Get available food posts (requires auth + volunteer role)
- `GET /api/food/my-claims` - Get claimed posts (requires auth + volunteer role)
- `POST /api/food/claim/:id` - Claim a food post (requires auth + volunteer role)
- `POST /api/food/verify-otp/:id` - Verify OTP and complete delivery (requires auth + donor role)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (requires auth + admin role)
- `GET /api/admin/posts` - Get all posts (requires auth + admin role)
- `GET /api/admin/claims` - Get all claims (requires auth + admin role)

## Troubleshooting

### 401 Unauthorized Errors
- **Cause**: Not logged in or token expired
- **Solution**: Log in with valid credentials

### Cannot connect to backend
- **Cause**: Backend not running
- **Solution**: Run `npm start` in the `backend` folder

### Cannot connect to frontend
- **Cause**: Frontend not running
- **Solution**: Run `npm run dev` in the `frontend` folder

### Database connection errors
- **Cause**: MySQL not running or credentials incorrect
- **Solution**: Check `.env` file in backend folder for correct DB credentials

### Images not loading
- **Cause**: Upload path issue
- **Solution**: Check that `backend/uploads/food-images` folder exists

## Creating More Test Users

To create additional test users, edit `backend/create-test-users.mjs` and run:
```bash
node create-test-users.mjs
```

## Resetting Database

To reset the database and start fresh:
```bash
node reset-db.js
```

Then recreate test users:
```bash
node create-admin.mjs
node create-test-users.mjs
```

## Next Steps

1. Test all user flows with the provided credentials
2. Verify real-time updates work correctly
3. Check responsive design on mobile/tablet
4. Test image uploads and display
5. Verify Socket.IO real-time notifications

---

**Note**: This is a development environment. For production deployment, see `DEPLOYMENT_GUIDE.md`
