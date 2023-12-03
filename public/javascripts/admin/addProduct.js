let imagePath = '';
let detailedImagePath = [];
let imageUploaded = false;

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
                            if (!imagePath) {
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

// validation

function clearValidity(field) {
    document.getElementById(field).style.border = '1px solid black';
    document.getElementById(field).style.boxShadow = '';
}
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

let validInput = true;
function isValidInput(field) {
    let data = document.getElementById(field).value;
    const pattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s.,!@#$%^&*()_+={}\[\]:;<>,.?~\\/-]+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return validInput = false;
    }
}

let validPrice = true;
function isValidPrice(field) {
    let data = document.getElementById(field).value;
    const pattern = /^\d+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return validPrice = false;
    }
}

//add product
function addProduct() {
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
    if (!imageUploaded) {
        document.getElementById('imageSpan').textContent = '*Please upload at least one image.';
    }
    if (!isError && isValidPrice && isValidInput && imageUploaded) {
        let reqBody =
        {
            name, detailed_description, category, subCategory, price,
            size, stock, imagePath, detailedImagePath
        }

        console.log(reqBody);

        fetch("http://localhost:3000/admin/product", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/products");
                } else {
                    alert("Adding product failed");
                }
            })
            .catch(err => console.log(err));
    }
}

