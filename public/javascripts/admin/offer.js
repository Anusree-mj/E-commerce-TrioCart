// validation
function clearValidity(field) {
    document.getElementById(field).style.border = '1px solid black';
    document.getElementById(field).style.boxShadow = '';
}
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}
let isOfferValid = true;
function isValidPrice(field) {
    isOfferValid = true;
    let data = document.getElementById(field).value;
    const pattern = /^\d+$/;
    if (!pattern.test(data)) {
        document.getElementById(`${field}Span`).textContent = `*Invalid ${field}`;
        return isOfferValid = false;
    }
}

// edit offer
function editCategoryOffer(category, subcategory) {

    let offer = document.getElementById('offer').value;
    if (offer && isOfferValid) {
        let reqBody = { offer }

        console.log(reqBody);
        fetch(`http://localhost:3000/admin/category/offer/${category}/${subcategory}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/category");
                } else {
                    alert("Editing stock failed");
                }
            })
            .catch(err => console.log(err));
    }
}

function editProductOffer(productId) {
    let offer = document.getElementById('productOffer').value;
    if (offer && isOfferValid) {
        let reqBody = { offer }

        console.log(reqBody,'sdfsad');
        fetch(`http://localhost:3000/admin/products/offer/${productId}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/products");
                } else {
                    alert("Editing stock failed");
                }
            })
            .catch(err => console.log(err));
    }
}