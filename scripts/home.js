// watchEvaluation 에 정의되어 있음.
heart = document.querySelectorAll('.userLike');

const homeHashtag = document.querySelectorAll('.home_hashtag');

homeHashtag.forEach(input => {
    let hashtagValue = input.value;
    if(hashtagValue !== "") {
        let hashtagArray = hashtagValue.split(" ");
        for(let i = 0; i < hashtagArray.length; i++) {
            const hiddenInput = document.createElement('input');
            const inputButton = document.createElement('input');
            const form = document.createElement('form');
    
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'search';
            hiddenInput.value = hashtagArray[i].slice(1);

            inputButton.type = "button";
            inputButton.value = hashtagArray[i];

            form.method = 'GET';
            form.action = '/search';

            form.appendChild(hiddenInput);
            form.appendChild(inputButton);

            const homeHashtagContainer = input.nextSibling;
            homeHashtagContainer.appendChild(form);

            inputButton.addEventListener('click', () => {
                inputButton.parentElement.submit();
            })
        }
    }
})

heart.forEach(element => {
    let span = element.innerText;
    if(span >= 1000) {
        element.innerText = span/1000 + 'M';
    }
});