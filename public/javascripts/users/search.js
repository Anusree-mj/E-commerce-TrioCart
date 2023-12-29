function search() {
    let query = document.getElementById('search').value;

    if (query !== '') {
        let url = `/search?q=${encodeURIComponent(query)}`;
        window.location.replace(url)
    }
}
