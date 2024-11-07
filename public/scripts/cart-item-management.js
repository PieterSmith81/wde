/* We use a custom AJAX request (a.k.a. frontend JS request) here to update items (i.e., item quantities) in the cart.
See the related backend code in the "/items" PATCH route in the "/routes/cart.routes.js" file. */
const cartItemUpdateFormElements = document.querySelectorAll(
  '.cart-item-management'
);
const cartTotalPriceElement = document.getElementById('cart-total-price');
// Select both the mobile and desktop cart badge elements in the navigation bar.
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function UpdateCartItem(event) {
  /* event.preventDefault() tells the browser that the event being listened for (a form submit event in this case)
  does not get explicitly handled (it basically cancels the event),
  and that its default action for the event should not be taken as it normally would. */
  event.preventDefault();

  /* Extract the product id value from the "data-[identifier]" HTML attribute of the specific HTML form.
  For reference, the related "data-productid" HTML attribute value is defined on the quantity update HTML form in the
  "/views/customer/cart/includes/cart-item.ejs" EJS view file. */
  const form = event.target;
  const productId = form.dataset.productid;

  // Similarly, also extract the related "data-csrf" HTML attribute value from the above mentioned quantity update HTML form.
  const csrfToken = form.dataset.csrf;

  // And then get the quantity value (using DOM traversal) from the quantity input element on the quantity update HTML form itself.
  const quantity = form.firstElementChild.value;

  /* Use the browser-side built-in fetch() function to construct our custom PATCH HTTP request for the server.
  For reference, the browser built in JSON.stringify() method converts a JavaScript object into a JSON formatted string.
  
  We also have to manually set our custom PATCH HTTP request's content type to "application/json" to ensure that our
  backend server knows that we are sending a HTTP request with a JSON formatted body to it.

  Also see the related "app.use(express.json());" Express JSON parsing middleware code line in app.js that handles
  JSON formatted HTTP requests like this one on the server side. */
  let response;

  try {
    response = await fetch('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // If any technical errors occurred during the actual fetch(), it will be caught and handled here.
    alert(
      'Could not send a request to the web server. You might be offline or have lost your internet connectivity. Please try again later.'
    );
    return;
  }

  // Check if the fetch() request was successfully processed on the server-side.
  if (!response.ok) {
    alert(
      'Something went wrong while updating a product in the cart. The request to the server failed.'
    );
    return;
  }

  /* Decode/parse the JSON formatted response data received back from the server into JavaScript formatted data.
  Specifically, back into a JavaScript object as customly crafted and sent back from the server, as per the:
  "res.status(201).json({
    message: 'Item updated!',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });"
  code at the end of the updateCartItem() route controller function in the "/controllers/cart.controller.js" file.
  
  The JSON to JavaScript formatted data decoding/parsing itself is done by using the json() method on the previously fetched response.
  Note that the response.json() method returns a JavaScript promise, since this method can take a bit of time to complete. */
  const responseData = await response.json();

  // Update the DOM after a cart item has been updated (for example, after a cart item's quantity has been changed by the user).
  if (responseData.updatedCartData.updatedItemPrice === 0) {
    // Remove the cart item from the DOM if the user set its quantity to 0 or less (which subsequently sets its line item price to 0 as well).
    form.parentElement.parentElement.remove();

    /* Also remove the "Buy Products" button from the DOM if the user has removed all items from the cart.
    Note that the "Buy Products" button will only exist in the DOM if the user is authenticated. */
    if (responseData.updatedCartData.newTotalQuantity === 0) {
      const cartBuyProductsBtnElement = document.getElementById(
        'cart-buy-products-btn'
      );

      if (cartBuyProductsBtnElement) {
        cartBuyProductsBtnElement.remove();
      }
    }
  } else {
    /* Update the required DOM elements to reflect the quantity change as well as the resultant price changes.
    Also note the use of the querySelector method on a specific HTML element ("form.parentElement") and not on the top-level document element. */
    const cartItemTotalPriceElement =
      form.parentElement.querySelector('.cart-item-price');
    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  // Update the cart's mobile and desktop badges' text in the navigation bar to show how many items in total are in the cart.
  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent =
      responseData.updatedCartData.newTotalQuantity;
  }
}

// Add client-side submit event listeners for each cart item's quantity update HTML form.
for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', UpdateCartItem);
}
