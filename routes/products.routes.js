// Import (a.k.a. require) third-party Node.js packages.
const express = require('express');

// Import (a.k.a. require) our own, custom Node.js packages.
const productsController = require('../controllers/products.controller');

// Create an Express router middleware object.
const router = express.Router();

// Express routes and their related controller functions.
router.get('/products', productsController.getAllProducts);

// Below is an example of a dynamic route, as implemented by using a route path placeholder (the ":id" placeholder in this case).
router.get('/products/:id', productsController.getProductDetails);

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = router;
