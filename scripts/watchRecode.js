let videoDate = document.querySelector('.videoDate').value;
let date = new Date();

videoDate = new Date(videoDate);
date.setHours(date.getHours() - 24)

console.log(date)
console.log(videoDate);

let changeRecode = "";

if(date <= videoDate) {
    changeRecode = true;
} else {
    changeRecode = false;
}

fetch(`/videos/watch/${id}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({changeRecode}),
})