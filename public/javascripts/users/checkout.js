// add address
function addAddress() {
    const readonlyElements = Array.from(document.getElementsByClassName('readonly'));
    const addElements = Array.from(document.getElementsByClassName('addAddress'));

    readonlyElements.forEach(element => element.style.display = 'none');
    addElements.forEach(element => element.style.display = 'block');
    document.getElementById('add').style.display = 'none'
}

// selectedAddress
function selectedAddress(userId, name, phone,
    address, town, pincode, state) {
    let reqBody = { name, phone, address, town, pincode, state }
    fetch(`/orderAddress/${userId}`, {
        method: "PUT",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                const payment = document.querySelector('.payment');
                payment.style.display = 'block';
                const deliveryDiv = document.querySelector('.delivery');
                deliveryDiv.style.display = 'block';

                document.getElementById('delvryName').textContent = name;
                document.getElementById('delvryPhone').textContent = phone;
                document.getElementById('delvryAddress').textContent = address;
                document.getElementById('delvryPincodeTown').textContent = `${town}, ${pincode}`;
                document.getElementById('delvryState').textContent = state
            } else {
                console.log("failed to update order address");
            }
        })
        .catch(err => console.log(err));
}

// toggle checkout button
let paymentMethod;
function paymentSelected(method) {
    paymentMethod = method;
    let checkoutButtn = document.getElementById('checkoutBtn')
    checkoutButtn.classList.remove('checkoutBtn');
    checkoutButtn.classList.add('btn-dark');
    checkoutButtn.disabled = false;
    checkoutButtn.textContent = 'Continue Purchasing'
}

// make purchase
function purchase(userId, discount,totalPrice) {
    let reqBody;
    let total;

    if (discount === '0') {
        total = totalPrice
        reqBody = { userId, paymentMethod, total,totalPrice }
    } else {
        total = discount;
        reqBody = { userId, paymentMethod, total,totalPrice }
    }

    fetch("/checkout", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok" && data.order) {
                const user = data.user
                razorpayPayment(data.order, user)
            } else if (data.status === "ok" && !data.order) {
                window.location.replace("/order/success");
            } else {
                console.log("failed to make purchase");
            }
        })
        .catch(err => console.log(err));

}

const razorpayPayment = (order, user) => {
    const options = {
        "key": "rzp_test_mj8FaMjD2VYPW4", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "TrioCart",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {           
            verifyPayment(response, order)
        },
        "prefill": {
            "name": user.name,
            "email": user.email,
            "contact": user.phone
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();

}

const verifyPayment = (payment, order) => {
    let reqBody = { payment, order };
    fetch("/verifyPayment", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                window.location.replace("/order/success");
            } else {
                console.log("Payment failed");
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
function applyCoupon(couponId, totalprice, cartId) {
    console.log(couponId)
    document.getElementById('applyCouponConfirmationModal').querySelector('.btn-success').onclick = function () {
     
        let reqBody = { couponId,totalprice,cartId };
        fetch("/applyCoupon", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {                   
                    location.reload()
                } else {
                    console.log("failed to apply coupon");
                }
            })
            .catch(err => console.log(err));

        // Hiding the new modal after processing
        $('#applyCouponConfirmationModal').modal('hide');
    };

    // Show the new modal
    $('#applyCouponConfirmationModal').modal('show');
}

// This function is triggered when the "Apply Coupon" button in the new modal is clicked
function confirmApplyCoupon() {
    // This function can be empty as it's handled within the applyCoupon function
}