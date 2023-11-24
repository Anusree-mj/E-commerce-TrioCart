function openImagePreview(imageSrc) {
    $('#previewedImg').attr('src', '/' + imageSrc);
    $('#imagePreviewModal').modal('show');
}
//clearing span
function clearSpan(spanId) {
    document.getElementById(spanId).textContent = "";
}

let choosedSize = '';

function selectedSize(selctdSize) {
    if (choosedSize !== '') {
        document.getElementById(`btn${choosedSize}`).classList.remove('btn-dark');
        document.getElementById(`btn${choosedSize}`).classList.add('btn-outline-dark');
    }
    choosedSize = selctdSize;
    console.log('selected size', choosedSize)
    document.getElementById(`btn${choosedSize}`).classList.remove('btn-outline-dark');
    document.getElementById(`btn${choosedSize}`).classList.add('btn-dark');

}

function addToCart(productId) {
    console.log('haiii')
    if (choosedSize==='' ) {
        document.getElementById('sizeSpan').textContent = 'Select a Size'
    } else {
        let reqBody = { choosedSize };
        fetch(`http://localhost:3000/cart/${productId}`, {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },

        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    document.getElementById('addCart').textContent="Product Added to Cart"
                    setTimeout(()=>{
                        document.getElementById('addCart').textContent=""
                    },3000)
                } else {
                    console.log('product adding to cart failed')
                }
            })
            .catch(err => console.log(err));
    }
}
