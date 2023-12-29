function editCashback(cashbackId) {
    const newCashback = document.getElementById('cbdiscountEdit').value;
    if (!newCashback) {
        document.getElementById(`cbdiscountEdit`).style.border = '1px solid red';
        document.getElementById('cbdiscountEdit').style.boxShadow = '0 0 3px red';
    } else {
        let reqBody = { newCashback };

        fetch(`/admin/cashback/${cashbackId}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/admin/cashback");
                }
            })
            .catch(err => console.log(err));
    }

}

function undoCashbackDelete(cashBackId, cashbackName) {
    const confirmationText = `Are you sure you want to undo delete of the cashback "${cashbackName}"?`;

    Swal.fire({
        title: "Confirm Deletion",
        text: confirmationText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, undo delete it',
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`/admin/cashBack/${cashBackId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "ok") {
                        Swal.fire("Undone", `Cashback "${cashBackId}" deletion has been undone.`, "success").then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire("Error", "Undoing delete Cashback failed.", "error");
                    }
                })
                .catch(err => console.log(err));
        }
    });
}

function deleteCashback(cashBackId, cashbackName) {
    const confirmationText = `Are you sure you want to delete  the cashback "${cashbackName}"?`;

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

            fetch(`/admin/cashBack/${cashBackId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "ok") {
                        Swal.fire("Deleted", `Cashback "${cashBackId}" deletion has been undone.`, "success").then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire("Error", "Deleting Cashback failed.", "error");
                    }
                })
                .catch(err => console.log(err));
        }
    });
}