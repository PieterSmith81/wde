// Import (a.k.a. require) third-party Node.js packages.
const multer = require('multer');
const uuid = require('uuid').v4;

// Middleware variable declaration and value assignment.
const upload = multer({
  storage: multer.diskStorage({
    destination: 'product-data/images',
    filename: function (req, file, cb) {
      cb(null, uuid() + '-' + file.originalname);
    },
  }),
});

const configuredMulterMiddleware = upload.single('image');

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = configuredMulterMiddleware;
