if(window.localStorage.getItem('thema') == null){
    document.body.dataset.thema = 'light-mode';
    window.localStorage.setItem('thema', 'light-mode');
}else{
    document.body.dataset.thema = window.localStorage.getItem('thema');
    if(document.body.dataset.thema == 'dark-mode'){
        document.getElementById('thema').innerHTML = `<option id="light-mode">밝은 배경</option>
    <option id="dark-mode" selected>어두운 배경</option>
    <option id="credit">크레딧</option>`;
    }
}
const darkmode = function(){
    switch(document.getElementById('thema').selectedIndex){
        case 0:
            document.body.dataset.thema = 'light-mode';
            window.localStorage.setItem('thema', 'light-mode');
            break;
        case 1:
            document.body.dataset.thema = 'dark-mode';
            window.localStorage.setItem('thema', 'dark-mode');
            break;
        default:
            alert('개발중');
            break;
    }
}