// upload images
let croppedImageUrl; // Variable to store the cropped image URL
let isNewFileChosen = false; // Flag to track if a new file is chosen
let cropper; // Variable to store the Cropper instance

function handleImageChange() {
    var input = document.getElementById('inputImage');
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');

    var file = input.files[0];

    // Reset state if a new file is chosen
    if (isNewFileChosen) {
        isNewFileChosen = false;
        closeModal();

        // Destroy the Cropper instance if it exists
        destroyCropper();

        // Reset the modal image source
        modalImage.src = '#';

        // Hide the cropped image container
        document.getElementById('croppedImageContainer').style.display = 'none';
    }

    // Display the selected image in the modal
    var reader = new FileReader();
    reader.onload = function (e) {
        modalImage.src = e.target.result;

        // Show the modal
        modal.style.display = 'block';

        // Initialize Cropper.js
        cropper = new Cropper(modalImage, {
            aspectRatio: 19 / 28,
            viewMode: 1,
        });
    };

    if (file) {
        isNewFileChosen = true;
        reader.readAsDataURL(file);
    }
}

function destroyCropper() {
    // Destroy the Cropper instance if it exists
    if (cropper) {
        cropper.destroy();
    }
}

function cropImage() {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');

    // Get the cropped data
    var croppedCanvas = cropper.getCroppedCanvas();

    // Convert the cropped canvas to a data URL
    croppedImageUrl = croppedCanvas.toDataURL();

    // Display the cropped image
    document.getElementById('croppedImage').src = croppedImageUrl;
    document.getElementById('croppedImageContainer').style.display = 'block';

    // Hide the modal
    modal.style.display = 'none';

    // Reset the modal image source
    modalImage.src = '#';

    // Update the input field with the cropped image data
    document.getElementById('inputImage').value = croppedImageUrl;
}

function closeModal() {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');

    // Destroy the Cropper instance
    destroyCropper();

    // Clear the selected file
    document.getElementById('inputImage').value = '';

    // Hide the modal
    modal.style.display = 'none';

    // Reset the modal image source
    modalImage.src = '#';
}

function resetChosenImage() {
    // Reset the value of the file input
    document.getElementById('inputImage').value = '';

    // Reset the modal image source
    document.getElementById('modalImage').src = '#';

    // Hide the cropped image container
    document.getElementById('croppedImageContainer').style.display = 'none';

    // Destroy the Cropper instance
    destroyCropper();

    // Reset the isNewFileChosen flag
    isNewFileChosen = false;
}
