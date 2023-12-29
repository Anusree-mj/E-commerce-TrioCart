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
    document.getElementById(`btn${choosedSize}`).classList.remove('btn-outline-dark');
    document.getElementById(`btn${choosedSize}`).classList.add('btn-dark');

}

function addToCart(productId) {
    if (choosedSize === '') {
        document.getElementById('addCart').style.color = 'brown';
        document.getElementById('addCart').style.fontWeight = '600';
        document.getElementById('addCart').style.fontSize = '0.9rem';
        document.getElementById('addCart').textContent = 'Select a Size'
    } else {
        let reqBody = { choosedSize };
        fetch(`/cart/${productId}`, {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            },

        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    const addToCartButton = document.getElementById('addToCart');
                    addToCartButton.innerHTML = '<img class="cart" src="/images/navbar/addCart.png" alt="img"> Added To Cart';
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                } else if (data.status === 'outofStock') {
                    document.getElementById('addCart').style.color = 'red'
                    document.getElementById('addCart').textContent = "Out of Stock"
                } else {
                    window.location.replace("/user/login")
                }
            })
            .catch(err => console.log(err));
    }
}
function toggleWishlist() {
    const wishlistImg = document.getElementById('whislistImg');
    if (wishlistImg.src.endsWith('/images/navbar/wishlist.png')) {
        wishlistImg.src = '/images/navbar/redheart.png';
    } else {
        wishlistImg.src = '/images/navbar/wishlist.png';
    }
}