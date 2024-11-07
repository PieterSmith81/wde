// Import (a.k.a. require) third-party Node.js packages.
const mongodb = require('mongodb');

// Create a MongoDB client JavaScript class variable using the MongoDB Node.js package you imported above.
const MongoClient = mongodb.MongoClient;

// Create a database variable which will be exposed to your other Node.js JavaScript files that require database access.
let database;

async function connectToDatabase() {
  /* Call the connect() static method on the MongoDB client to connect to the locally hosted MongoDB database server.
  Note that there is no need to instantiate the class first using the new keyword, since the connect() static method does that for us.
  Also note that the connect() static method returns a JavaScript promise. */
  const client = await MongoClient.connect('mongodb://localhost:27017');

  /* Establish a connection to a specific MongoDB database (the "online-shop" database in this case).
  If this database does not exist yet, it will be created automatically the first time you insert data into it. */
  database = client.db('online-shop');
}

function getDb() {
  if (!database) {
    throw new Error(
      'You must connect to the database server first before accessing a database on that server.'
    );
  }

  return database;
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
