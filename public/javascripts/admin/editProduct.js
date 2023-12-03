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



