// Import (a.k.a. require) third-party Node.js packages.
const express = require('express');

// Import (a.k.a. require) our own, custom Node.js packages.
const adminController = require('../controllers/admin.controller');

// Import (a.k.a. require) our own, custom Express middleware.
const imageUploadMiddleware = require('../middlewares/image-upload');

// Create an Express router middleware object.
const router = express.Router();

// Express routes and their related controller functions.
/* Note that "/admin" has been omitted from the beginning of the route paths below.
This is done since this admin routes Express middleware file is registered with a starting path filter in app.js
(as per the "app.use('/admin', adminRoutes);" code line in app.js).
Because of this starting path filter, "/admin" is not required in the route paths below. */
router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProduct);

/* Note the use of the custom "Multer" image upload middleware below.
This "imageUploadMiddleware" middleware configures the Multer "multipart/form-data" HTML form handling Node.js middleware package.
And it also adds a "file" object to the next middleware in line (our "adminController.createNewProduct" route handling middleware). */
router.post(
  '/products',
  imageUploadMiddleware,
  adminController.createNewProduct
);

// Below is an example of a dynamic route, as implemented by using a route path placeholder (the ":id" placeholder in this case).
router.get('/products/:id', adminController.getUpdateProduct);

/* Another example of a dynamic route,
this time also with the "imageUploadMiddleware" Multer "multipart/form-data" HTML form handling middleware being invoked first. */
router.post(
  '/products/:id',
  imageUploadMiddleware,
  adminController.updateProduct
);

/* Note the use of the DELETE HTTP method below to delete products (as called from an AJAX request).
We used an AJAX request (a.k.a. frontend JS request) here to get some more exercise using AJAX requests.
See the related frontend AJAX request code in the "/public/scripts/product-management.js" file.
Also below, is yet another example of a dynamic route. */
router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);

/* Note the use of a PATCH Express route below.
You usually use a PATCH HTTP request if you are updating parts of existing data on the server.
(And you usually use a PUT HTTP request if you are replacing/totally overriding existing data on the server).
Hence the use of a PATCH Express route below.
Also below, is yet another example of a dynamic route. */
router.patch('/orders/:id', adminController.updateOrder);

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = router;
