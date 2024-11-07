// Middleware function.
function notFoundHandler(req, res) {
  res.render('shared/404');
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = notFoundHandler;
