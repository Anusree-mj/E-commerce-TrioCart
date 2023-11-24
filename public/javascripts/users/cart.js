
function removeProduct(productId,userId,size){
    let reqBody={userId,size}
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