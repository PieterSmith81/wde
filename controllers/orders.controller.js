// Import (a.k.a. require) third-party Node.js packages.
/* Below is our Stripe test secret API key as obtainted from:
https://dashboard.stripe.com/test/apikeys */
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import (a.k.a. require) our own, custom Node.js packages.
const Order = require('../models/order.model');
const User = require('../models/user.model');

// Route controller functions.
async function getOrders(req, res) {
  try {
    // Asynchronous code (i.e. JavaScript promises) error handling.
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', { orders: orders });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  // Convert the cart data into order data and store those orders in the MongoDB database.
  const cart = res.locals.cart;
  let userDocument;

  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  // Asynchronous code (i.e. JavaScript promises) error handling.
  try {
    await order.save();
  } catch (error) {
    return next(error);
  }

  // Clear the cart.
  req.session.cart = null;

  /* Our Stripe-hosted checkout code.
  As documented at: https://stripe.com/docs/checkout/quickstart?client=html&lang=node */
  const session = await stripe.checkout.sessions.create({
    /* Use the the JavaScript array map() utility method to transform the cart items array
    into a configuration array that is compatible with the Stripe checkout session's create() method. */
    line_items: cart.items.map(function (item) {
      return {
        /* Configuration of the price_data object below is documented here:
        https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-price_data */
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title,
          },
          /* Note that Stripe's "unit_amount_decimal" configuration property expects a value in cents,
          hence the calculation of "* 100" below. */
          unit_amount_decimal: +item.product.price.toFixed(2) * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: 'payment',
    /* Instruct Stipe to redirect to our own, custom payment success or failure Express routes (and their related EJS views),
    as defined in the "/routes/orders.routes.js" routes file,
    and in the "/views/customer/orders/success.ejs" and "/views/customer/orders/failure.ejs" EJS view files. */
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  // Redirect the user to Stripe's website so that the payment can be processed on the Stripe-hosted checkout webpage.
  res.redirect(303, session.url);
}

// Stripe related success/failure route controller functions (as called from the "/routes/orders.routes.js" routes file).
function getSuccess(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
