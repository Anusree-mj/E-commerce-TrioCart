// edit billing address
let editedAddressId = '';
function editBillingAdress(addressId) {
    console.log('edit triggered')
    console.log(addressId);
    fetch(`http://localhost:3000/billingAddress/${addressId}`, {
        method: "GET",
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                const readonlyElements = Array.from(document.getElementsByClassName('readonly'));
                const editableElements = Array.from(document.getElementsByClassName('editable'));
                const addAddressElements = Array.from(document.getElementsByClassName('addAddress'));


                addAddressElements.forEach(element => element.style.display = 'none');
                readonlyElements.forEach(element => element.style.display = 'none');
                editableElements.forEach(element => element.style.display = 'block');


                let billingAddress = data.address.billingAddress[0];
                console.log('billingaddress', billingAddress)
                editedAddressId = billingAddress._id
                document.getElementById("name_edit").value = billingAddress.name;
                document.getElementById("phone_edit").value = billingAddress.phone;
                document.getElementById("address_edit").value = billingAddress.address;
                document.getElementById("town_edit").value = billingAddress.town;
                document.getElementById("pincode_edit").value = billingAddress.pincode;
                document.getElementById("state_edit").value = billingAddress.state;
                return editedAddressId;
            } else {
                console.log("failed to get billing address");
            }
        })
        .catch(err => console.log(err));
}
// remove billing address
function deleteBillingAdress(addressId) {
    console.log(addressId);
    fetch(`http://localhost:3000/billingAddress/${addressId}`, {
        method: "DELETE",
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                location.reload();
            } else {
                console.log("failed to delete billing address");
            }
        })
        .catch(err => console.log(err));
}

// update billing address
function updateBillingAddress() {
    let isError = false
    const fields = ["name_edit", "phone_edit", "address_edit", "town_edit", "pincode_edit", "state_edit"];
    console.log('update triggered')
    //checking for any empty fields
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(`${field}_edit`).style.border = '1px solid red';
            document.getElementById(`${field}_edit`).style.boxShadow = '0 0 5px red';
        }
    });
    // fetching data
    if (!isError) {
        let reqBody = {
            editedAddressId,
            name: document.getElementById("name_edit").value,
            phone: document.getElementById("phone_edit").value,
            address: document.getElementById("address_edit").value,
            town: document.getElementById("town_edit").value,
            pincode: document.getElementById("pincode_edit").value,
            state: document.getElementById("state_edit").value
        }
        console.log('fetcf', reqBody)
        fetch(`http://localhost:3000/billingAddress`, {
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
                    console.log("failed to get billing address");
                }
            })
            .catch(err => console.log(err));
    }
}

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

// clear border
function clearValidity(field) {
    document.getElementById(field).style.border = '1px solid black';
    document.getElementById(field).style.boxShadow = '';
}

//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

let validNameAndTown = true;
// check for name and town
function ifValid(field) {
    let data = document.getElementById(field).value;
    
    if (/^\s+$/.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}. ${field} cannot consist of only spaces.`;
        return validNameAndTown = false;
    }
    if (/\d/.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}. ${field} cannot contain numbers.`;
        return validNameAndTown = false;
    }
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}. Please enter a valid ${displayName} containing only letters and optional spaces.`;
        return validNameAndTown = false;
    }
}

let validAddress = true;
// check address
function checkAddress() {
    console.log("Checking address validation");
    let data = document.getElementById('address').value;

    // Check if the address is only spaces
    if (/^\s*$/.test(data)) {
        document.getElementById('addressSpan').textContent = `*Invalid address. Address cannot consist of only spaces.`;
        return validAddress = false;
    }
    const addressRegex = /^[0-9A-Za-z.,]+(?: [0-9A-Za-z.,]+)*$/;
    if (!addressRegex.test(data)) {
        console.log("Address is valid");
        document.getElementById('addressSpan').textContent = `*Invalid address.Unwanted spaces`;
        return validAddress = false;
    }
}

let validPhone=true;
// check phone number
function checkPhone() {
    let phone = document.getElementById("phone").value;

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {        
        document.getElementById("phoneSpan").textContent = "*Invalid phone number";
        return validPhone = false;
    }
}

let validPincode=true;
// check pincode
function checkPincode() {
    let pincode = document.getElementById('pincode').value;
    let regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);
    if (!pincode || regex.test(pincode) == false) {
             document.getElementById('pincodeSpan').textContent = "*Invalid pincode"
             return validPincode=false;
    }
}

// save billing address
function saveBillingAddress(userId) {
    console.log('userid', userId)

    let isError = false;  // Declare isError within the function scope

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
    if (!isError && validAddress && validPhone && validPincode && validNameAndTown) {
        let reqBody = {
            userId,
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            town: document.getElementById("town").value,
            pincode: document.getElementById("pincode").value,
            state: document.getElementById("state").value
        }
        console.log('fsdfjsdfj',reqBody)
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

