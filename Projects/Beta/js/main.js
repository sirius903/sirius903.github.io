let terrain = [];
fetch('./jsons/Terrains.json').then(response => {
    if(!response.ok){
        throw new Error('오류임');
    };
    return response.json();
}).then(tera => {
    terrain = tera;
}).catch(error => {
    console.log(error);
});

let beta = {
    x : 0,
    y : 50,
    dx : 40,
    dy : 80,
    vx : 0,
    vy : 0,
    left : false,
    move : [[false, false], [false, 0], false],
    src : "./images/nomal.png"
};

let stat = {
    AGI : 5
};

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let 공중 = false;

canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

let time = 0;

setInterval(() => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    if(beta.move[0].filter(x => x == true).length == 1){
        if(beta.move[0][0] == true && beta.vx > -stat.AGI){
            beta.vx -= stat.AGI / 20;
            if(beta.vx < -stat.AGI) beta.vx = -stat.AGI;
        }else if(beta.move[0][1] == true && beta.vx < stat.AGI){
            beta.vx += stat.AGI / 20;
            if(beta.vx > stat.AGI) beta.vx = stat.AGI;
        }
    }else{
        if(beta.vx > 0){
            beta.vx -= stat.AGI / 20;
            if(beta.vx < 0) beta.vx = 0;
        }else if(beta.vx < 0){
            beta.vx += stat.AGI / 20;
            if(beta.vx > 0) beta.vx = 0;
        }
    };

    if(beta.move[1][0]){
        if(beta.move[1][1] < 1){
            beta.move[1][1] += 1;
            beta.vy = stat.AGI * 4;
        }
    }

    if(공중){
        let a = terrain.filter(x => beta.y > x[1] && beta.x + beta.dx / 2 > x[0] && beta.x - beta.dx / 2 < x[2]);

        let x = terrain.filter(x => beta.y > x[1] && beta.y + beta.vy - 1 < x[1] && beta.x + beta.dx / 2 > x[0] && beta.x - beta.dx / 2 < x[2]);
        if(x.length){
            beta.vy = 0;
            beta.move[1][1] = 0;
            beta.y = x.sort(function(a, b){return a[1] - b[1]})[0][1];
        }else{
            beta.vy -= 1;
        }
    }

    let walls = terrain.filter(x => beta.y < x[1] && beta.y + beta.dy > x[3]);
    if(walls.length){
        let wall1 = walls.filter(x => beta.x + beta.dx / 2 <= x[0] && beta.x + beta.dx / 2 + beta.vx > x[0]);
        let wall2 = walls.filter(x => beta.x - beta.dx / 2 >= x[2] && beta.x - beta.dx / 2 + beta.vx < x[2]);
        if(wall1.length){
            beta.vx = 0;
            beta.x = wall1.sort(function(a, b){return a[0] - b[0]})[0][0] - beta.dx / 2;
        }else if(wall2.length){
            beta.vx = 0;
            beta.x = wall2.sort(function(a, b){return a[2] - b[2]})[0][2] + beta.dx / 2;
        }
    }


    if(terrain.filter(function(x){
        if(x[4] == 0){
            if(beta.y == x[1] && beta.x + beta.dx / 2 > x[0] && beta.x - beta.dx / 2 < x[2]){
                return true;
            }else{
                return false;
            }
        }else if(x[4] == 1){
            if(beta.y == (x[3] - x[1]) / (x[2] - x[0]) * (beta.x - beta.dx / 2 - x[0]) + x[1]){
                return true;
            }else{
                return false
            }
        }
    }).length){
        공중 = false;
        console.log("땅에 닿아이씀!!!");
    }else{
        공중 = true;
        console.log("공중에 떠이씀!!!")
    }

    beta.x += beta.vx;
    beta.y += beta.vy;

    terrain.forEach(a => {
        let x = innerWidth / 2 + a[0];
        let y = innerHeight - a[1];
        let dx = a[2] - a[0];
        let dy = a[1] - a[3];
        ctx.fillStyle = a[5];
        if(a[4] == 0){
            ctx.fillRect(x, y, dx, dy);
        }else if(a[4] == 1){
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + dy);
            ctx.lineTo(x + dx, y + dy);
            ctx.fill();
        }
    });

    let img = new Image();
    img.src = beta.src;
    // ctx.fillStyle = 'blue';
    
    if(time % 80 < 20){
        ctx.drawImage(img, 0, 0, 25, 50, (innerWidth - beta.dx) / 2 + beta.x, innerHeight - beta.y - beta.dy, beta.dx, beta.dy);
    }else if(time % 80 < 40){
        ctx.drawImage(img, 25, 0, 25, 50, (innerWidth - beta.dx) / 2 + beta.x, innerHeight - beta.y - beta.dy, beta.dx, beta.dy);
    }else if(time % 80 < 60){
        ctx.drawImage(img, 50, 0, 25, 50, (innerWidth - beta.dx) / 2 + beta.x, innerHeight - beta.y - beta.dy, beta.dx, beta.dy);
    }else{
        ctx.drawImage(img, 75, 0, 25, 50, (innerWidth - beta.dx) / 2 + beta.x, innerHeight - beta.y - beta.dy, beta.dx, beta.dy);
    }
    
    let abc = Math.floor((time % 30 * 4) / 30);
    if(abc == 0){
        ctx.drawImage(img, 0, 50, 28, 50, 0, 0, 50, 100);
    }else if(abc == 1){
        ctx.drawImage(img, 28, 50, 28, 50, 0, 0, 50, 100);
    }else if(abc == 2){
        ctx.drawImage(img, 56, 50, 28, 50, 0, 0, 50, 100);
    }else if(abc == 3){
        ctx.drawImage(img, 84, 50, 28, 50, 0, 0, 50, 100);
    }

    time++;
}, 20);

document.addEventListener("keydown", function(e){
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
        switch (e.code){
            case "ArrowLeft":
                beta.move[0][0] = true;
                break;
            case "ArrowRight":
                beta.move[0][1] = true;
                break;
            case "ArrowUp":
                beta.move[1][0] = true;
                break;
            case "ArrowDown":
                beta.move[2] = true;
                break;
        }
    }
});
document.addEventListener("keyup", function(e){
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
        switch (e.code){
            case "ArrowLeft":
                beta.move[0][0] = false;
                break;
            case "ArrowRight":
                beta.move[0][1] = false;
                break;
            case "ArrowUp":
                beta.move[1][0] = false;
                break;
            case "ArrowDown":
                beta.move[2] = false;
                break;
        }
    }
});