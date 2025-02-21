/* eslint-env node, commonjs */
/* global require, module, process, __dirname */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const transactionRoutes = require('./routes/transactions');
const profileRoutes = require('./routes/profile');

const app = express();

// Middleware
app.use(cors());  // Use default CORS settings
app.use(express.json());

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('MongoDB connected successfully');
  mongoose.connection.on('connected', () => {
    console.log('Connected to database:', mongoose.connection.db.databaseName);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', {
    name: err.name,
    message: err.message,
    code: err.code,
    codeName: err.codeName
  });
  console.log('Please check:');
  console.log('1. MongoDB Atlas IP whitelist');
  console.log('2. Network connectivity');
  console.log('3. Database credentials');
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads', 'avatars');
fs.mkdirSync(uploadDir, { recursive: true });

// Add a health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'FinTrack API is running' });
});

// Update error handling middleware
app.use((err, req, res) => {  // Remove unused _next parameter
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server with error handling
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', {
    code: err.code,
    message: err.message,
    details: err
  });
}); 