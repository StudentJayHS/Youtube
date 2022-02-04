const thumbnailInput = document.getElementById('thumbnailInput');
const videoInput = document.getElementById('videoInput');

const thumbnailPicture = document.getElementById('thumbnailPicture');
const videoPicture = document.getElementById('videoPicture');

thumbnailInput.addEventListener('change', (event) => {
    let reader = new FileReader();
    console.log(event.target.files[0]);
    if(event.target.files[0] === undefined) {
        thumbnailPicture.src = ''
    } else {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
        thumbnailPicture.src = event.target.result;
        }
    }
})

videoInput.addEventListener('change', (event) => {
    let reader = new FileReader();
    if(event.target.files[0] === undefined) {
        videoPicture.src = '';
    } else {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
        videoPicture.src = event.target.result;
        }
    }
})