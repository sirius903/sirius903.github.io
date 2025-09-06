var ctx = canvas.getContext('2d');

floater.y = waves.map(x => x.amplitude * Math.sin(2 * Math.PI * (canvas.width / 2 / x.wavelength - (time) / x.period * meter) / meter)).reduce((a, b) => (a + b)) * meter;

function repeat(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    if(timer){
        time += speed / fps;
        floater.y = waves.map(x => x.amplitude * Math.sin(2 * Math.PI * (canvas.width / 2 / x.wavelength - (time) / x.period * meter) / meter)).reduce((a, b) => (a + b)) * meter;
    };

    document.getElementById('y-coordinate').value = floater.y;
    if(maximum < floater.y){
        maximum = floater.y;
        document.getElementById('maximum-height').value = maximum;
    }
    if(minimum > floater.y){
        minimum = floater.y;
        document.getElementById('minimum-height').value = minimum;
    }
    // document.getElementById('velocity').value = marble.velocity;
    // document.getElementById('kinetic-energy').value = marble.mass * Math.pow(marble.velocity, 2) / 2;
    // document.getElementById('potential-energy').value = marble.mass * gravity * marble.y;
    // document.getElementById('dynamics-energy').value = marble.mass * (Math.pow(marble.velocity, 2) / 2 + gravity * marble.y);
    ctx.beginPath();
    for(let i = 0; i <= canvas.width; i++){
        ctx.lineTo(i, canvas.height / 2 + waves.map(x => x.amplitude * Math.sin(2 * Math.PI * (i / x.wavelength - (time) / x.period * meter) / meter)).reduce((a, b) => (a + b)) * meter);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 + floater.y, floater.radius * meter, 0, Math.PI * 2, true);
    ctx.fill();
}
let repeater = setInterval(repeat, 1000 / fps);
//(fps)ms