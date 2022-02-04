heart = document.querySelectorAll('.userLike');

heart.forEach(element => {
    let span = element.innerText;
    if(span >= 1000) {
        element.innerText = span/1000 + 'M';
    }
});