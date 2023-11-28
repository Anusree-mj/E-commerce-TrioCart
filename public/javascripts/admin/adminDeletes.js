function deleteProduct(product_id, productName) {
    const confirmation = window.confirm(`Are you sure you want to delete the product "${productName}"?`);

    if (confirmation) {

        fetch(`http://localhost:3000/admin/products/dlt/${product_id}`, {
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
}

// undo product delete
function undoProductDelete(product_id, productName, deleteStatus) {
    console.log(deleteStatus, 'delete statys')
    console.log(product_id)
    console.log(typeof deleteStatus, 'typeeeee');
    const confirmation = window.confirm(`Are you sure you want to undo the deletion of the product "${productName}"?`);

    if (confirmation) {

        if (deleteStatus === 'true') {
            fetch(`http://localhost:3000/admin/products/dlt/${product_id}/`, {
                method: "PUT",
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
}

// undo subcategory delete
function undoSubcategoryDelete(deleteStatus, subCategory) {
    subCategory = subCategory.trim();
    let reqBody = { subCategory }

    if (deleteStatus === 'true') {
        const confirmation = window.confirm(`Are you sure you want to undo the deletion of the subcategory "${subCategory}"?`);

        if (confirmation) {
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
                        alert("Undoing delete subcategory failed");
                    }
                })
                .catch(err => console.log(err));
        }
    }
}

//delete subcategory
function deleteCategory(subCategory) {
    const confirmation = window.confirm(`Are you sure you want to delete the category "${subCategory}"?`);

    if (confirmation) {

        let reqBody = { subCategory };
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
}