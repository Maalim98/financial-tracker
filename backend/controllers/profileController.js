/* eslint-env node, commonjs */
/* global require, module, __dirname */
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Check if email is already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: name || undefined,
          email: email || undefined,
          phone: phone || undefined,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.updatedAt = Date.now();
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update preferences
const updatePreferences = async (req, res) => {
  try {
    const { darkMode, emailNotifications, currency } = req.body;
    console.log('Updating preferences:', { darkMode, emailNotifications, currency });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'preferences.darkMode': darkMode,
          'preferences.emailNotifications': emailNotifications,
          'preferences.currency': currency,
          updatedAt: Date.now()
        }
      },
      { new: true }
    ).select('-password');

    console.log('Updated user:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password before deletion
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old avatar if it exists
    if (user.avatar) {
      try {
        await fs.unlink(path.join(__dirname, '..', user.avatar));
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    // Update user with new avatar path
    const avatarPath = '/uploads/avatars/' + req.file.filename;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          avatar: avatarPath,
          updatedAt: Date.now()
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Avatar uploaded successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete avatar
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatar) {
      try {
        await fs.unlink(path.join(__dirname, '..', user.avatar));
      } catch (error) {
        console.error('Error deleting avatar file:', error);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            avatar: '',
            updatedAt: Date.now()
          }
        },
        { new: true }
      ).select('-password');

      return res.json({
        message: 'Avatar deleted successfully',
        user: updatedUser
      });
    }

    res.status(400).json({ message: 'No avatar to delete' });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  updatePreferences,
  deleteAccount,
  uploadAvatar,
  deleteAvatar
}; 