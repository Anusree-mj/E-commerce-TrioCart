function cancelOrder(orderId){
    alert('Are you sure you want to cancel your order?');

    fetch(`http://localhost:3000/order/${orderId}/cancel`, {
        method: "PUT",
      
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
// let returningProductId;
function triggerReturn(productId){
    console.log('productId in triggering ',productId)

    // returningProductId=productId;
    document.querySelector('.returnDetails').style.display = 'block';
    
}
function returnProduct(productId){
    console.log('productId in submit',productId)
}
