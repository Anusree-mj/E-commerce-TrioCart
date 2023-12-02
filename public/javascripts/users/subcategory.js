function addFilter(category, subCategory) {
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const size = selectedSize ? selectedSize.value : null;

    const selectedPrice = document.querySelector('input[name="price"]:checked');
    const price = selectedPrice ? selectedPrice.value : null;

    const encodedSize = size ? encodeURIComponent(size) : '';
    const encodedPrice = price ? encodeURIComponent(price) : '';

    // Construct the URL with size and price parameters
    const url = `http://localhost:3000/products/${category}/${subCategory}?size=${encodedSize}&price=${encodedPrice}`;

    window.location.replace(url)
}

