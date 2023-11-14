function togglePassword() {
    let password = document.getElementById("my-password");
    console.log(password)
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
    // let reqBody={username:userName,password:Password}
    let reqBody = { email, password }

    fetch("http://localhost:3000/admin/adminLogin", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },//used to specify the format of the data being sent in an HTTP request when you're making a 
        //  POST request with JSON data.//


    }).then((res) => res.json())
    .then((data) => {
        if (data.status === "ok") {
            window.location.replace("/admin");
        } else {
            alert("Invalid Username or Password");

        }
    })
    .catch(err => console.log(err));
}