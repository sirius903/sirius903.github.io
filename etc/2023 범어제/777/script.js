let coin = 0;
document.getElementById('coin').addEventListener("click", function(){
    coin += 100;
    document.getElementById('coin-view').innerText = `배팅액 : ${coin} pt`;
})
document.getElementById('spin').addEventListener("click", function(){
    //
})