function blockUser(user,userName) {
    let userId = user.trim();
    const confirmation = window.confirm(`Are you sure you want to block the user "${userName}"?`);

    if (confirmation) {
    let reqBody = { userId }
    fetch('http://localhost:3000/admin/users', {
        method: "DELETE",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                location.reload();
            } else {
                alert("Editing user status failed");
            }
        })
        .catch(err => console.log(err));
}
}
// undo product delete
function unblockUser(user,userName) {
    let userId = user.trim();
    console.log('userid',userId)

    const confirmation = window.confirm(`Are you sure you want to unblock the user "${userName}"?`);

    if (confirmation) {
    let reqBody = { userId }
    fetch('http://localhost:3000/admin/users', {
        method: "PUT",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                location.reload();
            } else {
                alert("Editing user status failed");
            }
        })
        .catch(err => console.log(err));
}
}