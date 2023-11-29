
// delete detailed image
function deleteImage(image, productId) {
    let reqBody = { image, productId }
    console.log(reqBody)
    fetch('http://localhost:3000/admin/products/image', {
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
                location.reload()
            } else {
                console.error('Image deletion failed');
            }
        })
        .catch(error => {
            console.error('Error deleting image:', error);
        });
}

function openImagePreview(imagePath) {
    // Get the modal and modal image elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    // Set the image source in the modal
    modalImg.src = imagePath;

    // Display the modal
    modal.style.display = 'block';
}

function closeImagePreview() {
    // Get the modal
    const modal = document.getElementById('imageModal');

    // Hide the modal
    modal.style.display = 'none';
}

let image = "";
let detailedimages = document.getElementById('detailedImages');
function imageUpload() {
    let formData = new FormData();
    let imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }
    let detailedImageInput = document.getElementById('detailedimage');
    for (let i = 0; i < detailedImageInput.files.length; i++) {
        formData.append('detailedImages', detailedImageInput.files[i]);
    }
    fetch("http://localhost:3000/image", {
        method: "POST",
        body: formData,
    }).then((res) => res.json())
        .then((data) => {
            console.log('data:', data)
            if (data.status === "ok") {

                image = data.imagePathWithoutPublic;
                //   detailedimages=[...detailedimages,...data.detailedImagesPathsWithoutPublic]
                console.log(image, "88888888888888888888")

            } else {
                alert("Adding product failed");
            }
        })
        .catch(err => console.log(err));
}

// edit product
function editProduct(product_id) {

    const fields = ["name", "detailed_description", "category", "subCategory", "price"];
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
    if (!isError && isValidPrice && isValidInput) {
        let reqBody = { name, detailed_description, category, subCategory, price, size }

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
