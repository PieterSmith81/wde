/* We use a custom AJAX request (a.k.a. frontend JS request) here to add products to the cart.
See the related backend code in the "/items" POST route in the "/routes/cart.routes.js" file. */
const addToCartButtonElement = document.querySelector(
  '#product-details button'
);
// Select both the mobile and desktop cart badge elements in the navigation bar.
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function addToCart() {
  /* Extract the product id value from the "data-[identifier]" HTML attribute of the clicked HTML button.
  For reference, the related "data-productid" HTML attribute value is defined on the "Add to Cart" HTML button in the
  "/views/customer/products/product-details.ejs" EJS view file. */
  const productId = addToCartButtonElement.dataset.productid;

  // Similarly, also extract the related "data-csrf" HTML attribute value from the above mentioned "Add to Cart" HTML button.
  const csrfToken = addToCartButtonElement.dataset.csrf;

  /* Use the browser-side built-in fetch() function to construct our custom POST HTTP request for the server.
  For reference, the browser built in JSON.stringify() method converts a JavaScript object into a JSON formatted string.
  
  We also have to manually set our custom POST HTTP request's content type to "application/json" to ensure that our
  backend server knows that we are sending a HTTP request with a JSON formatted body to it.
  
  Also see the related "app.use(express.json());" Express JSON parsing middleware code line in app.js that handles
  JSON formatted HTTP requests like this one on the server side. */
  let response;

  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
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
      'Something went wrong while adding the product to the cart. The request to the server failed.'
    );
    return;
  }

  /* Decode/parse the JSON formatted response data received back from the server into JavaScript formatted data.
  Specifically, back into a JavaScript object as customly crafted and sent back from the server, as per the:
  "res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity,
  });"
  code at the end of the addCartItem() route controller function in the "/controllers/cart.controller.js" file.
  
  The JSON to JavaScript formatted data decoding/parsing itself is done by using the json() method on the previously fetched response.
  Note that the response.json() method returns a JavaScript promise, since this method can take a bit of time to complete. */
  const responseData = await response.json();

  const newTotalQuantity = responseData.newTotalItems;

  // Update the cart's mobile and desktop badges' text in the navigation bar to show how many items in total are in the cart.
  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = newTotalQuantity;
  }
}

addToCartButtonElement.addEventListener('click', addToCart);
