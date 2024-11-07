/* We use a custom AJAX request (a.k.a. frontend JS request) here to add products to the cart.
See the related backend code in the "/orders/:id" PATCH route in the "/routes/admin.routes.js" file. */
const updateOrderFormElements = document.querySelectorAll(
  '.order-actions form'
);

async function updateOrder(event) {
  /* event.preventDefault() tells the browser that the event being listened for (a form submit event in this case)
  does not get explicitly handled (it basically cancels the event),
  and that its default action for the event should not be taken as it normally would. */
  event.preventDefault();

  /* Extract the order details (status, order id, and CSRF token)
  from the submitted HTML form for the specific order that you are updating. */
  const form = event.target;
  const formData = new FormData(form);
  const newStatus = formData.get('status');
  const orderId = formData.get('orderid');
  const csrfToken = formData.get('_csrf');

  /* Use the browser-side built-in fetch() function to construct our custom PATCH HTTP request for the server.
  For reference, the browser built in JSON.stringify() method converts a JavaScript object into a JSON formatted string.
  
  We also have to manually set our custom PATCH HTTP request's content type to "application/json" to ensure that our
  backend server knows that we are sending a HTTP request with a JSON formatted body to it.
  
  Also see the related "app.use(express.json());" Express JSON parsing middleware code line in app.js that handles
  JSON formatted HTTP requests like this one on the server side. */
  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        newStatus: newStatus,
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
      'Something went wrong while updating the order status. The request to the server failed.'
    );
    return;
  }

  /* Decode/parse the JSON formatted response data received back from the server into JavaScript formatted data.
  Specifically, back into a JavaScript object as customly crafted and sent back from the server, as per the:
  "res.json({
    message: 'Order updated.',
    newStatus: newStatus,
  });"
  code at the end of the updateOrder() route controller function in the "/controllers/admin.controller.js" file.
  
  The JSON to JavaScript formatted data decoding/parsing itself is done by using the json() method on the previously fetched response.
  Note that the response.json() method returns a JavaScript promise, since this method can take a bit of time to complete. */
  const responseData = await response.json();

  // Update the order's status badge's text to reflect the newly updated status of the order.
  form.parentElement.parentElement.querySelector('.badge').textContent =
    responseData.newStatus.toUpperCase();
}

// Add client-side submit event listeners for each order's status update HTML form.
for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener('submit', updateOrder);
}
