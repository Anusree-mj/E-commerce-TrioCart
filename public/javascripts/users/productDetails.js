function openImagePreview(imageSrc) {
    $('#previewedImg').attr('src', '/' + imageSrc);
    $('#imagePreviewModal').modal('show');
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