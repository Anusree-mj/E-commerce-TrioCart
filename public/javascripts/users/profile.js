// edit mydetails
function editMyDetails() {
    const readonlyElements = Array.from(document.getElementsByClassName('readonlyDetails'));
    const editableElements = Array.from(document.getElementsByClassName('editableDetails'));
    readonlyElements.forEach(element => element.style.display = 'none');
    editableElements.forEach(element => element.style.display = 'block');

}

// update details
function updateMyDetails(userId){
    let name=document.getElementById('name').value;
    let email=document.getElementById('email').value;
    let phone=document.getElementById('phone').value;
    let reqBody={name,email,phone}
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

function getPasswordChange(){
   document.getElementById('changePassword').style.display='none';

    const editableElements = Array.from(document.getElementsByClassName('editablePassword'));
        editableElements.forEach(element => element.style.display = 'block');
}

