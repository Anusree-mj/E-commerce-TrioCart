// clear span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

//add category
function addCategory() {
    let category = document.getElementById('category').value;
    let subCategory = document.getElementById("subCategory").value;
    let isError = false;

    if (subCategory === '') {
        document.getElementById('subCategorySpan').textContent = "*This field is required";
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
    
    if (!isError) {
        let reqBody = { category, subCategory };
        fetch("/admin/category", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Category added successfully.',
                }).then(() => {
                    window.location.replace("/admin/category");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Adding category failed.',
                });
            }
        })
        .catch(err => console.log(err));
    }
}

// get edit Category page
function editCategory(category, subcategory) {
    let newSubCategory = document.getElementById('subCategoryEdit').value;

    if (!newSubCategory) {
        document.getElementById('subCategoryEditSpan').textContent = '*This field is required';
    } else {
        let reqBody = { subcategory, category, newSubCategory };
        fetch(`/admin/category`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Category edited successfully.',
                }).then(() => {
                    window.location.replace("/admin/category/");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Editing category failed.',
                });
            }
        })
        .catch(err => console.log(err));
    }
}
