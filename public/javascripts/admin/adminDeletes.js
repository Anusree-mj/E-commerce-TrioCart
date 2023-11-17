function deleteProduct(product_id){
    fetch(`http://localhost:3000/admin/products/dlt/${product_id}`, {
        method: "PATCH",
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

function deleteCategory(subCategory){
    console.log('passing subcategory',subCategory)
    let reqBody={subCategory}
    fetch('http://localhost:3000/admin/category', {
        method: "PATCH",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
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