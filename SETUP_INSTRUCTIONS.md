# Setup Instructions for SwasthyaConnect

## Quick Start Guide

Follow these steps to get your application running:

### Step 1: Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

### Step 2: Start Backend Server

The MongoDB connection string is already configured in `backend/.env`. Start the backend:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend will run on **http://localhost:5000**

### Step 3: Install Frontend Dependencies

Open a NEW terminal window (keep the backend running) and navigate to the root folder:

```bash
cd "C:\Users\Jashwanth R\OneDrive\Desktop\Swastya"
npm install
```

### Step 4: Start Frontend Server

```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

### Step 5: Access the Application

Open your browser and go to:
**http://localhost:3000**

## Important Notes

1. **Keep both servers running** - You need both backend and frontend running simultaneously
2. **MongoDB Connection** - Already configured with your connection string
3. **Ports**:
   - Backend: 5000
   - Frontend: 3000
4. **First Run** - The backend will automatically connect to MongoDB when you start it

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check that MongoDB connection string is correct in `backend/.env`
- Ensure Node.js is installed (v18 or higher)

### Frontend won't start
- Make sure port 3000 is not in use
- Check that backend is running on port 5000
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### MongoDB Connection Issues
- Verify your MongoDB connection string
- Check your internet connection
- Ensure MongoDB Atlas allows connections from your IP

## File Structure

```
Swastya/
├── backend/          # Node.js/Express backend
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   └── server.js    # Main server file
├── src/             # React frontend
│   ├── api/         # API client
│   ├── components/  # React components
│   └── Pages/       # Page components
└── package.json     # Frontend dependencies
```

## Next Steps

Once both servers are running:
1. Visit http://localhost:3000
2. Explore the features
3. Create test patients and data
4. Test all the features

Enjoy your fully functional healthcare platform! 🏥

