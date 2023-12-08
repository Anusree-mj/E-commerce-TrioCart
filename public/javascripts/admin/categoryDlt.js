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

