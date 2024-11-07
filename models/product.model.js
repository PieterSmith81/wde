// Import (a.k.a. require) third-party Node.js packages.
const mongodb = require('mongodb');

// Import (a.k.a. require) our own, custom Node.js packages.
const db = require('../data/database');

// Class definition.
class Product {
  // Class constructor.
  constructor(productData) {
    // Create the initial class properties and assign values to them.
    this.title = productData.title;
    this.summary = productData.summary;
    // Adding a "+" to the beginning of a JavaScript string type value, converts it to a JavaScript number type.
    this.price = +productData.price;
    this.description = productData.description;
    // Note that "productData.image" contains the name of the image file.
    this.image = productData.image;
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  // Static class methods.
  static async findById(productId) {
    let prodId;

    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const product = await db
      .getDb()
      .collection('products')
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error(
        'Could not find a product with the provided product id.'
      );
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection('products').find().toArray();

    /* For reference, the map() utility method on a JavaScript array creates a new array
    populated with the results of calling a provided function on every element in the calling array.
    For a full list of array utility methods, see:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots */
    return products.map(function (productDocument) {
      /* Transform the product document from the database into a new instantiated JavaScript object
      that is based on the Product class (as defined above).
      And then return that instantiated "product" object to the map() utitily method on the "products" array.
      
      This effectively reads all the product documents from the database into a JavaScript array
      that is structured based on the Product class' property definitions.
      
      This transformation logic allows us to populate class properties like "imagePath" and "imageURL"
      whose values are not stored in the database, hence the need for this transformation login in the first place. */
      return new Product(productDocument);
    });
  }

  static async findMultiple(ids) {
    /* For reference, the map() utility method on a JavaScript array creates a new array
    populated with the results of calling a provided function on every element in the calling array.
    For a full list of array utility methods, see:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots */
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id);
    });

    /* Use the MongoDB "$in" query operator to return all products where the product ID is one of the IDs specified in a given array
    (the "productIds" array in this case). */
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    /* Then convert the array of product documents retrieved from the MongoDB database,
    into an array of product objects based on the "Product" class. */
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  // Class methods.
  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageURL = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) {
      // Update an existing product.
      const productId = new mongodb.ObjectId(this.id);

      /* If the product image was not updated as part of editing the product,
      then delete the image property from the productData object.
      Here we use the "delete" JavaScript keyword (which we haven't used before in this course)
      to delete a property (or method) from a JavaScript object. */
      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection('products').updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      // Save a new product.
      await db.getDb().collection('products').insertOne(productData);
    }
  }

  async replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);

    // Note that a JavaScript promise is returned by the deleteOne() MongoDB driver method below.
    return db.getDb().collection('products').deleteOne({ _id: productId });
  }
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = Product;
