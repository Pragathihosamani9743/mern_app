# 🚀 MERN Stack Deployment Guide - Vercel Only

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Vercel account (free)

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account and cluster
3. Get your connection string (it looks like): 
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
   ```
4. Whitelist all IP addresses (0.0.0.0/0) for simplicity

## Step 2: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

## Step 3: Deploy Full Stack on Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign in with GitHub
3. Click "New Project" → Import your GitHub repository
4. **Important**: Select the root directory (not frontend or backend)
5. Vercel will automatically detect the `vercel.json` configuration
6. Add environment variables in Vercel dashboard:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=production
   ```
7. Deploy!

## Step 4: Test Your Deployment

1. Visit your Vercel app URL (e.g., `https://your-app.vercel.app`)
2. Test registration, login, and all features
3. Check that admin and student dashboards work correctly
4. API endpoints will be available at `https://your-app.vercel.app/api/auth/*`

## Environment Variables for Vercel

### Production (.env on Vercel dashboard):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
NODE_ENV=production
```

### Local Development (.env in root):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
NODE_ENV=development
```

## Project Structure for Vercel
```
project-root/
├── vercel.json              # Vercel configuration
├── package.json             # Root package.json with build scripts
├── backend/
│   ├── index.js            # Main server file (exports app for Vercel)
│   ├── package.json        # Backend dependencies
│   └── ...
└── frontend/
    ├── package.json        # Frontend dependencies
    ├── dist/              # Built frontend (created by build)
    └── ...
```

## How It Works

1. **Vercel Build Process**:
   - Runs `vercel-build` script from root package.json
   - Installs backend dependencies
   - Installs frontend dependencies
   - Builds frontend to `dist/` folder

2. **Routing**:
   - API calls to `/api/*` → Backend serverless functions
   - All other routes → Frontend SPA

3. **Backend as Serverless Functions**:
   - Backend runs as Vercel serverless functions
   - Automatically scales and handles requests
   - No server management needed

## Advantages of Vercel-Only Deployment

✅ **Single Platform**: Everything in one place
✅ **Automatic HTTPS**: SSL certificates included
✅ **Global CDN**: Fast worldwide performance
✅ **Zero Config**: Automatic deployments on git push
✅ **Free Tier**: Generous limits for personal projects
✅ **Serverless**: No server management required
✅ **Custom Domains**: Easy to add your own domain

## Troubleshooting

### Common Issues:
1. **API Not Working**: Check that routes start with `/api/`
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Build Errors**: Check that all package.json files are correct
4. **CORS Issues**: Should be automatically handled

### Vercel Logs:
- Go to Vercel dashboard → Your project → Functions tab
- Click on any function to see logs
- Check for errors in serverless function execution

## Free Tier Limitations
- **Vercel**: 100GB bandwidth/month, 10 million function invocations
- **MongoDB Atlas**: 512MB storage on free tier
- **Serverless Functions**: 10-second execution limit

## Production Tips
1. Monitor function execution in Vercel dashboard
2. Set up custom domain names
3. Use Vercel Analytics (free)
4. Set up Git integration for automatic deployments
5. Monitor database usage in MongoDB Atlas

## Your App URLs (After Deployment)
- **Full Stack App**: https://your-app-name.vercel.app
- **API Health Check**: https://your-app-name.vercel.app/api/health
- **Database**: MongoDB Atlas cluster

## Quick Commands

### Local Development:
```bash
npm run dev          # Start backend
cd frontend && npm run dev  # Start frontend (separate terminal)
```

### Production Build Test:
```bash
npm run build        # Build frontend
npm start           # Start production server
```

Happy Deploying! 🚀
