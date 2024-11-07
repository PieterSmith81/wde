/* We use an AJAX request (a.k.a. frontend JS request) here to delete products.
See the related backend code in the "/products/:id" DELETE route in the "/routes/admin.routes.js" file. */
const deleteProductButtonElements = document.querySelectorAll(
  '.product-item button'
);

async function deleteProduct(event) {
  const buttonElement = event.target;
  /* Extract the product id value from the "data-[identifier]" HTML attribute of the clicked HTML button.
  For reference, the related "data-productid" HTML attribute value is defined on the "Delete" HTML button in the
  "/views/admin/products/includes/product-item.ejs" EJS view file. */
  const productId = buttonElement.dataset.productid;
  // Similarly, also extract the related "data-csrf" HTML attribute value from the above mentioned "Delete" HTML button.
  const csrfToken = buttonElement.dataset.csrf;

  /* Use the browser-side built-in fetch() function to construct our custom DELETE HTTP request for the server.
  Note that you can't use the "DELETE" method as a regular HTML form method (like you can with GET and POST).
  Instead, you need to construct your own custom HTTP request using JavaScript
  (so, using the browser's fetch() function like we do below)
  to be able to use the "DELETE" method on a HTTP request.
  
  We also need to include CSRF tokens in our custom (i.e. browser-side JavaScript generated) HTTP requests.
  Without a valid client-side CSRP token, our Express server will reject our custom JavaScript generated HTTP requests.
  Here we are adding the CSRF token as a query parameter to the destination URL for the HTTP request
  (since "DELETE" HTTP requests don't have a request body).
  
  For more details on how CSRF tokens passed as URL query parameters work, see the commented at the top of the
  "/views/admin/products/includes/product-form.ejs" file. */
  const response = await fetch(
    '/admin/products/' + productId + '?_csrf=' + csrfToken,
    {
      method: 'DELETE',
    }
  );

  // Check if the fetch() request was successfully processed on the server-side.
  if (!response.ok) {
    alert(
      'Something went wrong while deleting the product. The request to the server failed.'
    );
    return;
  }

  /* Update the DOM to remove the deleted product from it.
  This is done by removing the "<li>" list item HTML element for the product that was deleted from the DOM.
  
  For practice, we use DOM traversal below to find the list item HTML element for the deleted product,
  based on its ancestry to the "Delete" HTML button. */
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

// Add client-side click event listeners for each product's delete button.
for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}
