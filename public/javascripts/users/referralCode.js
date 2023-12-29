//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

function getAddReferrlSection() {
    document.getElementById('addReferralCode').style.display = 'none';
    document.getElementById('walletToggle').style.display='none';
    const referralContainers = document.querySelectorAll('.referralContainer');
    if (referralContainers.length > 0) {
        referralContainers[0].style.display = 'block';
    }
}

function cancelReferring(){
    document.getElementById('addReferralCode').style.display = 'block';
    document.getElementById('walletToggle').style.display='block';
    const referralContainers = document.querySelectorAll('.referralContainer');
    if (referralContainers.length > 0) {
        referralContainers[0].style.display = 'none';
    }
}

function addReferralCode() {
    const referralCodeInput = document.getElementById('referralCode');
    const referralCode = referralCodeInput.value ? (referralCodeInput.value).trim() : "";
    if (referralCode === "") {
        document.getElementById('referralCodeSpan').textContent = 'Add a referral code'
    }
    else{  
        let reqBody={referralCode}      
        fetch(`/referral`, {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
    
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    window.location.replace("/profile");
                } else {
                    document.getElementById('referralCodeSpan').textContent = 'Invalid referral code'
    
                }
            })
            .catch(err => console.log(err));
    }
}