function addProduct() {
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

   
    fetch("http://localhost:3000/admin/products", {
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

function editProduct(product_id){
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