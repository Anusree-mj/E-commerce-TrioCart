// edit stock
function editStock(productId){
    let stock=document.getElementById('stock').value;
    let reqBody = { stock }

    console.log(reqBody);
fetch(`http://localhost:3000/admin/products/${productId}/stock`, {
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
            alert("Editing stock failed");
        }
    })
    .catch(err => console.log(err));
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

// validation
function clearValidity(field) {
    document.getElementById(field).style.border = '1px solid black';
    document.getElementById(field).style.boxShadow = '';
}
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}
