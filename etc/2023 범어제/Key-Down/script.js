fetch('words.json').then(response => {
    if(!response.ok){
        throw new Error('오류다!!!');
    }
    return response.json();
}).then(jsonData => {
    let chapter = 0;
    let array = jsonData.sort(() => Math.random() - 0.5);
    function setExam(n){
        document.getElementById('exam').innerText = array[n].toUpperCase();
        document.querySelectorAll('.status-box')[n].querySelector('div').className = 'timer';
        setTimeout(() => {
            if(n == chapter){
                document.getElementById('Key-Down-input').value = '';
                document.querySelectorAll('.status-box')[n].querySelector('div').className = 'out';
                chapter += 1;
                setExam(chapter);
            }
        }, 5000);
    }
    setExam(0);
    document.addEventListener("keydown", function(e){
        let input = document.getElementById('Key-Down-input');
        if('ABCDEFGHIJKLMNOPQRSTUVWXYZ '.includes(e.key.toUpperCase())){
            input.value += e.key.toUpperCase();
            if(input.value == document.getElementById('exam').innerText){
                input.value = '';
                document.querySelectorAll('.status-box')[chapter].querySelector('div').className = 'clear';
                chapter += 1;
                setExam(chapter);
            }
        }else if(e.key === 'Backspace'){
            input.value = input.value.replace(/.$/, '');
        }
    })
}).catch(error => {
    console.log(error);
})
// function start(abc){
//     document.querySelectorAll('.status-box').forEach((a, i) => {
//         // if(i == 0){
//             alert(abc);
//             a.innerHTML = '<div class="timer-box"></div>';
//         // }
//     })
// }