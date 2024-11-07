// Import (a.k.a. require) third-party Node.js packages.
const express = require('express');

// Import (a.k.a. require) our own, custom Node.js packages.
const cartController = require('../controllers/cart.controller');

// Create an Express router middleware object.
const router = express.Router();

// Express routes and their related controller functions.
/* Note that "/cart" has been omitted from the beginning of the route paths below.
This is done since this cart routes Express middleware file is registered with a starting path filter in app.js
(as per the "app.use('/cart', cartRoutes);" code line in app.js).
Because of this starting path filter, "/cart" is not required in the route paths below.

For example, the "/" GET route path below is actually equal to "/cart" thanks to the starting path filter in app.js mentioned above.
And all other route paths below are also automatically prefixed with "/cart". */
router.get('/', cartController.getCart);

router.post('/items', cartController.addCartItem);

/* Note the use of a PATCH Express route below.
You usually use a PATCH HTTP request if you are updating parts of existing data on the server.
(And you usually use a PUT HTTP request if you are replacing/totally overriding existing data on the server).
Hence the use of a PATCH Express route below. */
router.patch('/items', cartController.updateCartItem);

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = router;
