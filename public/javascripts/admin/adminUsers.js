function blockUser(user, userName) {
    const userId = user.trim();
    const confirmationText = `Are you sure you want to block the user "${userName}"?`;

    Swal.fire({
        title: "Confirm Block",
        text: confirmationText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, block user',
    }).then((result) => {
        if (result.isConfirmed) {
            const reqBody = { userId };

            fetch('http://localhost:3000/admin/users', {
                method: "DELETE",
                body: JSON.stringify(reqBody),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire("User Blocked", `User "${userName}" has been blocked.`, "success").then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire("Error", "Blocking user failed.", "error");
                }
            })
            .catch(err => console.log(err));
        }
    });
}

// undo product delete
function unblockUser(user, userName) {
    const userId = user.trim();
    const confirmationText = `Are you sure you want to unblock the user "${userName}"?`;

    Swal.fire({
        title: "Confirm Unblock",
        text: confirmationText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, unblock user',
    }).then((result) => {
        if (result.isConfirmed) {
            const reqBody = { userId };

            fetch('http://localhost:3000/admin/users', {
                method: "PUT",
                body: JSON.stringify(reqBody),
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "ok") {
                        Swal.fire("User Unblocked", `User "${userName}" has been unblocked.`, "success").then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire("Error", "Unblocking user failed.", "error");
                    }
                })
                .catch(err => console.log(err));
        }
    });
}
