function deleteProduct(product_id) {
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

// undo product delete
function undoProductDelete(product_id, deleteStatus) {
    console.log(deleteStatus, 'delete statys')
    console.log(product_id)
    console.log(typeof deleteStatus, 'typeeeee')

    if (deleteStatus === 'true') {
        fetch(`http://localhost:3000/admin/products/dlt/${product_id}/undo`, {
            method: "PATCH",
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    location.reload();
                    const undoImage = document.getElementById(`undo_${product_id}`);
                    undoImage.style.display = undoImage.style.display === 'none' ? 'inline' : 'none';
                } else {
                    alert("Deleting product failed");
                }
            })
            .catch(err => console.log(err));
    } else {
        return
    }
}

// undo subcategory delete
function undoSubcategoryDelete(deleteStatus, subCategory) {
    subCategory = subCategory.trim();
    let reqBody = { subCategory }
    
    if (deleteStatus === 'true') {
        fetch('http://localhost:3000/admin/subcategory/undo', {
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
                    alert("updating delete subcategory failed");
                }
            })
            .catch(err => console.log(err));
    } else {
        return
    }
}

//delete subcategory
function deleteCategory(subCategory) {
    console.log('passing subcategory', subCategory)
    let reqBody = { subCategory }
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