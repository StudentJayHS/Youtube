const buttonArray = document.querySelectorAll(".button");
const form = document.querySelectorAll(".form");


form.forEach(form => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.submit();
        form.remove();
    })
})