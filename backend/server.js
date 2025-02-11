/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('MongoDB connected successfully');
  mongoose.connection.on('connected', () => {
    console.log('Connected to database:', mongoose.connection.db.databaseName);
  });
})
.catch(err => {
  console.error('MongoDB connection error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    codeName: err.codeName
  });
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FinTrack API' });
});

// Start server with error handling
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', {
    code: err.code,
    message: err.message,
    details: err
  });
}); 