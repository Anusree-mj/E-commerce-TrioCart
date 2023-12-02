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

let imageUploaded = true;
let imagePath = document.getElementById('curentImage').value;
console.log('imagepathexistingvalue', imagePath)
function changeMainImage(productId) {

    let reqBody = { productId };

    fetch('http://localhost:3000/admin/products/mainImage', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                console.log('Image deleted successfully');
                document.getElementById('curentImage').remove();
                document.getElementById('mainImageDlt').remove();
                document.getElementById('image').remove();

                imagePath = '';
                return imageUploaded = false;
            } else {
                console.error('Image deletion failed');
            }
        })
        .catch(error => {
            console.error('Error deleting image:', error);
        });

}


let detailedImagePath = [];

function uploadImage() {
    if (croppedImageUrl) {
        imageUploaded = false;

        // Convert the base64 data URL to a Blob
        fetch(croppedImageUrl)
            .then(res => res.blob())
            .then(blob => {
                // Create a FormData object and append the blob
                var formData = new FormData();
                formData.append('image', blob, 'cropped_image.png');

                // Fetch API request
                fetch('http://localhost:3000/image', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log('data:', data)
                        if (data.status === "ok") {
                            if (imagePath === '') {
                                imagePath = data.imagePathWithoutPublic;
                            } else {
                                detailedImagePath.push(data.imagePathWithoutPublic);
                            }

                            document.getElementById('croppedImageContainer').style.display = 'none';
                            // added image preview
                            var previewContainer = document.getElementById('addedImagesPreview');
                            var previewImage = document.createElement('img');
                            previewImage.src = '/' + data.imagePathWithoutPublic;
                            previewImage.style.width = '2rem';
                            previewImage.style.marginRight = '1.5rem';

                            previewContainer.appendChild(previewImage);

                            imageUploaded = true;
                            console.log('image:', imagePath, "detailedImages:", detailedImagePath)
                            return imagePath, detailedImagePath;
                        } else {
                            alert("Uploading Image Failed");
                        }
                    })
                    .catch(error => {
                        // Handle any errors during the fetch
                        console.error('Error:', error);
                    });
            });
    }
}

let inputValidity = true;
function isValidInput(field) {
    let data = document.getElementById(field).value;
    const pattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s.,!@#$%^&*()_+={}\[\]:;<>,.?~\\/-]+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return inputValidity = false;
    }
}

let priceValidity = true;
function isValidPrice(field) {
    let data = document.getElementById(field).value;
    const pattern = /^\d+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return priceValidity = false;
    }
}

// edit product
function editProduct(product_id) {

    const fields = ["name", "detailed_description", "category", "subCategory", "price", "stock"];
    let isError = false;
    //checking for any empty fields
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(`${field}`).style.border = '1px solid red';
            document.getElementById(`${field}`).style.boxShadow = '0 0 3px red';
        }
    });

    // check empty size
    let checkboxes = document.querySelectorAll('input[name="size"]:checked');
    if (checkboxes.length === 0) {
        isError = true;
        document.getElementById('sizeSpan').textContent = '*Please select at least one size.';
    }
    // getting values
    let name = document.getElementById('name').value;
    let detailed_description = document.getElementById('detailed_description').value;
    let category = document.getElementById('category').value;
    let subCategory = document.getElementById('subCategory').value;
    let price = document.getElementById('price').value;
    let stock = document.getElementById('stock').value;

    let sizeMap = {
        'option1': 'S',
        'option2': 'M',
        'option3': 'L',
        'option4': 'XL',
        'option5': 'XXL',
    };

    let selectedSizes = [];
    let checkedSizes = document.querySelectorAll('input[name="size"]:checked');
    checkedSizes.forEach((checkedSize) => {
        let sizeValue = sizeMap[checkedSize.value];
        if (sizeValue) {
            selectedSizes.push(sizeValue);
        }
    });
    let size = selectedSizes.join(',')

    let detailedImageElements = document.querySelectorAll('.preview-image');

    let detailedImages = Array.from(detailedImageElements).map(element => {
        return element.src.replace(window.location.origin + '/', '');
    });
    console.log(detailedImages);

    let detailedImagePaths = [...detailedImagePath, ...detailedImages];


    if (!imageUploaded) {
        document.getElementById('imageSpan').textContent = '*Please upload a main image.';
    }
    if (!isError && isValidPrice && isValidInput && imageUploaded) {
        let reqBody =
        {
            name, detailed_description, category,
            subCategory, price, size, stock, imagePath, detailedImagePaths
        }

        console.log(reqBody);
        fetch(`http://localhost:3000/admin/products/${product_id}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/products");
                } else {
                    alert("Editing product failed");
                }
            })
            .catch(err => console.log(err));
    }
}



