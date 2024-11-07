// Import (a.k.a. require) our own, custom Node.js packages.
const Product = require('../models/product.model');

// Route controller functions.
async function getAllProducts(req, res, next) {
  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    const products = await Product.findAll();

    res.render('customer/products/all-products', { products: products });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    // Note the use of a dynamic route placeholder below (as exposed by "req.params.[dynamic route placeholder name]").
    const product = await Product.findById(req.params.id); // Example of calling a static method on a class.

    res.render('customer/products/product-details', { product: product });
  } catch (error) {
    next(error);
  }
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails,
};
