const imagePickerElement = document.querySelector(
  '#image-upload-control input'
);
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  /* Construct a browser-side URL to the image that has been provided/picked by the user.
  And then set that local, user-side URL to the source of the image preview HTML element. */
  imagePreviewElement.src = URL.createObjectURL(pickedFile);

  imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);
