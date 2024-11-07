function createUserSession(req, user, action) {
  req.session.uid = user._id.toString();
  req.session.isAdmin = user.isAdmin;
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  req.session.uid = null;
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
