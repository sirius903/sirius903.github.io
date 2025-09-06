let time = new Array(5);
["MON", "TUE", "WED", "THU", "FRI"].forEach((x, y) => {
    time[y] = new Array(7);
    for(let i = 0; i < 7; i++){
        if(x == "WED" && i == 6){
            break;
        }
        if(localStorage.getItem(x + i) == null){
            let ans = prompt(["월", "화", "수", "목", "금"][y] + "요일 " + (i + 1) + "교시의 과목은?");
            if(ans != null){
                localStorage.setItem(x + i, ans);
            }else{
                localStorage.setItem(x + i, "비어있음");
            }
        }else{
            time[y][i] = localStorage.getItem(x + i);
        }
    }
})
let $timetable = document.getElementById("timetable");
function reset(){
    $timetable.innerHTML = `
    <div id="time" class="row">
    <div></div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
    </div>`;
    time.forEach((x, y) => {
        let str = `<div class="day row"><div class="week">${["월", "화", "수", "목", "금"][y]}</div>`;
        x.forEach(e => {
            str += `<div>`;
            e.split("\\n").forEach(a => {
                if(a[0] + a[a.length - 1] == '**'){
                    str += `<h4>${a.slice(1, a.length - 1)}</h4>`;
                }else{
                    str += `<p>${a}</p>`;
                }
            })
            str += `</div>`;
        })
        $timetable.innerHTML += str + `</div>`;
    })
}
reset();
function getWeekNumber(date = new Date()) {
    const dayOfWeek = new Date(date.getFullYear(), 0, 1).getDay();
    return Math.ceil((Math.floor((date - new Date(date.getFullYear(), 0, dayOfWeek === 0 ? 1 : 8 - dayOfWeek)) / (24 * 60 * 60 * 1000)) + 1) / 7);
}

document.getElementById("today").innerText = new Intl.DateTimeFormat('kr').format(new Date());
let week = getWeekNumber()
document.getElementById("week-n").innerText = "개학 " + (week - 30) + '주차';

document.querySelectorAll(".week-btn").forEach((x, y) => {
    x.addEventListener("click", function(){
        week += Math.sign(y - 0.5);
        document.getElementById("week-n").innerText = "개학 " + (week - 30) + '주차';
        reset();
        peri(periods[week - 31]);
    })
})


let periods = [];

fetch(`src/json/8.json`, {
    headers: {'Accept': 'application/vnd.github.v3.raw'}
}).then(response => response.json()).then(data => {
    periods = data;
    peri(periods[week - 31]);
    
    // periods = data;
}).catch(error => {
    console.error('Error:', error);
});

function peri(arr){
    if(week > 30 && week < 45){
        arr.forEach((x, y) => {
            let account = document.querySelectorAll(".day")[y];
            if(x[0] == 0){
                account.innerHTML = `<div class="week">${["월", "화", "수", "목", "금"][y]}</div><div class="public">${x[1]}</div>`;
            }else if(x[0] >= 1 && x[0] <= 5){
                let str = '<div>';
                time[x[0] - 1][x[1] - 1].split("\\n").forEach(a => {
                    if(a[0] + a[a.length - 1] == '**'){
                        str += `<h4>${a.slice(1, a.length - 1)}</h4>`;
                    }else{
                        str += `<p>${a}</p>`;
                    }
                })
                str += `</div>`;
                account.innerHTML += str;
            }else if(x[0] == 6){
                x[1].forEach(b => {
                    let str = '<div>';
                    time[b[0] - 1][b[1] - 1].split("\\n").forEach(a => {
                        if(a[0] + a[a.length - 1] == '**'){
                            str += `<h4>${a.slice(1, a.length - 1)}</h4>`;
                        }else{
                            str += `<p>${a}</p>`;
                        }
                    })
                    str += `</div>`;
                    account.innerHTML += str;
                    // account.innerHTML += `<div>${}</div>`;
                })
            }else if(x[0] == 7){
                account.innerHTML += `<div class="twin">${x[1]}</div>`;
            }else if(x[0] == 8){
                account.innerHTML = `<div class="week">${["월", "화", "수", "목", "금"][y]}</div><div class="holi">${x[1]}</div>`;
            }
        })
    }
    if(week == getWeekNumber()){
        document.querySelectorAll(".day")[new Date().getDay() - 1].querySelectorAll("div").forEach((x, y) => {
            if(y != 0) x.classList.add("today");
        })
    }
}

document.querySelectorAll("#grid div").forEach((x, y) => {
    if(y / 6 > 1 && y % 6 != 0 && (y / 6 < 7 || y % 6 != 3)){
        x.addEventListener("click", function(){
            let t = ["MON", "TUE", "WED", "THU", "FRI"][y % 6 - 1] + (Math.floor(y / 6) - 1);
            let ans = prompt(["월", "화", "수", "목", "금"][y % 6 - 1] + "요일 " + Math.floor(y / 6) + "교시의 과목은?");
            if(ans != null) localStorage.setItem(t, ans);
            ["MON", "TUE", "WED", "THU", "FRI"].forEach((x, y) => {
                time[y] = new Array(7);
                for(let i = 0; i < 7; i++){
                    if(x == "WED" && i == 6){
                        break;
                    }
                    if(localStorage.getItem(x + i) == null){
                        localStorage.setItem(x + i, prompt(x + i + "?"));
                    }else{
                        time[y][i] = localStorage.getItem(x + i);
                    }
                }
            })
            reset();
            peri(periods[week - 31]);
        })
        x.innerText = "↺";
        x.classList.add("change");
    }
})

document.querySelectorAll(".size-btn").forEach((x, y) => {
    x.addEventListener("click", function(){
        let n = document.getElementById("size-n");
        let text = n.innerText;
        let nu = +text.slice(0, text.length - 1) - 5 * Math.sign(y - 0.5)
        n.innerText = nu + '%';
        document.getElementById("content").style.transform = `scale(${nu / 100})`;
        // document.querySelector("body").style.transform = `scale(${nu / 100})`;
        localStorage.setItem("size", nu);
    })
})

let size = localStorage.getItem("size");
if(localStorage.getItem("size") == null){
    localStorage.setItem("size", 100);
}else{
    document.getElementById("size-n").innerText = size + "%";
    document.getElementById("content").style.transform = `scale(${+size / 100})`;
}