//decremetn
function decrementCount(productId,size) {
    let reqBody={size}
    fetch(`http://localhost:3000/${productId}/cancel`, {
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
                console.log('product removal failed')
            }
        })
        .catch(err => console.log(err));
}
function incrementCount(productId,size) {
    let reqBody={size}
    fetch(`http://localhost:3000/${productId}/add`, {
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
                console.log('product removal failed')
            }
        })
        .catch(err => console.log(err));
}

function removeProduct(productId, userId, size,count) {
    console.log('countofprodcts',count)
    let reqBody = { userId, size,count }
    fetch(`http://localhost:3000/cart/${productId}`, {
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
                console.log('product removal failed')
            }
        })
        .catch(err => console.log(err));
}