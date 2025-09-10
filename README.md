<h1 align="center">MERN Stack App 🚀</h1>

<p align="center">
  <strong>Full-Stack MERN Application with Role-Based Authentication</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 🌟 Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control**: Admin and Student roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt hashing with salt rounds
- **Change Password**: Secure password update functionality

### 👨‍💼 Admin Dashboard
- **Student Management**: Complete CRUD operations for student accounts
- **User Overview**: View all registered students with filtering
- **Account Control**: Edit student profiles, delete accounts
- **Course Assignment**: Assign courses to students

### 🎓 Student Dashboard
- **Profile Management**: View and edit personal information
- **Course Content**: Access assigned course materials
- **Account Settings**: Update profile and change password
- **Responsive Design**: Mobile-friendly interface

### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark gradient background
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Responsive and modern styling
- **Loading States**: Beautiful loading spinners and states

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Zustand** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests

### Deployment
- **Vercel** for full-stack deployment
- **MongoDB Atlas** for cloud database
- **Serverless Functions** for backend API

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables

Create `.env.local` in the frontend directory for local development:

```bash
VITE_API_URL=http://localhost:5000/api/auth
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mern-stack-app.git
cd mern-stack-app
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Setup environment variables**
```bash
# Create .env file in root directory
# Add your MongoDB URI and JWT secret
```

4. **Start the application**

For development:
```bash
# Start backend (from root)
npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev
```

For production build:
```bash
# Build and start
npm run build
npm start
```

---

## 📁 Project Structure

```
mern-stack-app/
├── backend/                 # Express.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── index.js            # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand store
│   │   └── utils/          # Utility functions
│   └── dist/              # Built frontend (production)
├── vercel.json            # Vercel deployment config
└── package.json           # Root package.json
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Prepare for deployment**
   - Ensure all environment variables are set
   - Test the build locally: `npm run build`

2. **Deploy to Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Environment variables for Vercel**
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=production
   ```

### Live URLs
- **Frontend & API**: `https://your-app.vercel.app`
- **API Health Check**: `https://your-app.vercel.app/api/health`

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-auth` - Verify authentication

### Admin Operations
- `GET /api/auth/students` - Get all students (Admin only)
- `PUT /api/auth/students/:id` - Update student (Admin only)
- `DELETE /api/auth/students/:id` - Delete student (Admin only)

### User Operations
- `PUT /api/auth/change-password` - Change password

---

## 👥 User Roles

### Admin
- Manage all student accounts
- View student dashboard
- Create, edit, and delete student profiles
- Assign courses to students

### Student
- View and edit own profile
- Access assigned course content
- Change password
- View dashboard with personal information

---

## 🔧 Development Scripts

```bash
# Root level scripts
npm run dev          # Start backend in development
npm run build        # Build frontend for production
npm run start        # Start production server

# Frontend scripts
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend scripts
cd backend
npm run dev          # Start with nodemon
npm start           # Start production server
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vercel for seamless deployment
- MongoDB for the excellent database
- Tailwind CSS for the utility-first approach

---

<p align="center">
  <strong>Built with ❤️ using the MERN Stack</strong>
</p>
