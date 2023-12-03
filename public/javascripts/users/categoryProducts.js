function addFilter(category) {
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const size = selectedSize ? selectedSize.value : null;

    const selectedPrice = document.querySelector('input[name="price"]:checked');
    const price = selectedPrice ? selectedPrice.value : null;

    const encodedSize = size ? encodeURIComponent(size) : undefined;
    const encodedPrice = price ? encodeURIComponent(price) : undefined;

    // Construct the URL with size and price parameters
    const url = `http://localhost:3000/products/${category}/viewAll?size=${encodedSize}&price=${encodedPrice}`;

    window.location.replace(url)
}

