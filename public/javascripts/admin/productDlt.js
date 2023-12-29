function deleteProduct(product_id, productName) {
    Swal.fire({
        title: "Are you sure?",
        text: `Mark "${productName}" as deleted? This action is reversible.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false,
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/products/dlt/${product_id}`, {
                method: "DELETE",
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire("Deleted!", `The product "${productName}" has been deleted.`, "success").then(() => {
                        location.reload();
                    });
                }
            })
            .catch(err => console.log(err));
        } else {
            // Handle cancel or close
            Swal.fire("Cancelled", "Your product is safe!", "info");
        }
    });
}


// undo product delete
function undoProductDelete(product_id, productName, deleteStatus) {
    const confirmationText = deleteStatus === 'true' ?
        `Are you sure you want to undo the deletion of the product "${productName}"?` :
        "Product is not deleted. Nothing to undo.";

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
            if (deleteStatus === 'true') {
                fetch(`/admin/products/dlt/${product_id}/`, {
                    method: "PUT",
                }).then((res) => res.json())
                    .then((data) => {
                        if (data.status === "ok") {
                            Swal.fire("Undone", `"${productName}" has been undeleted.`, "success").then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire("Error", "Failed to update stock.", "error");
                        }
                    })
                    .catch(err => console.log(err));
            }
        }
    });
}
