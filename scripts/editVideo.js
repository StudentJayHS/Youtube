const editForm = document.querySelector('.edit_hashtagForm');
const editHiddenInput = document.querySelector('.edit_hiddenInput');
const editHashtagInput = document.querySelector('.edit_hashtagInput');
const editHashtagContainer = document.querySelector('.edit_hashtagContainer');
let hashtagValue = editHiddenInput.value;

// hashtag.js 에 정의되어 있음
hiddenValue = [];

// 처음 render 할 때 video hashtag 가 있으면 hashtag container 에 추가
editForm.addEventListener('submit', (event) => {
    event.preventDefault();
})

function editHashtagDel(event) {
    const span = event.target.parentElement;
    const spanValue = span.innerText.slice(0, -1);
    hiddenValue = hiddenValue.filter(del => del != spanValue);
    editHiddenInput.value = hiddenValue.join(' ');
    span.remove();
}

if(hashtagValue !== "") {
    hiddenValue = hashtagValue.split(" ");
    console.log(hiddenValue);
    for(let i = 0; i < hiddenValue.length; i++) {
        const span = document.createElement('span');
        const button = document.createElement('button');

        button.addEventListener('click', editHashtagDel);

        span.innerText = hiddenValue[i];
        button.innerText = 'X';

        span.appendChild(button);
        editHashtagContainer.appendChild(span);
    }
}

editHashtagInput.addEventListener('keydown', (event) => {
    if(event.keyCode == 13 || event.keyCode == 32) {
        if(editHashtagInput.value != "#") {
            const span = document.createElement('span');
            const button = document.createElement('button');

            button.addEventListener('click', editHashtagDel);

            span.innerText = editHashtagInput.value;
            button.innerText = 'X';

            span.appendChild(button);
            editHashtagContainer.appendChild(span);

            hiddenValue.push(editHashtagInput.value);
            console.log(hiddenValue);
            editHiddenInput.value = hiddenValue.join(' ');
            editHashtagInput.value = "#";
        }
    }
})

editHashtagInput.addEventListener("input", () => {
    // 첫 입력이 # 이 아닌 경우
    if(!editHashtagInput.value.startsWith("#")) {
        editHashtagInput.value = "#"
    }

    // 빈 값을 보내거나, 스페이스 바를 눌러 해시태그 등록했을 때 공백 생기는 것을 방지
    if(editHashtagInput.value === "" || editHashtagInput.value.startsWith(" ", 1)) {
        editHashtagInput.value = "#";
    }
})



// 이미지 업로드 part
const editThumbnailInput = document.querySelector('.edit_thumbnailInput');
const editThumbnailPicture = document.querySelector('.edit_thumbnailPicture');

editThumbnailInput.addEventListener('change', (event) => {
    let reader = new FileReader();
    if(event.target.files[0] === undefined) {
        editThumbnailPicture.src = '';
    } else {
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event) => {
            editThumbnailPicture.src = event.target.result;
        }
    }
})