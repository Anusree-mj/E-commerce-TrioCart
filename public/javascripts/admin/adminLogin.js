function togglePassword() {
    let password = document.getElementById("my-password");
    if (password.type == "password") {
        document.getElementById("visibility").innerHTML = "Hide";
        password.type = "text";
    } else {
        password.type = "password";
        document.getElementById("visibility").innerHTML = "Show";
    }

}

function handleSubmit() {
    let email = document.getElementById("my-email").value;
    let password = document.getElementById("my-password").value;
    let reqBody = { email, password };

    fetch("/admin/adminLogin", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "ok") {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Logged in successfully.',
            }).then(() => {
                window.location.replace("/admin");
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Invalid Username or Password.',
            });
        }
    })
    .catch(err => console.log(err));
}
