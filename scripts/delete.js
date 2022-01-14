const buttonArray = document.querySelectorAll(".form");
let button = "";

function del(event) {
    button = event.target.parentElement;
    console.log(button);
    button.remove();
}

for(let i = 0; i < buttonArray.length; i++) {
    button = buttonArray[i];
    button.addEventListener("submit", del)
}