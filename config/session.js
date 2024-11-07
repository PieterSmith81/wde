// Import (a.k.a. require) third-party Node.js packages.
const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDbStore = mongoDbStore(expressSession);

  const store = new MongoDbStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'online-shop',
    collection: 'sessions',
  });

  return store;
}

function createSessionConfig() {
  /* Note that the secret property's value needs to have a more complex value for production websites.
  We are only using a simple value here for demo purposes.
  On a production website, the secret value should not be easily readable/guessable by a human. 
  So the secret value should ideally be a long, random set of auto-generated characters. */
  return {
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // Two days in milliseconds.
    },
  };
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = createSessionConfig;
