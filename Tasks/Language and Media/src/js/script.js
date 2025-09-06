function message(message, my){
    if(message != ''){
        let date = new Date();
        document.getElementById('content').innerHTML += `
        <div class="chat ${my ? 'my' : ''}">
            <div class="chat-text">${message}</div>
            <div class="chat-time">${zero(date.getHours(), 2)}:${zero(date.getMinutes(), 2)}</div>
        </div>`;
    }
}

function zero(str, n){
    return String(str).padStart(n, "0")
}

document.getElementById('img-btn').addEventListener("click", function(){
    document.getElementById('bg').classList.remove("hidden");
})

document.getElementById('submit').addEventListener("click", function(){
    let text = document.getElementById('message');
    message(text.value, true);
    text.value = '';
})

document.getElementById('message').addEventListener("keypress", function(e){
    if(e.code === 'Enter' || e.key === 'Enter'){
        message(this.value, true);
        this.value = '';
    }
})

document.querySelectorAll('.image').forEach((x, y, z) => {
    x.addEventListener("click", function(){
        this.classList.toggle("active");
        let submit = document.getElementById('img-submit');
        if(document.querySelectorAll('.image.active').length){
            submit.classList.add("active");
        }else{
            submit.classList.remove("active");
        }
    })
})

document.getElementById('bg').addEventListener("click", function(e){
    let image = document.getElementById('image');
    if(!image.contains(e.target)){
        this.classList.add("hidden");
    }
})

document.getElementById('img-submit').addEventListener("click", function(){
    if(this.classList.contains("active")){
        if(prompt("정말로 전송하시겠습니까?\n되돌릴 수 없습니다.(y/n)") == 'y'){
            alert('...');
            document.getElementById('bg').classList.add("hidden");
            setTimeout(() => {
                message("ㅋ");
                setTimeout(() => {
                    message("<a href='https://www.joongang.co.kr/article/25253346'>링크</a>");
                }, 1000);
            }, 500);
        }else{
            // alert(false)
        }
    }
})

window.onload = function(){
    setTimeout(() => {
        message("안녕하세요");
        setTimeout(() => {
            message("혹시 사진 좀 보내주실수 있으신가요?");
        }, 1000);
    }, 1000);
}