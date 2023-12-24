function editOrderStatus(status, orderId) {
    const confirmationText = `Confirm changing order status to "${status}"?`;

    Swal.fire({
        title: "Confirm Status Change",
        text: confirmationText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change status',
    }).then((result) => {
        if (result.isConfirmed) {
            let reqBody = { status, orderId };

            fetch('http://localhost:3000/admin/orders', {
                method: "PUT",
                body: JSON.stringify(reqBody),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire("Status Changed", `Order status updated to "${status}".`, "success").then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire("Error", "Updating order status failed.", "error");
                }
            })
            .catch(err => console.log(err));
        }
    });
}


function editReturnStatus(returnId, orderId, status, productId) {
    const statusText = getStatusText(status); // Function to get human-readable status text
    const confirmationText = `Confirm changing return status to "${statusText}"?`;

    Swal.fire({
        title: "Confirm Status Change",
        text: confirmationText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change status',
    }).then((result) => {
        if (result.isConfirmed) {
            let reqBody = { returnId, orderId, status, productId };

            fetch('http://localhost:3000/admin/return', {
                method: "PUT",
                body: JSON.stringify(reqBody),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire("Status Changed", `Return status updated to "${statusText}".`, "success").then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire("Error", "Updating return status failed.", "error");
                }
            })
            .catch(err => console.log(err));
        }
    });
}

// Function to get human-readable status text
function getStatusText(status) {
    switch (status) {
        case 'confirmed':
            return 'Confirmed';
        case 'rejected':
            return 'Rejected';
        default:
            return status;
    }
}

function refund(returnId,userId, amount,productId) {
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
                razorpayPayment(data.order,data.user,productId)
            } else {
                console.log("failed to make purchase");
            }
        })
        .catch(err => console.log(err));
}


const razorpayPayment = (order,user,productId) => {
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
            verifyPayment(response,order,productId)
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

const verifyPayment = (payment,order,productId)=>{
    let productSize=document.getElementById('size').value;
    let reqBody={payment,order,productId,productSize};
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