// Import (a.k.a. require) third-party Node.js packages.
const mongodb = require('mongodb');

// Import (a.k.a. require) our own, custom Node.js packages.
const db = require('../data/database');

// Class definition.
class Order {
  // Class constructor.
  constructor(cart, userData, status = 'pending', date, orderId) {
    // Create the initial class properties and assign values to them.
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = orderId;
  }

  // Static class methods.
  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    /* For reference, the map() utility method on a JavaScript array creates a new array
    populated with the results of calling a provided function on every element in the calling array.
    For a full list of array utility methods, see:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots */
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    // Note that below we are sorting descending by id (as per the ".sort({ _id: -1 }) code line").
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    // Note that below we are sorting descending by id (as per the ".sort({ _id: -1 }) code line").
    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  // Class methods.
  save() {
    if (this.id) {
      // Update an existing order document's status and then write it back to the database.
      const orderId = new mongodb.ObjectId(this.id);

      return db
        .getDb()
        .collection('orders')
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
      // Create a new order document and write it to the database.
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = Order;
