function editOrderStatus(status,orderId){
let reqBody= {status,orderId}

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

function editReturnStatus(returnId,orderId){
    let reqBody= {returnId,orderId}

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