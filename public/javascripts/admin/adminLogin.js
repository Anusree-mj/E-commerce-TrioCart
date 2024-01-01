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
//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

function handleSubmit() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if (!email && !password) { 
        document.getElementById('emailSpan').textContent = '*Fill this field'
        document.getElementById('passwrdSpan').textContent = '*Fill this field'
    }
    else if (!password) {
        document.getElementById('passwrdSpan').textContent = '*Fill this field'
    } else if (!email) {
        document.getElementById('emailSpan').textContent = '*Fill this field'
    } else {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
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
                window.location.replace("/admin");          
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
}
