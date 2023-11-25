
// clear border
function clearValidity(field) {
    document.getElementById(field).style.border = '1px solid black';
    document.getElementById(field).style.boxShadow = '';
}

function togglePincodeSpan(spanId) {
    document.getElementById(spanId).textContent = "";
    document.getElementById('pincodeMute').textContent = " Please enter a pincode (400070)";
}
//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

//checks phoneNumber
let isError = false;
function checkPhone() {
    let phone = document.getElementById("phone").value;

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        isError = true;
        document.getElementById("phoneSpan").textContent = "*Invalid phone number";
    }
}

// check pincode
function checkPincode() {
    let pincode = document.getElementById('pincode').value;
    let regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);
    if (!pincode || regex.test(pincode) == false) {
        isError = true;
        document.getElementById('pincodeSpan').textContent = "*Invalid pincode"
        document.getElementById('pincodeMute').textContent = "";
    }
}

// save billing address
function saveBillingAddress(userId) {
    console.log('userid', userId)

    const fields = ["name", "phone", "address", "town", "pincode", "state"];

    //checking for any empty fields
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(`${field}`).style.border = '1px solid red';
            document.getElementById(`${field}`).style.boxShadow = '0 0 5px red';
        }
    });
    // fetching data
    if (!isError) {
        let reqBody = {
            userId,
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            town: document.getElementById("town").value,
            pincode: document.getElementById("pincode").value,
            state: document.getElementById("state").value
        }
        fetch("http://localhost:3000/checkout/user", {
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
                    console.log("failed to add billing address");
                }
            })
            .catch(err => console.log(err));
    }
}

// toggle checkout button
let paymentMethod;
function paymentSelected(method) {
     paymentMethod=method;
    let checkoutButtn = document.getElementById('checkoutBtn')
    checkoutButtn.classList.remove('checkoutBtn');
    checkoutButtn.classList.add('btn-dark');
    checkoutButtn.disabled = false;
    checkoutButtn.textContent = 'Continue Purchasing'
}

function purchase(userId,total) {

    console.log('paymentMethod', paymentMethod)

    let reqBody = { userId, paymentMethod,total }

    fetch("http://localhost:3000/checkout", {
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
                console.log("failed to add billing address");
            }
        })
        .catch(err => console.log(err));

}

