// edit mydetails
function editMyDetails() {
    const readonlyElements = Array.from(document.getElementsByClassName('readonlyDetails'));
    const editableElements = Array.from(document.getElementsByClassName('editableDetails'));
    readonlyElements.forEach(element => element.style.display = 'none');
    editableElements.forEach(element => element.style.display = 'block');

}

// validation of my details
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
        document.getElementById("nameSpan").textContent = "Invalid Name. Please enter a valid name containing only letters and optional spaces.";
        return isValidName = false;
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

// update details
function updateMyDetails(userId) {

    let isError = false
    const fields = ["name", "email", "phone"];

    //checking for any empty fields
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(`${field}Span`).textContent = `*This field is required`;
        }
    });

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let reqBody = { name, email, phone }
    if (!isError && (
        isValidEmail,
        isValidPhoneNumber,
        isValidName)) {
        fetch(`http://localhost:3000/profile/${userId}`, {
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
                    console.log('update failed')
                }
            })
            .catch(err => console.log(err));
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

//password toggling
function togglePassword(field) {
    let password = document.getElementById(field);
    console.log(password)
    if (password.type == "password") {
        document.getElementById(`${field}Toggle`).innerHTML = "Hide";
        password.type = "text";
    } else {
        password.type = "password";
        document.getElementById(`${field}Toggle`).innerHTML = "Show";
    }

}

function getPasswordChange() {
    document.getElementById('changePassword').style.display = 'none';
    const editableElements = Array.from(document.getElementsByClassName('editablePassword'));
    editableElements.forEach(element => element.style.display = 'block');
}

// change password
function changePassword(userId) {
    let isError = false;
    const fields = ["currntPassword", "password", "confrmPsswrd"];

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
    if (!isError) {
        let reqBody = {
            userId: userId.trim(),
            currentPassword: document.getElementById("currntPassword").value,
            password: document.getElementById("password").value,
        }
        fetch("http://localhost:3000/password", {
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
                    document.getElementById("currntPasswordSpan").textContent="*Invalid password. Please enter you current password."
                }
            })
            .catch(err => console.log(err));
    }
}
