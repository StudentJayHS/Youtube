const id = $('.id').val();
const evaluation = $('.evalButton').val();
const login = $('.login').val();
const buttonForm = document.querySelector('.buttonForm');

// 유저가 이미 비디오에 좋아요 또는 싫어요를 했을 경우
if(evaluation === 'like') {
    $('#like').addClass('likeVideo');
    $('#like').html('<i class="fas fa-heart"></i>');
} else if(evaluation === 'hate') {
    $('#hate').addClass('hateVideo');
    $('#hate').html('<i class="fas fa-heart-broken"></i>')
}

$(document).ready(function() {
    $('#like').click(function() {
        // 로그인을 하지 않고 버튼을 클릭했을 경우
        if(login === 'undefined') {
            return location.href="/users/login";
        }

        let like = true;

        // 좋아요 버튼을 눌렀을 때 클래스 추가와 삭제
        $('#like').toggleClass('likeVideo');

        // 좋아요 버튼에 클래스가 있으면
        if($('#like').hasClass('likeVideo')) {
            $('#like').html('<i class="fas fa-heart"></i>');

            // 좋아요 버튼에 클래스가 있을 때 싫어요 버튼에도 클래스가 있으면
            if($('#hate').hasClass('hateVideo')) {
                $('#hate').removeClass('hateVideo');
                $('#hate').html('<i class="fas fa-heartbeat"></i>');
            }

        } else {
            $('#like').html('<i class="far fa-heart"></i>');
            like = false;
        }

        $.ajax({
            url: `/videos/watch/${id}`,
            dataType: 'json',
            type: 'POST',
            data: {like, id},
            success: (userLike) => {
                $('.userLike').text(userLike.length)
            }
        })
    })
})

$(document).ready(function() {
    $('#hate').click(function() {
        // 로그인을 하지 않고 버튼을 클릭했을 경우
        if(login === 'undefined') {
            return location.href="/users/login";
        }
        
        let hate = true;

        // 싫어요 버튼을 눌렀을 때 클래스 추가와 삭제
        $('#hate').toggleClass('hateVideo');

        // 싫어요 버튼에 클래스가 있으면 
        if($('#hate').hasClass('hateVideo')) {
            $('#hate').html('<i class="fas fa-heart-broken"></i>')

            // 싫어요 버튼에 클래스가 있을 때 좋아요 버튼에도 클래스가 있다면
            if($('#like').hasClass('likeVideo')) {
                $('#like').removeClass('likeVideo');
                $('#like').html('<i class="far fa-heart"></i>');
            }

        } else {
            $('#hate').html('<i class="fas fa-heartbeat"></i>');
            hate = false;
        }

        $.ajax({
            url: `/videos/watch/${id}`,
            dataType: 'json',
            type: 'POST',
            data: {hate, id},
        })
    })
})