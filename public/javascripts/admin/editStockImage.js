let isStockValid = true;
function isValidPrice(field) {
    isStockValid = true;
    let data = document.getElementById(field).value;
    const pattern = /^\d+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return isStockValid = false;
    }
}

// edit stock
function editStock(productId, size) {
    let stock = document.getElementById('stock').value;

    if (stock && isStockValid) {
        let reqBody = { stock, size };

        fetch(`/admin/stock/${productId}/`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Stock edited successfully.',
                    }).then(() => {
                        window.location.replace("/admin/stock");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Editing stock failed.',
                    });
                }
            })
            .catch(err => console.log(err));
    }
}

// edit stock
function editStock(productId, size) {
    let stock = document.getElementById('stock').value;
    if (stock && isStockValid) {
        let reqBody = { stock, size };

        fetch(`/admin/stock/${productId}/`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Stock edited successfully.',
                    }).then(() => {
                        window.location.replace("/admin/stock");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Editing stock failed.',
                    });
                }
            })
            .catch(err => console.log(err));
    }
}

// delete detailed image
function deleteImage(image, productId) {
    let reqBody = { image, productId }
    fetch('/admin/products/image', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
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
