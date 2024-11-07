// Import (a.k.a. require) our own, custom Node.js packages.
const Cart = require('../models/cart.model');

// Middleware function.
function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    const sessionCart = req.session.cart;

    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    );
  }

  res.locals.cart = cart;

  next();
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = initializeCart;
