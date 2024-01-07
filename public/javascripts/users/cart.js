//decremetn
function decrementCount(productId, size) {
    let reqBody = { size }
    fetch(`/${productId}/cancel`, {
        method: "PUT",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                location.reload();
            } else {
                console.log('product removal failed')
            }
        })
        .catch(err => console.log(err));
}
function incrementCount(productId, size) {
    let reqBody = { size }
    fetch(`/${productId}/add`, {
        method: "PUT",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                location.reload();
            } else {
                console.log('product removal failed')
            }
        })
        .catch(err => console.log(err));
}

function removeProduct(productId, userId, size, count) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            performRemoval(productId, userId, size, count);
        }
    });
}

function performRemoval(productId, userId, size, count) {
    let reqBody = { userId, size, count };
    fetch(`/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 'ok') {
                location.reload();
            } else {
                Swal.fire('Error!', 'Product removal failed.', 'error');
            }
        })
        .catch((err) => console.log(err));
}