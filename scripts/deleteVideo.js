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
        const videoId = delForm.getElementsByClassName('recodeVideoId')[0].value;

        // className 을 가져올 때 배열 0 번 또는 1번을 지정하지 않으면 다중 input 을 가져오는데 왜 그런걸까?
        
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