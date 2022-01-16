const form = document.querySelectorAll(".form");
const buttonArray = document.querySelectorAll(".button");

function del(e) {
    const button = e.target.parentElement;
    console.log(button);
    button.remove();
}

/*
for(let i = 0; i < buttonArray.length; i++) {
    buttonArray[i].addEventListener("cllck", del);
}
*/

buttonArray.forEach(btn => {
    btn.addEventListener("submit", del);
});
