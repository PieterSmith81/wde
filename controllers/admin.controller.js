// Import (a.k.a. require) our own, custom Node.js packages.
const Product = require('../models/product.model');
const Order = require('../models/order.model');

// Route controller functions.
async function getProducts(req, res, next) {
  /* Asynchronous code (i.e. JavaScript promises) error handling.
  See the try/catch statement comment in the signup() function
  in the "/controllers/auth.controller.js" file for details on why this is required. */
  try {
    const products = await Product.findAll(); // Example of calling a static method on a class.
    res.render('admin/products/all-products', { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  res.render('admin/products/new-product');
}

async function createNewProduct(req, res) {
  /* Below is an example of using the JavaScript spread operator to extract all key/value pairs from one object (req.body) and
  add those key/value pairs to another object (the on the fly JavaScript object we are building here using JavaScript object notation). */
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  /* Asynchronous code (i.e. JavaScript promises) error handling.
  See the try/catch statement comment in the signup() function
  in the "/controllers/auth.controller.js" file for details on why this is required. */
  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    // Note the use of a dynamic route placeholder below (as exposed by "req.params.[dynamic route placeholder name]").
    const product = await Product.findById(req.params.id); // Example of calling a static method on a class.

    res.render('admin/products/update-product', { product: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  /* Below is another example of using the JavaScript spread operator to extract all key/value pairs from one object (req.body) and
  add those key/value pairs to another object (the on the fly JavaScript object we are building here using JavaScript object notation).
  Also note the use of a dynamic route placeholder below (as exposed by "req.params.[dynamic route placeholder name]"). */
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  // Replace the old product image with a new one if the product image was updated while editing the product.
  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    await product.save();
  } catch (error) {
    next(error); // or "return next(error);" to replace these two lines with one line of code.
    return;
  }

  res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
  let product;

  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    product = await Product.findById(req.params.id); // Example of calling a static method on a class.
    await product.remove();
  } catch (error) {
    return next(error);
  }

  /* Send a JSON response back to the client (so, back to the user's web browser)
  since we are an using AJAX request (a.k.a. frontend JS request) to delete products.
  This response below is not used on the client-side, but the line below is included regardless for demonstration purposes
  on how such a response would be sent back to the client. */
  res.json({ message: 'Product has been deleted.' });
}

async function getOrders(req, res, next) {
  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    const orders = await Order.findAll();

    res.render('admin/orders/admin-orders', {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    /* Send a JSON response back to the client (so, back to the user's web browser)
    since we are an using AJAX request (a.k.a. frontend JS request) to update orders. */
    res.json({
      message: 'Order updated.',
      newStatus: newStatus,
    });
  } catch (error) {
    next(error);
  }
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
