const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const {
  getProfile,
  updateProfile,
  updatePassword,
  updatePreferences,
  deleteAccount,
  uploadAvatar,
  deleteAvatar
} = require('../controllers/profileController');

// Get profile
router.get('/', auth, getProfile);

// Update profile
router.put('/', auth, updateProfile);

// Update password
router.put('/password', auth, updatePassword);

// Update preferences
router.put('/preferences', auth, updatePreferences);

// Delete account
router.delete('/', auth, deleteAccount);

// Avatar routes
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.delete('/avatar', auth, deleteAvatar);

module.exports = router; 