const profileInput = document.getElementById('profileInput');
const profileImage = document.getElementById('profileImage');

profileInput.addEventListener('change', (event) => {
    let reader = new FileReader();
    if(event.target.files[0] === undefined) {
        profileImage.src = ''
    } else {
        reader.readAsDataURL(event.target.files[0])
        reader.onload = function(event) {
        profileImage.src = event.target.result;
        }
    }
})