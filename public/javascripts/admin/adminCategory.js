// clear span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

//add category
function addCategory() {
    let category = document.getElementById('category').value
    let subCategory = document.getElementById("subCategory").value
    let isError=false;

    if(subCategory===''){
       document.getElementById('subCategorySpan').textContent="*This field is required"
       return isError = true;
    }
    if (/^\s+$/.test(subCategory)) {
        document.getElementById('subCategorySpan').textContent = `*Invalid subCategory. SubCategory cannot consist of only spaces.`;
        return isError = true;
    }

    const categoryRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!categoryRegex.test(subCategory)) {
        document.getElementById('subCategorySpan').textContent = `*Invalid subCategory. Please enter a valid subCategory containing only letters and optional spaces.`;
        return isError = true;
    }
    if(!isError){
    
    let reqBody = { category, subCategory }
    console.log(reqBody)
    fetch("http://localhost:3000/admin/category", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                window.location.replace("/admin/category");
            } else {
                alert("Adding category failed");
            }
        })
        .catch(err => console.log(err));
    }
}