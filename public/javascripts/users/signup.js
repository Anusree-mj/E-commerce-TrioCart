function togglePassword() {
    let password = document.getElementById("password");
    console.log(password)
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

//checks password strength
let isStrongPassword = true
function isStrongPaswrd() {
    let password = document.getElementById("password").value;
    const minLength = 8;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    isStrongPassword = true
    const isLengthValid = password.length >= minLength;
    const hasUppercaseValid = hasUppercase.test(password);
    const hasLowercaseValid = hasLowercase.test(password);
    const hasNumberValid = hasNumber.test(password);
    const hasSpecialCharValid = hasSpecialChar.test(password);


    if (!isLengthValid) {
        isStrongPassword = false;
        document.getElementById("passwordSpan").textContent = "*Password must be at least 8 characters long";
    } else if (!hasUppercaseValid) {
        isStrongPassword = false;
        document.getElementById("passwordSpan").textContent = "*Password should contain at least one uppercase letter.";
    } else if (!hasLowercaseValid) {
        isStrongPassword = false;
        document.getElementById("passwordSpan").textContent = "*Password should contain at least one lowercase letter.";
    } else if (!hasNumberValid) {
        isStrongPassword = false;
        document.getElementById("passwordSpan").textContent = "*Password should contain at least one digit (number).";
    } else if (!hasSpecialCharValid) {
        isStrongPassword = false;
        document.getElementById("passwordSpan").textContent = "*Password should contain at least one special character.";
    }
}

//checks email
let isEmailValid = true;
function checkEmail() {
    let email = document.getElementById("email").value;

    isEmailValid = true;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        isEmailValid = false;
        document.getElementById("emailSpan").textContent = "*Invalid email";
    }
}

//checks phoneNumber
let isPhoneValid = true;
function checkPhone() {
    let phone = document.getElementById("phone").value;

    isPhoneValid = true;
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        isPhoneValid = false;
        document.getElementById("phoneSpan").textContent = "*Invalid phone number";
    }
}

//post signup user data and get otp
function signup() {
    let isError = false
    const fields = ["name", "email", "phone", "address", "password", "confrmPsswrd"];

    //checking for any empty fields
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(`${field}Span`).textContent = `*This field is required`;
        }
    });

    let password = document.getElementById("password").value;
    let confrmPassword = document.getElementById("confrmPsswrd").value;
    // checking if password match
    if (password !== confrmPassword) {
        document.getElementById("confrmPsswrdSpan").textContent = "Passwords doesn't match";
        isError = true
    }


    if (!isError && (isStrongPassword, isEmailValid, isPhoneValid)) {
        let reqBody = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            password:document.getElementById("password").value
         }
        fetch("http://localhost:3000/signup", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/userVerify");
                } else {
                    alert("Email already exist");
                }
            })
            .catch(err => console.log(err));
    }
}


//verifying otp and authenticating user
function verifyUser() {
    let otp = document.getElementById('otp').value;

    fetch("http://localhost:3000/userVerify", {
        method: "POST",
        body: JSON.stringify({ otp }),
        headers: {
            "Content-Type": "application/json"
        },

    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                window.location.replace("/");
            } else {
                alert("OTP doesnt match");

            }
        })
        .catch(err => console.log(err));
}