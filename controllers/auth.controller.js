// Import (a.k.a. require) our own, custom Node.js packages.
const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');
const session = require('express-session');

// Route controller functions.
function getSignup(req, res) {
  // Retrieve temporarily flashed data used for data retention between page refreshes, from the session.
  let sessionData = sessionFlash.getSessionData(req);

  /* If no session data could be retrieved (so, if the signup page/form hasn't been been submitted before),
  then first set some default session data. */
  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: '',
    };
  }

  res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(
      req.body.email,
      /* Below is an example of using JavaScript bracket notation to access an object property that has a hyphen in its key name. */
      req.body['confirm-email']
    )
  ) {
    // Flash data temporarily to a session for data retention between page refreshes.
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input. Your email address must be confirmed, password must be at least 6 characters long, and postal code must be at least 5 characters long (and not longer than 7 characters).',
        /* Below is an example of using the JavaScript spread operator to extract all key/value pairs from one object (enteredData) and
        add those key/value pairs to another object (the on the fly JavaScript object we are building here using JavaScript object notation). */
        ...enteredData,
      },
      function () {
        res.redirect('/signup');
      }
    );

    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  /* Asynchronous code (i.e. JavaScript promises) error handling.
  Errors inside a JavaScript promise is not caught by default by the global Express error handling middleware.
  Hence, you should wrap most asynchronous JavaScript code
  (for example, database accessing or complex async/await statements that return one or more JavaScript promises) in a try/catch statement.
  You can then use the next() Express route parameter function to manually pass any try/catch caught errors
  to the global Express error handling middleware (as defined towards the end of app.js). */
  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      // Flash data temporarily to a session for data retention between page refreshes.
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage:
            'The user you are trying to sign up already exists. Please sign up a new user or log in instead.',
          ...enteredData,
        },
        function () {
          res.redirect('/signup');
        }
      );

      return;
    }

    await user.signup();
  } catch (error) {
    next(error); // Or "return next(error);".
    return;
  }

  /* It is quite common to redirect to a new page in POST routes, rather than rendering a new page.
  Doing so avoids the "Send post data again pop-up" in the user's browser
  if they refresh the page containing the originally submitted HTML form. */
  res.redirect('/login');
}

function getLogin(req, res) {
  // Retrieve temporarily flashed data used for data retention between page refreshes, from the session.
  let sessionData = sessionFlash.getSessionData(req);

  /* If no session data could be retrieved (so, if the signup page/form hasn't been been submitted before),
  then first set some default session data. */
  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }

  res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;

  /* Another example of asynchronous code (i.e. JavaScript promises) error handling.
  See the comment in the signup() function above for details on why this is required. */
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage:
      'Invalid credentials. Please double check your email and password.',
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    // Flash data temporarily to a session for data retention between page refreshes.
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('login');
    });

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    // Flash data temporarily to a session for data retention between page refreshes.
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('login');
    });

    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });

  /* Side note: to set/flag a user an "admin" user, manually run the following command in mongosh against your "auth-demo" MongoDB database:
  "db.users.updateOne({ _id: ObjectId("[Object ID of user you want to make an admin]") }, { $set: { isAdmin: true } })"
  for example: "db.users.updateOne({ _id: ObjectId("64d368219d55790738aec226") }, { $set: { isAdmin: true } })" */
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
