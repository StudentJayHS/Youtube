const form = document.querySelector(".form");
const commentInput = document.querySelector(".comment");
const textContainer = document.querySelector(".textContainer");


function add(event) {
    event.preventDefault();
    const id = commentInput.dataset.id;
    if (!id) {
        return location.href="/users/login";
    }

    
}

form.addEventListener("submit", add);