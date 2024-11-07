// Import (a.k.a. require) third-party Node.js packages.
const express = require('express');

// Import (a.k.a. require) our own, custom Node.js packages.
const authController = require('../controllers/auth.controller');

// Create an Express router middleware object.
const router = express.Router();

// Express routes and their related controller functions.
router.get('/signup', authController.getSignup);

router.post('/signup', authController.signup);

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = router;
