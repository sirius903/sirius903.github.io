window.onload = function(){
    let title = decodeURI(window.location.search.substr(8));
    if(title){
        document.getElementById('contents').innerHTML = `<div class="content" onclick="window.location.href = './easterEgg.html?${title}';"><img src="https://fastly.picsum.photos/id/43/280/175.jpg?hmac=eblvOocG8rzfZhkmAAbloVg9Ko3riqIMA24f7vmm9nc"><div class="content-title">${title}</div></div>`;
    }else{
        for(let i = 12 - document.querySelectorAll('.content').length % 12; i > 0; i--){
            switch (i) {
                case 6:
                    document.getElementById('contents').innerHTML += `<div class="content none" onclick="window.location.href = './easterEgg.html?게발중';"><div class="content-title">게발중</div></div>`;
                    break;
                case 4:
                    document.getElementById('contents').innerHTML += `<div class="content none" onclick="window.location.href = './easterEgg.html?개밥좀';"><div class="content-title">개밥좀</div></div>`;
                    break;
                case 2:
                    document.getElementById('contents').innerHTML += `<div class="content none" onclick="window.location.href = './easterEgg.html?백발백중';"><div class="content-title">백발백중</div></div>`;
                    break;
                case 1:
                    document.getElementById('contents').innerHTML += `<div class="content none" onclick="window.location.href = './easterEgg.html?김민수';"><div class="content-title">김민수</div></div>`;
                    break;
                default:
                    document.getElementById('contents').innerHTML += `<div class="content none"><div class="content-title">개발중</div></div>`;
                    break;
            }
        }
    }
}