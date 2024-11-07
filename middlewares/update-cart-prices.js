// Middleware function.
async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart;

  await cart.updatePrices();

  next();
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = updateCartPrices;
