const form = document.querySelector('.hashtagForm');
const hashtagInput = document.querySelector(".hashtagInput");
const hashtagBox = document.querySelector(".hashtagBox");
const hiddenInput = document.querySelector(".hiddenInput");

let hiddenValue = [];

form.addEventListener('submit', (event) => {
    event.preventDefault();
})

function del(event) {
    const span = event.target.parentElement;
    const spanValue = span.innerText.slice(0, -1);
    hiddenValue = hiddenValue.filter(del => del != spanValue);
    hiddenInput.value = hiddenValue.join(' ');
    span.remove();
}

hashtagInput.addEventListener('keydown', (event) => {
    if(event.keyCode == 13 || event.keyCode == 32) {
        if(hashtagInput.value != "#") {
        const span = document.createElement('span');
        const button = document.createElement('button');

        button.addEventListener("click", del);

        span.innerText = hashtagInput.value;
        button.innerText = "X";

        span.appendChild(button);
        hashtagBox.appendChild(span);

        hiddenValue.push(hashtagInput.value);
        hiddenInput.value = hiddenValue.join(' ');
        hashtagInput.value = "#"
        }
    }
})

hashtagInput.addEventListener("input", () => {
    // 빈 값을 보내거나, 스페이스 바를 눌러 해시태그 등록했을 때 공백 생기는 것을 방지
    if(hashtagInput.value === "" || hashtagInput.value.startsWith(" ", 1)) {
        hashtagInput.value = "#";
    }
})