//add product
function addProduct() {
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let detailed_description = document.getElementById('detailed_description').value;
    let category = document.getElementById('category').value;
    let subCategory = document.getElementById('subCategory').value;
    let price = document.getElementById('price').value;

    let formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('detailed_description', detailed_description);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('price', price);

    //     let imageInput = document.getElementById('image');
    //     const canvas = document.getElementById('image-canvas');
    //     const ctx = canvas.getContext('2d');
    //     let image;

    //     // Fixed aspect ratio (19:28)
    //     const aspectRatio = 19 / 28;

    //     const file = imageInput.files[0];

    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = function (e) {
    //             image = new Image();
    //             image.src = e.target.result;
    //             image.onload = function () {
    //                 cropImage();
    //             };
    //         };
    //         reader.readAsDataURL(file);
    //     }

    //      let detailedImageInput = document.getElementById('detailedimage');
    //     let imageInputs = document.querySelectorAll('.image-input');
    //  console.log(detailedImageInput,imageInputs,'haiiiii')
    //     for (let i = 0; i < detailedImageInput.files.length; i++) {
    //         formData.append('detailedImages', {
    //             image: detailedImageInput.files[i],
    //             color: imageInputs[i].querySelector('input[name="color"]').value,
    //         });
    //     }

    let imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }
    let detailedImageInput = document.getElementById('detailedimage');
    for (let i = 0; i < detailedImageInput.files.length; i++) {
        formData.append('detailedImages', detailedImageInput.files[i]);
    }
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

    formData.append('size', selectedSizes.join(','));

    console.log(formData);

    fetch("http://localhost:3000/admin/product", {
        method: "POST",
        body: formData,
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




//change main image
function changeImage() {
    document.getElementById('curentImage').style.display = 'none';
    document.getElementById('closebutton').style.display = 'none';
}

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


const uploadImage = () => {
    //upload image to backend
    fetch('')
    // update teh deatilerdimages array with the response url

}
// edit product
function editProduct(product_id) {

    let formData = {}

    formData = { ...formData, 'name': document.getElementById('name').value }
    formData = { ...formData, 'description': document.getElementById('description').value }
    formData = { ...formData, 'detailed_description': document.getElementById('detailed_description').value }
    formData = { ...formData, 'category': document.getElementById('category').value }
    formData = { ...formData, 'subCategory': document.getElementById('subCategory').value }
    formData = { ...formData, 'price': document.getElementById('price').value }
    formData = { ...formData, image }
    formData = { ...formData, detailedimages }

    // image
    // let imageInput = document.getElementById('image');
    // if (imageInput && imageInput.style.display !== 'none') {
    //     formData.append('image', imageInput.files[0]);
    // }
    // // // // detailed image
    // let detailedImageInput = document.getElementById('detailedImages');
    // for (let i = 0; i < detailedImageInput.files.length; i++) {
    //     formData.append('detailedImages', detailedImageInput.files[i]);
    // }
    // size
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
    formData = { ...formData, 'size': selectedSizes.join(',') }

    console.log(formData, "ppppppppppppppppp")
    fetch(`http://localhost:3000/admin/products/${product_id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
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

//add category
function addCategory() {
    let category = document.getElementById('category').value
    let subCategory = document.getElementById("subCategory").value
    let reqBody = { category, subCategory }
    console.log(reqBody)
    fetch("http://localhost:3000/admin/category", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                window.location.replace("/admin/category");
            } else {
                alert("Adding category failed");
            }
        })
        .catch(err => console.log(err));
}