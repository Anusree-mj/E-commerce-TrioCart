function editUserStatus(userEmail, userStatus) {
    userEmail = userEmail.trim();
    console.log('email:', userEmail)
    console.log('userStatus:', userStatus)
    let userEdit = Boolean
    userEdit = (userStatus === 'false') ? true : false;
    console.log(userEdit)

    let reqBody = { userEmail, userEdit }
    fetch('http://localhost:3000/admin/users', {
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
                alert("Editing user status failed");
            }
        })
        .catch(err => console.log(err));
}