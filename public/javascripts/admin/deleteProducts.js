function deleteProduct(product_id){
    fetch(`http://localhost:3000/admin/products/${product_id}`, {
        method: "DELETE",
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                location.reload();
            } else {
                alert("Deleting product failed");
            }
        })
        .catch(err => console.log(err));
}

