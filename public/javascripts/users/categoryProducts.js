function addFilter(category) {
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const size = selectedSize? selectedSize.value : '';

    const selectedPrice = document.querySelector('input[name="price"]:checked');
    const price = selectedPrice? selectedPrice.value : '';

    if (size !=="" && price==="") {
         
        const encodedSize = encodeURIComponent(size);
        const url = `/products/${category}/viewAll?size=${encodedSize}`;
        window.location.replace(url)
    }
    else if (size==="" && price!=="") {
        const encodedPrice = encodeURIComponent(price);
        const url = `/products/${category}/viewAll?price=${encodedPrice}`;
        window.location.replace(url)
    }
     else if (size!=="" && price!=="") {
        const encodedSize = encodeURIComponent(size);
        const encodedPrice = encodeURIComponent(price);
        const url = `/products/${category}/viewAll?size=${encodedSize}&price=${encodedPrice}`;
        window.location.replace(url)
    }
}

