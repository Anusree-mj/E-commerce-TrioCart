function editOrderStatus(status, orderId) {
    let reqBody = { status, orderId }

    fetch('http://localhost:3000/admin/orders', {
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
                console.log("Updating order failed");
            }
        })
        .catch(err => console.log(err));
}

function editReturnStatus(returnId, orderId, status, productId) {
    let reqBody = { returnId, orderId, status, productId }

    fetch('http://localhost:3000/admin/return', {
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
                console.log("Updating return status failed");
            }
        })
        .catch(err => console.log(err));
}

function refund(returnId,userId, amount) {
    let reqBody = { returnId,userId, amount };

    fetch('http://localhost:3000/admin/refund', {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok" && data.order) {              
                razorpayPayment(data.order,data.user)
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
    fetch("http://localhost:3000/admin/verifyPayment", {
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
                console.log("Payment failed");
            }
        })
        .catch(err => console.log(err));

}