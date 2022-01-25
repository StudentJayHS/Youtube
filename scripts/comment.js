const textContainer = document.querySelector('.textContainer');
const delButton = document.querySelectorAll('.delButton');
const deleteForm = document.querySelectorAll('.deleteForm');
const commentInput = document.querySelector('.comment');
const commentForm = document.querySelector('.commentForm');

commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const notComment = document.querySelector('.notComment');

    // 로그인을 하지 않고 댓글을 쓸 경우
    if(login === 'undefined') {
        return location.href="/users/login";
    }

    let text = commentInput.value;
    if(notComment) {
        notComment.remove();
    }

    // then 을 두 번 사용해서 데이터 가공
    fetch(`/videos/watch/${id}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    }).then(response => response.json())
    .then(data => {
        commentInput.value = "";

        // 나중에 css 하면서 삭제할 것
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const br = document.createElement('br');

        const form = document.createElement('form');
        const commentContainer = document.createElement('div');
        const commentId = document.createElement('input');
        const name = document.createElement('span');
        const commentText = document.createElement('span');
        const delButton = document.createElement('button');
        const date = document.createElement('span');

        form.classList.add('deleteForm');
        commentId.type = "hidden";

        commentId.innerText = data.commentId;
        name.innerText = data.name;
        commentText.innerText = data.text;
        delButton.innerText = 'X';
        date.innerText = data.date;

        span1.innerText = ": ";
        span2.innerText = " ";

        commentContainer.appendChild(name);
        commentContainer.appendChild(span1);
        commentContainer.appendChild(commentText);
        commentContainer.appendChild(span2);
        commentContainer.appendChild(delButton);
        commentContainer.appendChild(br);
        commentContainer.appendChild(date);
        form.appendChild(commentId);
        form.appendChild(commentContainer);
        textContainer.appendChild(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const delCommentId = event.target[0].innerText;
            const delForm = event.target;

            fetch(`/videos/watch/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({delCommentId}),
            }).then(response => response.json())
            .then(data => {
                delForm.remove();
    
                if(data.length === 0) {
                    const h2 = document.createElement('h2');
                    h2.classList.add('notComment');
                    h2.innerText = 'There are no comments yet.';
                    textContainer.appendChild(h2);
                }
            })
        })
    });
})

deleteForm.forEach(del => {
    del.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const delCommentId = event.target[0].value;
        const delForm = event.target;
    
        fetch(`/videos/watch/${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({delCommentId}),
        }).then(response => response.json())
        .then(data => {
            delForm.remove();
    
            if(data.length === 0) {
                const h2 = document.createElement('h2');
                h2.classList.add('notComment');
                h2.innerText = 'There are no comments yet.';
                textContainer.appendChild(h2);
            }
        })
    })
})

// 제이쿼리 ajax
/*
$(document).ready(() => {
    $('.commentForm').submit((event) => {
        event.preventDefault();
        const notComment = document.querySelector('.notComment');

        // 로그인을 하지 않고 댓글을 쓸 경우
        if(login === 'undefined') {
            return location.href="/users/login";
        }

        let text = $('.comment').val();
        notComment.remove();

        $.ajax({
            url: `/videos/watch/${id}`,
            dataType: 'json',
            type: 'POST',
            data: {text},
            success: function(data) {
                commentInput.value = "";

                // 나중에 css 하면서 삭제할 것
                const span1 = document.createElement('span');
                const span2 = document.createElement('span');
                const br = document.createElement('br');

                const form = document.createElement('form');
                const commentContainer = document.createElement('div');
                const commentId = document.createElement('input');
                const name = document.createElement('span');
                const commentText = document.createElement('span');
                const delButton = document.createElement('button');
                const date = document.createElement('span');

                form.classList.add('deleteForm');
                commentId.type = "hidden";

                commentId.innerText = data.commentId;
                name.innerText = data.name;
                commentText.innerText = data.text;
                delButton.innerText = 'X';
                date.innerText = data.date;

                span1.innerText = ": ";
                span2.innerText = " ";

                commentContainer.appendChild(name);
                commentContainer.appendChild(span1);
                commentContainer.appendChild(commentText);
                commentContainer.appendChild(span2);
                commentContainer.appendChild(delButton);
                commentContainer.appendChild(br);
                commentContainer.appendChild(date);
                form.appendChild(commentId);
                form.appendChild(commentContainer);
                textContainer.appendChild(form);

                $('.deleteForm').submit((event) => {
                    event.preventDefault();
            
                    const delCommentId = event.target[0].innerText;
                    const delForm = event.target;
            
                    $.ajax({
                        url: `/videos/watch/${id}`,
                        dataType: 'json',
                        type: 'POST',
                        data: {delCommentId},
                        success: function(data) {
                            delForm.remove();

                            if(data.length === 0) {
                                const h2 = document.createElement('h2');
                                h2.classList.add('notComment');
                                h2.innerText = 'There are no comments yet.';
                                textContainer.appendChild(h2);
                            }
                        }
                    })
                })
            }
        })
    })
})

$(document).ready(() => {
    $('.deleteForm').submit((event) => {
        event.preventDefault();

        const delCommentId = event.target[0].value;
        const delForm = event.target;

        $.ajax({
            url: `/videos/watch/${id}`,
            dataType: 'json',
            type: 'POST',
            data: {delCommentId},
            success: function(data) {
                delForm.remove();

                if(data.length === 0) {
                    const h2 = document.createElement('h2');
                    h2.classList.add('notComment');
                    h2.innerText = 'There are no comments yet.';
                    textContainer.appendChild(h2);
                }
            }
        })
    })
})
*/