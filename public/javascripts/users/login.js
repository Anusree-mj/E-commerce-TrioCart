//password toggle
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
const passwordInput = document.getElementById("my-password");
const visibilityButton = document.getElementById("visibility");

passwordInput.addEventListener("focus", () => {
    visibilityButton.style.display = "block";
});

passwordInput.addEventListener("blur", () => {
    visibilityButton.style.display = "block";
});


//login
function login() {
    let email = document.getElementById("my-email").value;
    let password = document.getElementById("my-password").value;
    if (!email && !password) {
        document.getElementById('emailSpan').textContent = '*Fill this field'
        document.getElementById('passwrdSpan').textContent = '*Fill this field'
    }
    else if (!password) {
        document.getElementById('passwrdSpan').textContent = '*Fill this field'
    } else if (!email) {
        document.getElementById('emailSpan').textContent = '*Fill this field'
    } else { 
        let reqBody = { email, password }
        fetch("/user/login", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },//used to specify the format of the data being sent in an HTTP request when you're making a 
            //  POST request with JSON data.//

        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/");
                } else if (data.status === 'blocked') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Account Blocked',
                        text: 'Your account has been blocked.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Credentials',
                        text: 'Invalid Email or Password.',
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
}


//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

let resendTimer;
let countdown = 60;

function startResendTimer() {
    document.getElementById('resndTimer').style.display = 'block';


    resendTimer = setInterval(() => {
        countdown--;
        document.getElementById('timer').textContent = countdown;

        if (countdown <= 0) {
            clearInterval(resendTimer);
            document.getElementById('resndTimer').style.display = 'none';
            document.getElementById('resentTxt').style.display = 'block';

        }
    }, 1000);
}

function stopResendTimer() {
    clearInterval(resendTimer);
    document.getElementById('resndTimer').style.display = 'none';
    document.getElementById('resentTxt').style.display = 'block';
    document.getElementById('otp').disabled = false;
}

//get otp
function getOtp() {
    let email = document.getElementById('email').value;
    if (!email) {
        document.getElementById('emailSpan').textContent = "Enter your email";
    } else {
        let reqBody = { email };
        fetch("/user/getOtp", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    // Disable button and enable OTP input
                    document.getElementById('getOtp').disabled = true;
                    document.getElementById('otp').disabled = false;
                    document.getElementById('verifyOtp').disabled = false;

                    // Start the timer
                    startResendTimer();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email doesn\'t match!',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                // Handle other errors
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            });
    }
}


//verify otp for changing password
function verifyOtp() {
    let otp = document.getElementById('otp').value;
    let email = document.getElementById('email').value
    let reqbody = { email, otp }
    fetch("/user/verifyOtp", {
        method: "POST",
        body: JSON.stringify(reqbody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                document.getElementById('verifyOtp').disabled = true;
                document.getElementById('my-password').disabled = false;
                document.getElementById('confrmPsswrd').disabled = false;
                document.getElementById('chngePsswrd').disabled = false;
                stopResendTimer();
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
            // Handle other errors
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        });
}

//change password
function changePassword() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('my-password').value;

    if (password !== document.getElementById("confrmPsswrd").value) {
        document.getElementById("psswrdSpan").textContent = "Passwords don't match";
        password = undefined;
    } else {
        let reqbody = { email, password };
        fetch("/user/forgotPassword", {
            method: "PUT",
            body: JSON.stringify(reqbody),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Password Changed',
                        text: 'Your password has been successfully changed.',
                    }).then(() => {
                        window.location.replace("/user/login");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'OTP doesn\'t match!',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                // Handle other errors
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            });
    }
}
