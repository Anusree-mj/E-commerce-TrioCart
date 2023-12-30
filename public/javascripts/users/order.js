function cancelOrder(orderId) {
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Are you sure you want to cancel your order?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/order/${orderId}/cancel`, {
                method: "PUT",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "ok") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Order Canceled!',
                            text: 'Your order has been canceled successfully.',
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Order cancel failed.',
                        });
                    }
                })
                .catch(err => console.log(err));
        }
    });
}

// let returningProductId;
function triggerReturn(productId) {
    const returnDetails = document.querySelector(`#returnDetails_${productId}`);
    if (returnDetails) {
        returnDetails.style.display = returnDetails.style.display === 'block' ? 'none' : 'block';
    }
}

// return product
function returnProduct(productId, price, size, count, orderId) {
    const selectedRadio = document.querySelector('input[name="selectedReason"]:checked');

    if (!selectedRadio) {
        document.getElementById('returnSpan').textContent = '*Feedback is required!';
    }
    else {
        const reason = selectedRadio.value;
        let reqBody = { reason, price, size, count, orderId }

        fetch(`/order/${productId}/return`, {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    location.reload();
                } else {
                    console.log('product return failed')
                }
            })
            .catch(err => console.log(err));
    }
}  
