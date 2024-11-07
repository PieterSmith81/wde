// Import (a.k.a. require) third-party Node.js packages.
const express = require('express');

// Create an Express router middleware object.
const router = express.Router();

// Express routes and their related controller functions.
router.get('/', function (req, res) {
  res.redirect('/products');
});

router.get('/401', function (req, res) {
  res.status(401).render('shared/401');
});

router.get('/403', function (req, res) {
  res.status(403).render('shared/403');
});

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = router;
