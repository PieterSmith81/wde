// Import (a.k.a. require) built-in Node.js packages.
const path = require('path');

// Import (a.k.a. require) third-party Node.js packages.
const express = require('express');
/* IMPORTANT NOTE: The "csurf" package (https://www.npmjs.com/package/csurf) has now been DEPRECATED AND SHOULD NOT BE USED ANYMORE.
We are just using the "csurf" package here for training purposes, since the Academind Web Development Bootcamp course still uses this pacakage.
INSTEAD, use the "csrf-csrf" package (https://www.npmjs.com/package/csrf-csrf) GOING FORWARD to protect against CSRF attacks. */
const csrf = require('csurf');
const expressSession = require('express-session');

// Import (a.k.a. require) our own, custom Node.js packages.
const createSessionConfig = require('./config/session');
const db = require('./data/database');

// Import (a.k.a. require) our own, custom Express middleware.
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

// Create an Express application object.
const app = express();

// Configure the EJS HTML templating engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Register (a.k.a. use) built-in Express middleware.
We use the use() method on the Express app object
to register Express middleware that will be triggered for every incomming HTTP request.

Below, we serve some folders (like the "public" folder) statically using the built-in Express static middleware.
I.e., we make some folders, and all subfolders and files under them,
available to all EJS views as well as directly accessable/downloadable from the client web browser. */
app.use(express.static('public'));
/* Below is an example of using Express middleware with a path filter.
Here, only route requests that have a path starting with "/products/assets" will make it into the built-in Express static middleware.

Effectively, we are using a path filter ("/products/assets") here
to statically serve a specific folder ("/product-data") on our web server to the client web browser.
Doing so hides our web server folder structure from the client web browser.

I.e., all HTTP route requests starting with "/products/assets" will automatically be "pointed" to the statically served "/product-data" folder. 
But users won't know this and will only see HTTP requests starting with "/products/assets" in the client web browser
(so, under the Elements and Network tabs in Chrome's developer tools). */
app.use('/products/assets', express.static('product-data'));
/* urlencoded() is a built-in middleware function in Express.
It parses incoming requests with urlencoded payloads (so with urlencoded HTTP request bodies) and is based on body-parser.
More specifically, it automatically parses data from submitted HTML forms,
and then makes that data available via the req.body.[HTML form element name] properties on our Express route parameters. */
app.use(express.urlencoded({ extended: false }));
/* json() is another built-in middleware function in Express.
It parses incoming requests with JSON payloads (so with JSON formatted HTTP request bodies) and is based on body-parser. */
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

// Register (a.k.a. use) our own, custom Express middleware.
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
/* Below is an example of using Express middleware with a starting path filter.
Here, only route requests that have a path starting with "/cart" will make it into the cartRoutes Express route middleware. */
app.use('/cart', cartRoutes);
/* Below is another example of using Express middleware with a starting path filter.
Here, only route requests that have a path starting with "/orders" will make it into the ordersRoutes Express route middleware.
Additionally, we also invoke our own custom route protection Express middleware ("protectRoutesMiddleware")
to protect our "/orders" routes from unauthenticated access. */
app.use('/orders', protectRoutesMiddleware, ordersRoutes);
/* Below is yet another example of using Express middleware with a starting path filter.
Here, only route requests that have a path starting with "/admin" will make it into the adminRoutes Express route middleware.
Additionally, we also invoke our own custom route protection Express middleware ("protectRoutesMiddleware")
to protect our "/admin" routes from unauthorised access. */
app.use('/admin', protectRoutesMiddleware, adminRoutes);
/* Global Express error handling middlewares.
These middlewares will become active whenever any previously registered route/middleware crashed (i.e., throws and error).
Note that most async JavaScript code (like MongoDB database driver CRUD operations) will not invoke the error handling middlewares below,
since most async JavaScript code are wrapped in JavaScript promises.
So, async JavaScript code will still require their own try/catch statements for error handling. */
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

/* Connect to the MongoDB database using our own, custom Express database connection middleware,
as defined in "/data/database.js" and imported (a.k.a. required) above. */
db.connectToDatabase()
  .then(function () {
    // Spin up the Express server.
    app.listen(3000);
  })
  .catch(function (error) {
    // Handle potential MongoDB connection errors.
    console.log('Failed to connect to the database or database server.');
    console.log(error);
  });
