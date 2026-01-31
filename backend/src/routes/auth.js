const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }
    const exists = await User.findOne({ email: email.trim().toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Email already registered.' });
    }
    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      success: true,
      token,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Registration failed.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      token,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Login failed.' });
  }
});

// Get current user (protected)
router.get('/me', auth, (req, res) => {
  res.json({ user: { email: req.user.email, name: req.user.name } });
});

module.exports = router;
