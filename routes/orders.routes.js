// Import (a.k.a. require) third-party Node.js packages.
const express = require('express');

// Import (a.k.a. require) our own, custom Node.js packages.
const ordersController = require('../controllers/orders.controller');

// Create an Express router middleware object.
const router = express.Router();

// Express routes and their related controller functions.
/* Note that "/orders" has been omitted from the beginning of the route paths below.
This is done since this orders routes Express middleware file is registered with a starting path filter in app.js
(as per the "app.use('/orders', ordersRoutes);" code line in app.js).
Because of this starting path filter, "/orders" is not required in the route paths below.

For example, the "/" POST and GET route paths below are actually equal to "/orders" thanks to the starting path filter in app.js mentioned above.
And all other route paths below are also automatically prefixed with "/orders". */
router.post('/', ordersController.addOrder);

router.get('/', ordersController.getOrders);

// Stripe payments success/failure routes below (again automatically prefixed with "/orders", as described in the comments above.).
router.get('/success', ordersController.getSuccess);

router.get('/failure', ordersController.getFailure);

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = router;
