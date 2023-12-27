// validation

function clearValidity(field) {
    document.getElementById(field).style.border = '1px solid black';
    document.getElementById(field).style.boxShadow = '';
}
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

let validInput = true;
function isValidInput(field) {
    let data = document.getElementById(field).value;
    const pattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s.,!@#$%^&*()_+={}\[\]:;<>,.?~\\/-]+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return validInput = false;
    }
}

let validPrice = true;
function isValidPrice(field) {
    let data = document.getElementById(field).value;
    const pattern = /^\d+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return validPrice = false;
    }
}

function addCoupon() {
    const fields = ["name", "description", "amount", "discount", "validDate", "endDate"];
    let isError = false;
    //checking for any empty fields
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(`${field}`).style.border = '1px solid red';
            document.getElementById(`${field}`).style.boxShadow = '0 0 3px red';
        }
    });
    if (!isError && isValidPrice && isValidInput) {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const discount = document.getElementById('discount').value;
        const startDate = document.getElementById("validDate").value;
        const endDate = document.getElementById("endDate").value
        const reqBody = { name, description, amount, discount, startDate, endDate };


        fetch("http://localhost:3000/admin/addCoupon", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/coupons");
                }
            })
            .catch(err => console.log(err));
    }

}

function editCoupon(couponId) {

    const fields = ["nameEdit", "descriptionEdit", "amountEdit",
        "discountEdit", "validDateEdit", "endDateEdit"];
    let isError = false;
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(`${field}`).style.border = '1px solid red';
            document.getElementById(`${field}`).style.boxShadow = '0 0 3px red';
        }
    });
    if (!isError && isValidPrice && isValidInput) {
        const name = document.getElementById('nameEdit').value;
        const description = document.getElementById('descriptionEdit').value;
        const amount = document.getElementById('amountEdit').value;
        const discount = document.getElementById('discountEdit').value;
        const startDate = document.getElementById("validDateEdit").value;
        const endDate = document.getElementById("endDateEdit").value
        const reqBody = { name, description, amount, discount, startDate, endDate };


        fetch(`http://localhost:3000/admin/coupon/edit/${couponId}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/coupons");
                }
            })
            .catch(err => console.log(err));
    }

}

