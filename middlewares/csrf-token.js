// Middleware function.
function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = addCsrfToken;
