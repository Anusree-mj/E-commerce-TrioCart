//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

function getAddReferrlSection() {
    document.getElementById('addReferralCode').style.display = 'none'
    const referralContainers = document.querySelectorAll('.referralContainer');
    if (referralContainers.length > 0) {
        referralContainers[0].style.display = 'block';
    }
}

function addReferralCode() {
    const referralCodeInput = document.getElementById('referralCode');
    console.log('entered in add referal code')
    const referralCode = referralCodeInput.value ? (referralCodeInput.value).trim() : "";
    if (referralCode === "") {
        document.getElementById('referralCodeSpan').textContent = 'Add a referral code'
    }
    else{  
        let reqBody={referralCode}      
        fetch(`http://localhost:3000/coupon`, {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
    
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/coupon");
                } else {
                    document.getElementById('referralCodeSpan').textContent = 'Invalid referral code'
    
                }
            })
            .catch(err => console.log(err));
    }
}