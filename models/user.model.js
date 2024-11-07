// Import (a.k.a. require) third-party Node.js packages.
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

// Import (a.k.a. require) our own, custom Node.js packages.
const db = require('../data/database');

// Class definition.
class User {
  // Class constructor.
  constructor(email, password, fullname, street, postal, city) {
    // Create the initial class properties and assign values to them.
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  // Static class methods.
  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    /* Note that below we use MongoDB projection to exclude the password field from the resultset
    that is returned by the MongoDB database driver (since the password data is not required/applicable here). */
    return db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  // Class methods.
  getUserWithSameEmail() {
    // Note that we are returning a promise below, since the MongoDb driver's findOne() method returns a promise.
    return db.getDb().collection('users').findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser) {
      return true;
    }

    return false;
  }

  async signup() {
    // Encrypt the user's password using the "bcryptjs" third-party Node.js package.
    const hashedPassword = await bcrypt.hash(this.password, 12);

    // Then insert the user document into the MongoDB "users" collection.
    await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  hasMatchingPassword(hashedPassword) {
    // Note that we are returning a promise below, since the bcrypt.compare() method returns a promise.
    return bcrypt.compare(this.password, hashedPassword);
  }
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = User;
