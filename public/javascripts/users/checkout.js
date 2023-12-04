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
                payment.style.display= 'block';
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
            if (data.status === "ok") {
                window.location.replace("/order/success");
            } else {
                console.log("failed to add billing address");
            }
        })
        .catch(err => console.log(err));

}