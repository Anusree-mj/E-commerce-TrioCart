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
    fetch(`http://localhost:3000/orderAddress/${userId}`, {
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
function purchase(userId, total) {

    console.log('paymentMethod', paymentMethod)

    let reqBody = { userId, paymentMethod, total }

    fetch("http://localhost:3000/checkout", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok" && data.order) {
               const user = data.user
                razorpayPayment(data.order,user)
            } else if (data.status === "ok" && !data.order) {
                window.location.replace("/order/success");
            } else {
                console.log("failed to make purchase");
            }
        })
        .catch(err => console.log(err));

}

const razorpayPayment = (order,user) => {
    var options = {
        "key": "rzp_test_mj8FaMjD2VYPW4", // Enter the Key ID generated from the Dashboard
        "amount":order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "TrioCart",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature);
            verifyPayment(response,order)
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
    var rzp1 = new Razorpay(options);    
        rzp1.open();
        
}

const verifyPayment = (payment,order)=>{
    let reqBody={payment,order};
    fetch("http://localhost:3000/verifyPayment", {
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