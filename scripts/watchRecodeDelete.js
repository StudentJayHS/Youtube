const form = document.querySelectorAll(".form");
let nowScrollTop = "";

// 삭제를 했을 떄 스크롤 고정
document.addEventListener('scroll', () => {
    nowScrollTop = document.documentElement.scrollTop;
})

form.forEach(form => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const delForm = event.target;
        const videoId = delForm.lastChild.value;
        
        fetch('/videos/watch-recode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({videoId})
        }).then(response => response.json())
        .then(data => {
            document.documentElement.scrollTop = nowScrollTop;
            delForm.remove();
        })
    })
})