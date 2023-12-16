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
function ifValidField(field, displayField) {
    validNameAndTown = true;
    let data = document.getElementById(field).value;

    if (!/^[A-Za-z]/.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${displayField}. Please enter a valid ${displayField}.`;
        return validNameAndTown = false;
    }
}

let validAddress = true;
// check address
function checkAddress(field, displayField) {
    validAddress = true;
    console.log("Checking address validation");
    let data = document.getElementById(field).value;
    const addressRegex = /^[0-9A-Za-z.,]+(?: [0-9A-Za-z.,]+)*$/;

    // Check if the address is only spaces
    if (/^\s*$/.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${displayField}.`;
        return validAddress = false;
    }
    if (!addressRegex.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${displayField}.Unwanted spaces`;
        return validAddress = false;
    }
}

let validPhone = true;
// check phone number
function checkPhone(field, displayField) {
    validPhone = true;
    let phone = document.getElementById(field).value;

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${displayField}`;
        return validPhone = false;
    } else {
        return validPhone = true;
    }
}

let validPincode = true;
// check pincode
function checkPincode(field, displayField) {
    validPincode = true;
    let pincode = document.getElementById(field).value;
    let regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);
    if (!pincode || regex.test(pincode) == false) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${displayField}`
        return validPincode = false;
    }
}

// save billing address
function saveBillingAddress(userId, nameId, phoneId, addressId, townId, pincodeId, stateId) {
    console.log('userid', userId);

    let isError = false;

    const fields = [nameId, phoneId, addressId, townId, pincodeId, stateId];

    // Checking for any empty fields
    fields.forEach(field => {
        console.log('checking empty fields');
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(field).style.border = '1px solid red';
            document.getElementById(field).style.boxShadow = '0 0 5px red';
        }
    });
    console.log('before if ')
    // Fetching data
    if (!isError && validAddress && validNameAndTown && validPhone && validPincode) {
        console.log('entered in if');
        let reqBody = {
            userId,
            name: document.getElementById(nameId).value,
            phone: document.getElementById(phoneId).value,
            address: document.getElementById(addressId).value,
            town: document.getElementById(townId).value,
            pincode: document.getElementById(pincodeId).value,
            state: document.getElementById(stateId).value
        };

        console.log('Request Body:', reqBody);

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

// edit billing address
let editedAddressId = '';
function editBillingAdress(addressId, name, phone, address, town, pincode, state) {
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
                document.getElementById(name).value = billingAddress.name;
                document.getElementById(phone).value = billingAddress.phone;
                document.getElementById(address).value = billingAddress.address;
                document.getElementById(town).value = billingAddress.town;
                document.getElementById(pincode).value = billingAddress.pincode;
                document.getElementById(state).value = billingAddress.state;
                return editedAddressId;
            } else {
                console.log("failed to get billing address");
            }
        })
        .catch(err => console.log(err));
}

// update billing address
function updateBillingAddress(nameid, phoneid, addressid, townid, pincodeid, stateid) {
    let isError = false
    const fields = [nameid, phoneid, addressid, townid, pincodeid, stateid];
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
    if (!isError && validAddress && validNameAndTown && validPhone && validPincode) {
        let reqBody = {
            editedAddressId,
            name: document.getElementById(nameid).value,
            phone: document.getElementById(phoneid).value,
            address: document.getElementById(addressid).value,
            town: document.getElementById(townid).value,
            pincode: document.getElementById(pincodeid).value,
            state: document.getElementById(stateid).value
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
let addressId;
// remove billing address
function deleteBillingAdress(addressId) {
    addressId = addressId;
    window.currentAddressId = addressId;
    $('#confirmationModal').modal('show');
}
function confirmDeleteBillingAddress() {
    const addressId = window.currentAddressId;

    // Close the modal
    $('#confirmationModal').modal('hide');
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
