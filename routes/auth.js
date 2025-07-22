const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { login, logout, checkAuth, register } = require('../controllers/authController');

// Register endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

// Logout endpoint
router.post('/logout', logout);

// Auth check endpoint (requires authentication)
router.get('/check', requireAuth, checkAuth);

module.exports = router; 