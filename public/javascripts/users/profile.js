// edit mydetails
function editMyDetails() {
    const readonlyElements = Array.from(document.getElementsByClassName('readonlyDetails'));
    const editableElements = Array.from(document.getElementsByClassName('editableDetails'));
    readonlyElements.forEach(element => element.style.display = 'none');
    editableElements.forEach(element => element.style.display = 'block');

}

//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

//checks email
let isValidEmail = true;
function checkEmail() {
    let email = document.getElementById("email_profile").value;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        isValidEmail = false;
        document.getElementById("email_profileSpan").textContent = "*Invalid email";
    }
}

//checks phoneNumber
let isValidPhoneNumber = true;
function checkValidPhone() {
    let phone = document.getElementById("phone__profile").value;

    isValidPhoneNumber = true;
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        isValidPhoneNumber = false;
        document.getElementById("phone_profileSpan").textContent = "*Invalid phone number";
    }
}

// valid name
let isValidName = true;
function checkName() {
    let name = document.getElementById('name_profile').value;
    if (/^\s+$/.test(name)) {
        document.getElementById("name_profileSpan").textContent = "*Invalid Name. Name cannot consist of only spaces.";
        return isValidName = false;
    }
    if (/\d/.test(name)) {
        document.getElementById("name_profileSpan").textContent = "*Invalid Name. Name cannot contain numbers.";
        return isValidName = false;
    }
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
        document.getElementById("name_profileSpan").textContent = "Invalid Name. Please enter a valid name containing only letters and optional spaces.";
        return isValidName = false;
    }
}

let tempUserId;
// update details
function verifyUser(userId) {
    let isError = false
    const fields = ['name_profile', 'email_profile', 'phone__profile'];

    // checking for any empty fields
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            isError = true;
            document.getElementById(field).style.border = '1px solid red';
            document.getElementById(field).style.boxShadow = '0 0 5px red';
        }
    });

    let name = document.getElementById('name_profile').value;
    let email = document.getElementById('email_profile').value;
    let phone = document.getElementById('phone__profile').value;
    let reqBody = { name, email, phone }
    if (!isError && (
        isValidEmail,
        isValidPhoneNumber,
        isValidName)) {
        fetch(`/profile/${userId}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {  
                    tempUserId= data.tempUserId
                    document.querySelector('.editableDetails').style.display = 'none';
                    document.querySelector('.verify').style.display = 'block';
                    startTimer();
                } else {
                    console.log('update failed')
                }
            })
            .catch(err => console.log(err));
    }
}
let timer;
let countdown = 60; 
function startTimer() {
    timer = setInterval(() => {
        document.getElementById('timer').textContent = countdown;
        countdown--;

        if (countdown < 0) {
            clearInterval(timer);
            document.getElementById('resndTimer').style.display = 'none';
            document.getElementById('resentTxt').style.display = 'block';
        }
    }, 1000);
}


function resendOtp(){
    const reqBody={tempUserId}
    fetch('/resendOTP', {
        method: "PUT",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                document.getElementById('resndTimer').style.display = 'block';
                document.getElementById('resentTxt').style.display = 'none';
                countdown = 60;
                document.getElementById('timer').textContent = countdown;
            
                startTimer();
            } else {
                console.log('update failed')
            }
        })
        .catch(err => console.log(err));
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

// add address
function addAddress() {
    const readonlyElements = Array.from(document.getElementsByClassName('readonly'));
    const addElements = Array.from(document.getElementsByClassName('addAddress'));

    readonlyElements.forEach(element => element.style.display = 'none');
    addElements.forEach(element => element.style.display = 'block');
    document.getElementById('add').style.display = 'none'
}


//password toggling
function togglePassword(field) {
    let password = document.getElementById(field);
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
function cancelPasswordChange(){
    document.getElementById('changePassword').style.display = 'block';
    const editableElements = Array.from(document.getElementsByClassName('editablePassword'));
    editableElements.forEach(element => element.style.display = 'none');
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
        fetch("/password", {
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
                    document.getElementById("currntPasswordSpan").textContent = "*Invalid password. Please enter you current password."
                }
            })
            .catch(err => console.log(err));
    }
}

function updateProfile(userId) {

    let otp = document.getElementById('otp').value;  

    fetch(`/profile/${userId}/update`, {
        method: "PUT",
        body: JSON.stringify({ otp }),
        headers: {
            "Content-Type": "application/json"
        },

    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                window.location.replace("/profile");
            } else {
                alert("Invalid OTP");

            }
        })
        .catch(err => console.log(err));
}

// toggle wallet
function toggleWalletHistory(){
    const displayWallet = document.querySelector('.displayWallet');
    const walletToggle = document.getElementById('walletToggle');

    if (displayWallet.style.display === 'none') {
        displayWallet.style.display = 'block';
        walletToggle.textContent = 'Hide wallet history';
    } else {
        displayWallet.style.display = 'none';
        walletToggle.textContent = 'Show wallet history';
    }
}