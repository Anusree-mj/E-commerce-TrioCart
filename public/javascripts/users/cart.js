//decremetn
function decrementCount(productId, size) {
    let reqBody = { size }
    fetch(`http://localhost:3000/${productId}/cancel`, {
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
    fetch(`http://localhost:3000/${productId}/add`, {
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
    console.log('countofprodcts', count)
    let reqBody = { userId, size, count }
    fetch(`http://localhost:3000/cart/${productId}`, {
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


function togglePurchaseDiv() {
    console.log('entered in toggle functions')
    const purchaseDiv = document.querySelector('.purchaseOptns');
    const couponDiv = document.querySelector('.coupon');

    purchaseDiv.style.display = 'none';
    couponDiv.style.display = 'block';
}

function cancelCoupon() {
    const purchaseDiv = document.querySelector('.purchaseOptns');
    const couponDiv = document.querySelector('.coupon');

    purchaseDiv.style.display = 'block';
    couponDiv.style.display = 'none';
}

// applying coupon
function applyCoupon(couponName, totalprice, cartId) {
    // Set up an event listener for the Apply Coupon button in the new modal
    document.getElementById('applyCouponConfirmationModal').querySelector('.btn-success').onclick = function () {
        // Proceed with applying the coupon after confirmation
        let reqBody = { couponName, totalprice, cartId };
        fetch("http://localhost:3000/applyCoupon", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    const discount = data.discountPrice;
                    const purchaseDiv = document.querySelector('.purchaseOptns');
                    const couponDiv = document.querySelector('.coupon');

                    purchaseDiv.style.display = 'block';
                    couponDiv.style.display = 'none';
                    document.getElementById('price').style.textDecoration = 'line-through';
                    document.getElementById('price').style.color = 'red';
                    document.getElementById('discount').textContent = `₹ ${discount} /-`
                    location.reload()
                } else {
                    console.log("failed to apply coupon");
                }
            })
            .catch(err => console.log(err));

        // Hide the new modal after processing
        $('#applyCouponConfirmationModal').modal('hide');
    };

    // Show the new modal
    $('#applyCouponConfirmationModal').modal('show');
}

// This function is triggered when the "Apply Coupon" button in the new modal is clicked
function confirmApplyCoupon() {
    // This function can be empty as it's handled within the applyCoupon function
}
