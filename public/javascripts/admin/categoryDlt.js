
// undo subcategory delete
function undoSubcategoryDelete(deleteStatus, subCategory, category) {
    subCategory = subCategory.trim();
    let reqBody = { subCategory, category };

    if (deleteStatus === 'true') {
        const confirmationText = `Are you sure you want to undo the deletion of the subcategory "${subCategory}"?`;

        Swal.fire({
            title: "Confirm Undo",
            text: confirmationText,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, undo it',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://localhost:3000/admin/subcategory/undo', {
                    method: "PATCH",
                    body: JSON.stringify(reqBody),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status === "ok") {
                            Swal.fire("Undone", `Subcategory "${subCategory}" deletion has been undone.`, "success").then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire("Error", "Undoing delete subcategory failed.", "error");
                        }
                    })
                    .catch(err => console.log(err));
            }
        });
    }
}

//delete subcategory
function deleteCategory(subCategory, category) {
    const confirmationText = `Are you sure you want to delete the subcategory "${subCategory}"?`;

    Swal.fire({
        title: "Confirm Deletion",
        text: confirmationText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it',
    }).then((result) => {
        if (result.isConfirmed) {
            let reqBody = { subCategory, category };

            fetch('http://localhost:3000/admin/category', {
                method: "PATCH",
                body: JSON.stringify(reqBody),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire("Deleted", `subcategory "${subCategory}" has been deleted.`, "success").then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire("Error", "Deleting subcategory failed.", "error");
                }
            })
            .catch(err => console.log(err));
        }
    });
}
