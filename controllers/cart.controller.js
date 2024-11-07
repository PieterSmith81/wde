// Import (a.k.a. require) our own, custom Node.js packages.
const Product = require('../models/product.model');

// Route controller functions.
async function addCartItem(req, res, next) {
  // Retrieve the product to be added to the cart from the MongoDb database.
  let product;

  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    product = await Product.findById(req.body.productId); // Example of calling a static method on a class.
  } catch (error) {
    next(error);
    return;
  }

  // Then, add the product to our "in-memory" cart (as stored in res.local.cart).
  const cart = res.locals.cart;
  cart.addItem(product);

  /* And also save the updated cart back to the user's session (as stored in the MongoDB database),
  effectively overwritting the cart stored in the user's session. */
  req.session.cart = cart;

  /* Finally, send a JSON response back to the client (so, back to the user's web browser)
  since we are an using AJAX request (a.k.a. frontend JS request) to add items to the cart. */
  res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity,
  });
}

function getCart(req, res) {
  res.render('customer/cart/cart');
}

function updateCartItem(req, res) {
  /* Update the quantity for a specific item in the cart
  or delete that item from the cart, if its quantity was set to 0 (or less) by the user. */
  const cart = res.locals.cart;

  /* Adding a "+" to the beginning of a JavaScript string type value, converts it to a JavaScript number type.
  We have to convert the quantity value we receive from the HTML form to a JavaScript number type below,
  because the value of an HTML input field is always a string value, even if that HTML input field is of "type=number". */
  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  );

  /* And also save the updated cart back to the user's session (as stored in the MongoDB database),
  effectively overwritting the cart stored in the user's session. */
  req.session.cart = cart;

  /* Finally, send a JSON response back to the client (so, back to the user's web browser)
  since we are using an AJAX request (a.k.a. frontend JS request) to update cart item quantities. */
  res.status(201).json({
    message: 'Item updated!',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
