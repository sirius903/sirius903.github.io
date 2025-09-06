var ctx = canvas.getContext('2d');
var graph = document.getElementById('graph');
var context = graph.getContext('2d');

var y = [];
var ke = [];
var pe = [];
var de = [];

function repeat(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    ctx.beginPath();
    if(tracks.start * meter + position[0] < 0){
        for(let i = 0; i <= canvas.width; i++){
            if(canvas.height - spring.y * meter / 2 - tracks.list(-(tracks.start * meter + position[0] - i) / meter) * meter + position[1] >= 0){
                ctx.lineTo(i, canvas.height - spring.y * meter / 2 - tracks.list(-(tracks.start * meter + position[0] - i) / meter) * meter + position[1]);
            }
        }
    }else{
        if(spring.x < 0){
            ctx.moveTo(0, canvas.height - spring.y * meter / 2 + position[1]);
        }else{
            ctx.moveTo(spring.x * meter + position[0], canvas.height - spring.y * meter / 2 + position[1]);
        }
        ctx.lineTo(tracks.start * meter + position[0], canvas.height - spring.y * meter / 2 + position[1]);
        for(let i = tracks.start * meter + position[0]; i <= canvas.width; i++){
            if(canvas.height - spring.y * meter / 2 - tracks.list(-(tracks.start * meter + position[0] - i) / meter) * meter + position[1] >= 0){
                ctx.lineTo(i, canvas.height - spring.y * meter / 2 - tracks.list(-(tracks.start * meter + position[0] - i) / meter) * meter + position[1]);
            }
        }
    }
    ctx.stroke();

    ctx.fillRect(spring.x * meter + position[0], canvas.height - spring.y * meter + position[1], spring.width * meter, spring.height * meter);

    if(timer){
        if(marble.x < tracks.start){
            if(marble.x - marble.radius <= spring.x + spring.width){
                marble.velocity = Math.pow(spring.energy * 2 / marble.mass, 1/2);
                marble.x = marble.radius + spring.x + spring.width
            }
            marble.x += marble.velocity / fps * speed;
            if(marble.x > tracks.start){
                marble.velocity -= gravity / fps * Math.sin(Math.atan(tracks.derivative(marble.x - tracks.start))) * speed;
                marble.x += Math.cos(Math.atan(tracks.derivative(marble.x - tracks.start))) * marble.velocity / fps * speed;
                marble.y = tracks.list(marble.x - tracks.start) + spring.height / 2;
            }
        }else{//속도를 50만큼 나눠야함
            //-g * t * sin(θ)
            marble.velocity -= gravity / fps * Math.sin(Math.atan(tracks.derivative(marble.x - tracks.start))) * speed;
            marble.x += Math.cos(Math.atan(tracks.derivative(marble.x - tracks.start))) * marble.velocity / fps * speed;
            marble.y = tracks.list(marble.x - tracks.start) + spring.height / 2;
            if(marble.x < tracks.start){
                tracks.start - marble.x
                marble.y = spring.y - spring.height / 2;
                if(marble.x - marble.radius <= spring.x + spring.width){
                    // marble.velocity = velocity;
                    marble.x = marble.radius + spring.x + spring.width
                }
            }
        }
        y.unshift(marble.y);
        ke.unshift(marble.mass * Math.pow(marble.velocity, 2) / 2);
        pe.unshift(marble.mass * gravity * marble.y);
        de.unshift(marble.mass * (Math.pow(marble.velocity, 2) / 2 + gravity * marble.y));
    }
    document.getElementById('x-coordinate').value = marble.x;
    document.getElementById('y-coordinate').value = marble.y;
    if(maximum < marble.y){
        maximum = marble.y;
        document.getElementById('maximum-height').value = maximum;
    }
    document.getElementById('velocity').value = marble.velocity;
    document.getElementById('kinetic-energy').value = marble.mass * Math.pow(marble.velocity, 2) / 2;
    document.getElementById('potential-energy').value = marble.mass * gravity * marble.y;
    document.getElementById('dynamics-energy').value = marble.mass * (Math.pow(marble.velocity, 2) / 2 + gravity * marble.y);
    ctx.beginPath();
    ctx.arc(marble.x * meter + position[0], canvas.height - marble.y * meter + position[1], marble.radius * meter, 0, Math.PI * 2, true);
    ctx.fill();

    context.clearRect(0, 0, graph.width, graph.height);

    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(0, graph.height / 2);
    context.lineTo(graph.width, graph.height / 2);
    context.stroke();
    
    context.strokeStyle = 'blue';
    context.beginPath();
    context.moveTo(0, graph.height / 2 - maximum * 10);
    context.lineTo(graph.width, graph.height / 2 - maximum * 10);
    context.stroke();
    
    context.strokeStyle = 'red';
    context.beginPath();
    for(let i = 0; i < y.length; i++){
        context.lineTo(graph.width / 2 - i, graph.height / 2 - y[i] * 10);
    }
    context.stroke();
    
    context.strokeStyle = 'red';
    context.beginPath();
    for(let i = 0; i < y.length; i++){
        context.lineTo(graph.width / 2 - i, graph.height / 2 + ke[i]);
    }
    context.stroke();
    context.strokeStyle = 'blue';
    context.beginPath();
    for(let i = 0; i < y.length; i++){
        context.lineTo(graph.width / 2 - i, graph.height / 2 + pe[i]);
    }
    context.stroke();
    context.strokeStyle = 'green';
    context.beginPath();
    for(let i = 0; i < y.length; i++){
        context.lineTo(graph.width / 2 - i, graph.height / 2 + de[i]);
    }
    context.stroke();
}
let repeater = setInterval(repeat, 1000 / fps);
//(fps)ms