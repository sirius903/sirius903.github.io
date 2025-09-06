document.querySelectorAll('.path').forEach(path => {
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
})

let delta = 0;
let years = ['Physics', 'B.C 600', '1600', '1666', '1687', '1729', '1746', '1752', '1780', '1785', '1800', '1827', '1831', '1840', '1864', '1879', '1882', '1888', '1895', '1897'];
window.addEventListener("wheel", function(e){
    if(e.deltaY > 0){
        if(delta + e.deltaY > 0){
            delta = 0;
        }else{
            delta += e.deltaY;
        }
    }else if(e.deltaY < 0){
        delta += e.deltaY;
    }
    moveWindow();
    localStorage.setItem("delta", delta);
});
window.onload = function(){
    localStorage.setItem("delta", localStorage.getItem("delta") ?? 0);
    delta = +localStorage.getItem("delta");
    moveWindow();
}

function moveWindow(){
    contents.style.transform = `translate(${delta}px)`;
    year.innerText = years[Math.floor(-delta / 700)];
    document.querySelectorAll('.path').forEach((path, i) => {
        if(i < Math.floor(-delta / 700)){
            path.style.strokeDashoffset = 0;
            if(-delta % 700 != 0){
                path.style.transition = '';
            }
        }else if(i == Math.floor(-delta / 700)){
            path.style.strokeDashoffset = path.getTotalLength() / 700 * (700 - (-delta % 700));
            path.style.transition = 'all 300ms';
        }else{
            path.style.strokeDashoffset = path.getTotalLength();
            path.style.transition = '';
        }
    })
}