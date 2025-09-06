fetch('codes.json').then(response => {
    if(!response.ok){
        throw new Error('오류다!!!');
    }
    return response.json();
}).then(jsonData => {
    let chapter = 0;
    let array = jsonData.sort(() => Math.random() - 0.5);
    function setExam(n){
        document.getElementById('exam').innerText = array[n][0];
        document.getElementById('area').value = array[n][1];
        document.querySelectorAll('.status-box')[n].querySelector('div').className = 'timer';
        setTimeout(() => {
            if(n == chapter){
                document.getElementById('area').value = '';
                document.querySelectorAll('.status-box')[n].querySelector('div').className = 'out';
                chapter += 1;
                setExam(chapter);
            }
        }, 30000);
    }
    setExam(0);
    document .getElementById('area').addEventListener("input", function(){
        if(this.value == document.getElementById('exam').innerText){
            this.value = '';
            document.querySelectorAll('.status-box')[chapter].querySelector('div').className = 'clear';
            chapter += 1;
            setExam(chapter);
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