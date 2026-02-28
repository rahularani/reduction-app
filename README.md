# FeedForward 🍽️

A real-time platform connecting food donors (restaurants, hotels, hostels) with NGOs, volunteers, and farmers to reduce food waste and support communities in need.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 🌟 Features

### For Donors (Restaurants, Hotels, Event Organizers)
- 📸 **Post Surplus Food** with images and details
- 📍 **GPS Location Integration** - Auto-capture pickup location
- 🔔 **Real-time Notifications** when volunteers claim food
- ✅ **OTP Verification** for secure delivery confirmation
- 💰 **Waste Food Marketplace** - Sell expired food to farmers for animal feed
- 📊 **Dashboard** to track all posted food and delivery status

### For Volunteers (NGOs, Individuals)
- 🔍 **Browse Available Food** in real-time
- 🗺️ **Google Maps Integration** for navigation to pickup locations
- 🎫 **OTP System** for food collection
- 📱 **Live Updates** when new food is posted
- 📋 **Track Claims** with delivery status

### For Farmers
- 🛒 **Buy Waste Food** for animal feed at affordable prices
- 📍 **Location-based Listings** with Google Maps
- 💳 **Secure Transactions** with seller contact
- 📦 **Purchase History** tracking

### For Admins
- 👥 **User Management** - Monitor all users (donors, volunteers, farmers)
- 📊 **Analytics Dashboard** - Track donations and marketplace stats
- 🗑️ **Content Moderation** - Delete inappropriate posts
- 📈 **System Overview** - Complete platform insights

### Core Features
- 🔐 **Secure Authentication** with JWT
- ⚡ **Real-time Updates** using Socket.IO
- 🖼️ **Image Upload** for food posts
- 🔒 **Privacy Protection** - Location hidden after delivery
- 📬 **Notification System** for both donors and volunteers
- 🌐 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Vite** for fast development
- **Zustand** for state management
- **Socket.IO Client** for real-time updates
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MySQL** with Sequelize ORM
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing

## 📋 Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn

**Quick Start**: See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/feedforward.git
cd feedforward
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Set up MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE food_waste_app;
```

### 4. Configure Environment Variables

**Important**: Never commit `.env` files to version control. They contain sensitive credentials.

**Backend** (`backend/.env`):
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=food_waste_app
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

### 5. Run the Application

From the root directory:

```bash
npm run dev
```

This will start both frontend and backend servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

Or run them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📱 Usage

### As a Donor

1. **Register** as a Donor
2. **Login** to your dashboard
3. **Post Surplus Food**:
   - Upload food image
   - Add food type, quantity, freshness duration
   - Use GPS to capture location or enter manually
4. **Monitor Claims** - Get notified when volunteers claim your food
5. **Verify Delivery** - Enter volunteer's OTP to complete delivery

### As a Volunteer

1. **Register** as a Volunteer
2. **Login** to your dashboard
3. **Browse Available Food** in real-time
4. **Claim Food** - Get instant OTP
5. **Navigate** to pickup location using Google Maps
6. **Show OTP** to donor for verification
7. **Complete Delivery** - Status updates automatically

## 🏗️ Project Structure

```
feedforward/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components (Donor, Volunteer, Farmer, Admin)
│   │   ├── store/           # Zustand state management
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Express TypeScript backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Sequelize models (User, Food, WasteFood)
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── socket/          # Socket.IO configuration
│   │   └── server.ts        # Server entry point
│   ├── uploads/             # Uploaded images
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## 🔑 Key Features Explained

### Real-time Updates
- Uses Socket.IO for instant notifications
- Volunteers see new food posts immediately
- Donors get notified when food is claimed
- Status updates sync across all dashboards

### OTP Verification System
- 6-digit OTP generated when food is claimed
- Volunteer shows OTP to donor
- Donor verifies OTP to complete delivery
- Prevents fraud and ensures accountability

### Location Privacy
- Full address visible during active delivery
- Location automatically hidden after completion
- Protects donor privacy post-delivery

### Image Upload
- Supports JPG, PNG, GIF, WebP formats
- 5MB file size limit
- Images stored securely on server
- Automatic image optimization

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Food Management
- `POST /api/food/create` - Create food post (Donor)
- `GET /api/food/my-posts` - Get donor's posts
- `GET /api/food/available` - Get available food (Volunteer)
- `GET /api/food/my-claims` - Get volunteer's claims
- `POST /api/food/claim/:id` - Claim food (Volunteer)
- `POST /api/food/verify-otp/:id` - Verify OTP (Donor)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed installation and setup instructions
- [Security Guidelines](SECURITY.md) - Security best practices and guidelines
- [Changelog](CHANGELOG.md) - Version history and changes

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by the need to reduce food waste globally
- Built with ❤️ for a sustainable future

## 📞 Support

For support, email your@email.com or open an issue in the repository.

---

**FeedForward - Moving food forward, not wasting it 💚**
