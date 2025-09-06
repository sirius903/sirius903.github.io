var ctx = canvas.getContext('2d');
var graph = document.getElementById('graph');
var context = graph.getContext('2d');

let apples_y = [[]];

function repeat(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    if(timer){
        apples.forEach((a, i) => {
            a.velocity[1] -= gravity / fps * speed;
            a.x += a.velocity[0] / fps * speed;
            a.y += a.velocity[1] / fps * speed;
            if(a.y - a.radius < ground.height){
                a.y = ground.height + a.radius;
                a.velocity[1] = 0;
            }
            apples_y[i].unshift(a.y);
        })
    }
    apples.forEach((a, i) => {
        document.getElementById('apple-x-' + i).value = a.x;
        document.getElementById('apple-y-' + i).value = a.y;
        if(a.maximum < a.y){
            a.maximum = a.y;
            document.getElementById('apple-maximum-' + i).value = maximum;
        }
        document.getElementById('apple-hvr-' + i).value = a.velocity[0];
        document.getElementById('apple-vvr-' + i).value = a.velocity[1];
        document.getElementById('apple-ke-' + i).value = a.mass * (Math.pow(a.velocity[0], 2) + Math.pow(a.velocity[1], 2)) / 2;
        document.getElementById('apple-pe-' + i).value = a.mass * gravity * a.y;
        document.getElementById('apple-de-' + i).value = a.mass * ((Math.pow(a.velocity[0], 2) + Math.pow(a.velocity[1], 2)) / 2 + gravity * a.y);
    })
    ctx.fillRect(0, canvas.height - ground.height * meter + position[1], canvas.width, ground.height * meter - position[1]);
    apples.forEach((a, i) => {
        ctx.fillStyle = 'rgba(255, 255, 255,' + 1 / apples.length * (apples.length - i) + ')'
        ctx.beginPath();
        ctx.arc(a.x * meter + position[0], canvas.height - a.y * meter + position[1], a.radius * meter, 0, Math.PI * 2, true);
        ctx.fill();
    })
    
    context.clearRect(0, 0, graph.width, graph.height);
    
    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(0, graph.height / 2);
    context.lineTo(graph.width, graph.height / 2);
    context.stroke();
    
    apples_y.forEach((a, i, o) => {
        context.strokeStyle = 'black';
        context.beginPath();
        for(let j = 0; j < a.length; j++){
            context.lineTo(graph.width / (o.length + 1) * (i + 1) - j, graph.height / 2 - a[j] * 10);
        }
        context.stroke();
    })
}
let repeater = setInterval(repeat, 1000 / fps);
//(fps)ms