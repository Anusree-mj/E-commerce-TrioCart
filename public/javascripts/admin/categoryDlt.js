// undo subcategory delete
function undoSubcategoryDelete(deleteStatus,subCategory,category) {
    subCategory = subCategory.trim();
    let reqBody = {subCategory,category}

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
function deleteCategory(subCategory,category) {
    const confirmation = window.confirm(`Are you sure you want to delete the category "${subCategory}"?`);

    if (confirmation) {

        let reqBody = { subCategory,category };
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

// edit offer
function editOffer(subcategory,category){
    
}
