// Import (a.k.a. require) our own, custom Node.js packages.
const Product = require('./product.model');

// Class definition.
class Cart {
  // Class constructor.
  /* Note the implementation of a default value (an empty array) for the "items" class constructor parameter
  if no value is passed for this parameter when the class is instantiated.
  Also note the default values (zero) for the other class constructor parameters. */
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    // Create the initial class properties and assign values to them.
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  // Class methods.
  addItem(product) {
    // Initialize some default values for the cart item you are about to add to the cart.
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    /* Step through all items already in the cart and check if the product you are about to add already exists in the cart.
    If it does, just increase the quantity and total price of that particular product in the cart.
    If it does not, then add the new product to the cart. */
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      if (item.product.id === product.id) {
        // Adding a "+" to the beginning of a JavaScript string type value, converts it to a JavaScript number type.
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;

        // Update the existing cart item in the class' "items" property's array with the updated cart item.
        this.items[i] = cartItem;

        // Also update the total number of items and total cart price properties for the entire cart.
        this.totalQuantity++;
        this.totalPrice += product.price;
        return;
      }
    }

    // If code execution reaches this stage, then add a new cart item to the class' "items" property's array instead.
    this.items.push(cartItem);

    // And also update the total number of items and total cart price properties for the entire cart.
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

 updateItem(productId, newQuantity) {
    // Step through each item in the cart and, if the correct item has been found, update its quantity or delete it.
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      if (item.product.id === productId && newQuantity > 0) {
        // Update the quantity for a specific item in the cart, if the user provided a new, positive quantity.
        // Copy, i.e., spread (...), the "item" object into a new "cartItem" variable and then update its quantity.
        const cartItem = { ...item };
        const quantityChange = newQuantity - item.quantity;
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;

        // Update the existing cart item in the class' "items" property's array with the updated cart item.
        this.items[i] = cartItem;

        // Also update the total number of items and total cart price properties for the entire cart.
        this.totalQuantity += quantityChange;
        this.totalPrice += quantityChange * item.product.price;

        // Finally, return a new JavaScript object containing the updated total price for the cart item.
        return { updatedItemPrice: cartItem.totalPrice };
      } else if (item.product.id === productId && newQuantity <= 0) {
        // Delete a specific item from the cart, if its quantity was set to 0 (or less) by the user.
        // Remove an existing cart item from the class' "items" property's array.
        this.items.splice(i, 1);

        // Also update the total number of items and total cart price properties for the entire cart.
        this.totalQuantity -= item.quantity;
        this.totalPrice -= item.totalPrice;

        // Finally, return a new JavaScript object containing the updated total price for the cart item.
        return { updatedItemPrice: 0 };
      }
    }
  }

  async updatePrices() {
    /* Check if any products have been deleted (via the admin area) since the products have been added to the cart.
    And also check if any products' prices have been changed (again, via the admin area) since the products have been added to the cart.
    Then update the products and/or product prices in the cart accordingly.

    This updatePrices() class method is invoked by our own, custom "/middlewares/update-cart-prices.js" Express middleware.
    
    For reference, the map() utility method on a JavaScript array creates a new array
    populated with the results of calling a provided function on every element in the calling array.
    For a full list of array utility methods, see:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots */
    const productIds = this.items.map(function (item) {
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deletableCartItemProductIds = [];

    for (const cartItem of this.items) {
      /* Again, see the following link for details on what the find() utility method on JavaScript arrays does:
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots */
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      });

      if (!product) {
        // The product was deleted. So, "schedule" the product for removal from the cart.
        deletableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      // The product was not deleted. So, set the product data and total price to the latest price from the database.
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      /* Again, see the following link for details on what the filter() and indexOf() utility methods on JavaScript arrays does:
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots */
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0;
      });
    }

    // Re-calculate the cart totals.
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }
}

// Export JavaScript objects, functions, classes, arrays, variables, etc. to expose them to other Node.js JavaScript files.
module.exports = Cart;
