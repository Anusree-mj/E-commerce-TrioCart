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

//login
function login() {
    let email = document.getElementById("my-email").value;
    let password = document.getElementById("my-password").value;
    if (!email && !password) {
        document.getElementById('emailSpan').textContent = 'Fill this field'
        document.getElementById('passwrdSpan').textContent = 'Fill this field'
    }
    else if (!password) {
        document.getElementById('passwrdSpan').textContent = 'Fill this field'
    } else if (!email) {
        document.getElementById('emailSpan').textContent = 'Fill this field'
    } else {
        let reqBody = { email, password }
        fetch("/user/login", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },//used to specify the format of the data being sent in an HTTP request when you're making a 
            //  POST request with JSON data.//


        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/");
                } 
                else if(data.status==='blocked') {
                    alert("Your account has been blocked");
                }
                else{
                    document.getElementById('commonSpan').textContent = 'Invalid Email or Password'
                }
            })
            .catch(err => console.log(err));
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
    let email = document.getElementById('email').value
    if (!email) {
        document.getElementById('emailSpan').textContent = "Enter your email"
    } else {
        let reqBody = { email }
        fetch("/user/getOtp", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    document.getElementById('getOtp').disabled = true
                    document.getElementById('verifyOtp').disabled = false
                    startResendTimer();
                } else {
                    alert("Email doesnt match");

                }
            })
            .catch(err => console.log(err));
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
                document.getElementById('verifyOtp').disabled = true
                document.getElementById('chngePsswrd').disabled = false
                stopResendTimer();
            } else {
                alert("OTP doesnt match");
            }
        })
        .catch(err => console.log(err));
}

//change password
function changePassword() {
    let email = document.getElementById('email').value
    let password = document.getElementById('my-password').value
    if (password !== document.getElementById("confrmPsswrd").value) {
        document.getElementById("psswrdSpan").textContent = "Passwords doesn't match";
        password = undefined;
    }
    else {
        let reqbody = { email, password }
        fetch("/user/forgotPassword", {
            method: "PUT",
            body: JSON.stringify(reqbody),
            headers: {
                "Content-Type": "application/json"
            },

        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/user/login");
                } else {
                    alert("OTP doesnt match");
                }
            })
            .catch(err => console.log(err));
    }

}