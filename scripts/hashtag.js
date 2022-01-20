const input = document.querySelector(".hashtagInput");
const form = document.querySelector(".uploadForm");
const button = document.querySelector(".uploadButton");
const div = document.querySelector(".hashtagBox");

function formHandler(event) {
    event.preventDefault();
}

function del(event) {
    const span = event.target.parentElement;
    span.remove();
}

function inputHandler() {
    const space = /\s/;
    let value = input.value;
    if(value.match(space)) {
        const span = document.createElement("span");
        const button = document.createElement("button");
        button.addEventListener("click", del);
        span.innerText = input.value;
        button.innerText = "X ";
        span.appendChild(button);
        div.appendChild(span);
        input.value = "#";
    }
}

function buttonHandler() {
    form.submit();
}

input.addEventListener("input", inputHandler);
form.addEventListener("submit", formHandler);
button.addEventListener("click", buttonHandler);