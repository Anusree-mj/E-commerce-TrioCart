
// clear border
function clearValidity(field) {
    document.getElementById(field).style.border = '1px solid black';
    document.getElementById(field).style.boxShadow = '';
}


//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}


let isError = false;
// check for name and town
function ifValid(field) {
    let data = document.getElementById(field).value;
    if (/^\s+$/.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}. ${field} cannot consist of only spaces.`;
        return isError = true;
    }
    if (/\d/.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}. ${field} cannot contain numbers.`;
        return isError = true;
    }
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}. Please enter a valid ${field} containing only letters and optional spaces.`;
        return isError = true;
    }
}

// check address
function checkAddress() {
    let data = document.getElementById('address').value;

    // Check if the address is only spaces
    if (/^\s*$/.test(data)) {
        document.getElementById('addressSpan').textContent = `*Invalid address. Address cannot consist of only spaces.`;
        return isError = true;
    }
    const addressRegex = /^[0-9A-Za-z.,]+(?: [0-9A-Za-z.,]+)*$/;
    if (!addressRegex.test(data)) {
        document.getElementById('addressSpan').textContent = `*Invalid address.Unwanted spaces`;
        return isError = true;
    }    
    return isError = false;
}


// check phone number
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
    paymentMethod = method;
    let checkoutButtn = document.getElementById('checkoutBtn')
    checkoutButtn.classList.remove('checkoutBtn');
    checkoutButtn.classList.add('btn-dark');
    checkoutButtn.disabled = false;
    checkoutButtn.textContent = 'Continue Purchasing'
}

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
            if (data.status === "ok") {
                window.location.replace("/order/success");
            } else {
                console.log("failed to add billing address");
            }
        })
        .catch(err => console.log(err));

}

