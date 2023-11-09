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

    fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },//used to specify the format of the data being sent in an HTTP request when you're making a 
        //  POST request with JSON data.//


    }).then((res) => res.json())
    .then((data) => {
        if (data.status === "ok") {
            window.location.replace("/home");
        } else {
            alert("Invalid Username or Password");

        }
    })
    .catch(err => console.log(err));
}

function signup(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let password = document.getElementById("password").value;
    console.log(name,email,phone,address,password)
    // let reqBody={username:userName,password:Password}
    let reqBody = { name,email,phone,address,password }

    fetch("http://localhost:3000/signup", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },//used to specify the format of the data being sent in an HTTP request when you're making a 
        //  POST request with JSON data.//

    }).then((res) => res.json())
    .then((data) => {
        if (data.status === "ok") {
            window.location.replace("/login");
        } else {
            alert("Signup failed...Please try again");

        }
    })
    .catch(err => console.log(err));
}