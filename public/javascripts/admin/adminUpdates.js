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

    let imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
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


function editProduct(product_id) {
    let formData = new FormData();

    formData.append('name', document.getElementById('name').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('detailed_description', document.getElementById('detailed_description').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('subCategory', document.getElementById('subCategory').value);
    formData.append('price', document.getElementById('price').value);

    let imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    // let detailedimageInput = document.getElementById('detailedimage');
    // for (let i = 0; i < detailedimageInput.files.length; i++) {
    //     formData.append('detailedImages', detailedimageInput.files[i]);
    // }

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

    fetch(`http://localhost:3000/admin/products/${product_id}`, {
        method: "PATCH",
        body: formData,
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

function editUser(user_id) {
    let isBlocked = Boolean
    isBlocked = document.getElementById('isBlocked')
    console.log(isBlocked)
    if (isBlocked !== true || isBlocked !== false) {
        alert("Enter either true or false")
    } else {
        fetch(`http://localhost:3000/admin/users/${user_id}`, {
            method: "PATCH",
            body: isBlocked,
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/users");
                } else {
                    alert("Editing user failed");
                }
            })
            .catch(err => console.log(err));
    }
}

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