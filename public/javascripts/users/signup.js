//password toggling
function togglePassword() {
    let password = document.getElementById("password");
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

// valid name
let isValidName = true;
function checkName() {
    let name = document.getElementById('name').value;
    if (/^\s+$/.test(name)) {
        document.getElementById("nameSpan").textContent = "*Invalid Name. Name cannot consist of only spaces.";
        return isValidName = false;
    }
    if (/\d/.test(name)) {
        document.getElementById("nameSpan").textContent = "*Invalid Name. Name cannot contain numbers.";
        return isValidName = false;
    }
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
        document.getElementById("nameSpan").textContent = "Invalid Name.";
        return isValidName = false;
    }
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
let isValidEmail = true;
function checkEmail() {
    let email = document.getElementById("email").value;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        isValidEmail = false;
        document.getElementById("emailSpan").textContent = "*Invalid email";
    }
}

//checks phoneNumber
let isValidPhoneNumber = true;
function checkPhone() {
    let phone = document.getElementById("phone").value;

    isValidPhoneNumber = true;
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        isValidPhoneNumber = false;
        document.getElementById("phoneSpan").textContent = "*Invalid phone number";
    }
}

//post signup user data and get otp
function signup() {
    let isError = false
    const fields = ["name", "email", "phone", "password", "confrmPsswrd"];

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

    if (!isError && (
        isStrongPassword, isValidEmail,
        isValidPhoneNumber,
        isValidName)) {
            referral: document.getElementById('referral').value ? document.getElementById('referral').value : null

        let reqBody = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            password: document.getElementById("password").value,
            referal: document.getElementById('referral').value ? document.getElementById('referral').value : null
        }
        console.log(referral)
        fetch("/user/signup", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/user/verify");
                } else {
                    document.getElementById('emailSpan').textContent = "Email already exist"
                    document.getElementById('emailSpan').style.fontSize = '1.5rem';
                }
            })
            .catch(err => console.log(err));
    }
}


//verifying otp and authenticating user
function verifyUser() {
    let otp = document.getElementById('otpVerify').value;

    fetch("/user/verify", {
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'OTP doesn\'t match!',
                });
            }
        })
        .catch(err => {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        });
}
