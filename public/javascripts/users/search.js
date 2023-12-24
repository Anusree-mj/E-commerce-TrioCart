function search() {
    let query = document.getElementById('search').value;

    if (query !== '') {
        let url = `http://localhost:3000/search?q=${encodeURIComponent(query)}`;
        window.location.replace(url)
    }
}
