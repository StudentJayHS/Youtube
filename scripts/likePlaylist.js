const playlistForm = document.querySelectorAll('.playlist_form');
const playlistButton = document.querySelectorAll('.playlist_button');

playlistForm.forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    })
})

playlistButton.forEach(button =>  {
    button.addEventListener('click', (event) => {
        const videoId = event.target.previousSibling.value;
        const delForm = event.target.parentElement;

        fetch('/videos/like-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({videoId}),
        }).then(response => response.json())
        .then(playlist => {
            delForm.remove();

            if(playlist.length === 0) {
                const h1 = document.createElement('h1');
                h1.innerText = 'Video not found';
                document.body.appendChild(h1);
            }
        })
    })
})