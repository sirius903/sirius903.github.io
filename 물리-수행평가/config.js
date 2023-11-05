var fps = 50;
document.getElementById('fps').addEventListener("change", function(){
    fps = this.value;
    clearInterval(repeater);
    repeater = setInterval(repeat, 1000 / fps);
});
var meter = 150;
document.getElementById('meter').addEventListener("change", function(){
    meter = parseInt(this.value);
});
var timer = false;
document.getElementById('reset').addEventListener("click", function(){
    timer = false;
    object();
})
document.getElementById('play').addEventListener("click", function(){
    timer = true;
})
document.getElementById('stop').addEventListener("click", function(){
    timer = false;
})
var speed = 1;
document.querySelectorAll('.speed').forEach((a, i) => {
    a.addEventListener("click", function(){
        switch (i){
            case 0:
                speed = 0.01;
                break;
            case 1:
                speed = 0.25;
                break;
            case 2:
                speed = 0.5;
                break;
            case 3:
                speed = 1;
                break;
            case 4:
                speed = 2;
                break;
            case 5:
                speed = 5;
                break;
        }
    })
})
document.getElementById('initialize').addEventListener("click", function(){
    timer = false;
    object();
    for(let i = 0; i < 8; i++){
        change(i, [9.8, 1, 1, 50, 0.25, 1, 3, 0][i]);
    }
    document.querySelectorAll('.track-type').forEach((a, i) => {
        a.checked = i == 0 ? true : false;
    })
})
document.getElementById('back-btn').addEventListener("click", function(){
    window.location.href = "../../"
})

function change(n, i, j){
    let v = parseFloat(i)
    switch(n){
        case 0:
            gravity = v;
            break;
        case 1:
            spring.width = v;
            break;
        case 2:
            spring.height = v;
            spring.y = v;
            break;
        case 3:
            spring.energy = v;
            break;
        case 4:
            marble.radius = v;
            break;
        case 5:
            marble.mass = v;
            break;
        case 6:
            tracks.start = v;
            break;
        case 7:
            tracks.type = v;
            break;
        case 8:
            ground.height = v;
            break;
        case 9:
            apples[j].radius = v;
            break
        case 10:
            apples[j].mass = v;
            break;
        case 11:
            apples[j].velocity[0] = v;
            break;
        case 12:
            apples[j].velocity[1] = v;
            break;
    }
    let id = ['gravity-input', 'spring-width', 'spring-height', 'spring-energy', 'marble-radius', 'marble-mass', 'track-start', false, 'ground-height', 'apple-radius-' + j, 'apple-mass-' + j, 'apple-hv-' + j, 'apple-vv-' + j][n];
    if(id) document.getElementById(id).value = i;
}

var gravity = 9.8;// m/s^2
var velocity = 10;// m/s
var maximum = 0;//m

var spring = {
    x : 0,
    y : 1,
    width : 1,
    height : 1,
    energy : 50,
    color : 'white'
}

var tracks = {
    start : 3,
    type : 0,
    list(x){
        return [x, Math.pow(x, 2), Math.pow(x, 0.5), Math.sin(x) * 2 + x][this.type];
    },
    derivative(x){
        return [1, 2 * x, 0.5 / Math.pow(x, 0.5), Math.cos(x) * 2 + 1][this.type];
    }
}
var marble = {
    x : 1.25,
    y : 0.5,
    radius : 0.25,
    velocity : 0,
    color : 'white',
    mass : 1 //kg
};
var apples = [{
    x : 1,
    y : 8,
    radius : 0.25,
    velocity : [2, 0],
    mass : 1,
    maximum : 0
}];
var ground = {
    height : 0.5
};
function object(){
    marble.x = 1.25;
    marble.y = 0.5;
    marble.velocity = 0;
    apples.forEach((a, i) => {
        a.x = 1;
        a.y = 8;
        a.velocity = [document.getElementById('apple-hv-' + i).value, document.getElementById('apple-vv-' + i).value]
    })
}

const add_apple = function(){document.getElementById('add-apple').addEventListener("click", function(){
    document.querySelectorAll('.converts')[document.querySelectorAll('.converts').length - 1].innerHTML = `
    <h1>${apples.length + 1 + ((apples.length >= 10 && apples.length <= 12) ? 'th' : apples.length % 10 == 0 ? 'st' : apples.length % 10 == 1 ? 'nd' : apples.length % 10 == 2 ? 'rd' : 'th')} Apple</h1>
    <form onsubmit="return false;">
     <label for="apple-radius-${apples.length}" title="The Radius of The Apple">Radius</label>
     <input type="number" placeholder="0.25" value="0.25" id="apple-radius-${apples.length}" min="0.01" max="1" step="0.01" onchange="change(9, this.value, ${apples.length});" title="Converts The Radius of The Apple(Default : 0.25)">
     <input type="reset" value="reset" onclick="change(9, 0.25, ${apples.length});" title="Resets The Radius(Default : 0.25)">
     <input type="submit" value="submit" onclick="change(9, document.getElementById('apple-radius-${apples.length});" title="The Radius Conversion Button"><br>
    </form>
    <form onsubmit="return false;">
     <label for="apple-mass-${apples.length}" title="The Mass of The Apple">Mass</label>
     <input type="number" placeholder="1" value="1" id="apple-mass-${apples.length}" min="0.1" max="100" step="0.1" onchange="change(10, this.value, ${apples.length});" title="Converts The Mass of The Apple(Default : 1)">
     <input type="reset" value="reset" onclick="change(10, 1, ${apples.length})" title="Resets The Mass(Default : 1)">
     <input type="submit" value="submit" onclick="v = change(10, document.getElementById('apple-mass-${apples.length}').value, ${apples.length});" title="The Mass Conversion Button"><br>
    </form>
    <form onsubmit="return false;">
     <label for="apple-hv-${apples.length}" title="The Horizontal Velocity of The Marble">Horizontal Velocity</label>
     <input type="number" placeholder="2" value="2" id="apple-hv-${apples.length}" min="0" max="100" step="0.1" onchange="change(11, this.value, ${apples.length});" title="Converts The Horizontal Velocity of The Apple(Default : 2)">
     <input type="reset" value="reset" onclick="change(11, 2, ${apples.length})" title="Resets The Horizontal Velocity(Default : 2)">
     <input type="submit" value="submit" onclick="v = change(11, document.getElementById('apple-hv-${apples.length}').value, ${apples.length});" title="The Horizontal Velocity Conversion Button"><br>
    </form>
    <form onsubmit="return false;">
     <label for="apple-vv-${apples.length}" title="The Vertical Velocity of The Marble">Vertical Velocity</label>
     <input type="number" placeholder="0" value="0" id="apple-vv-${apples.length}" min="0.1" max="100" step="0.1" onchange="change(12, this.value, ${apples.length});" title="Converts The Vertical Velocity of The Apple(Default : 0)">
     <input type="reset" value="reset" onclick="change(12, 0, ${apples.length})" title="Resets The Vertical Velocity(Default : 0)">
     <input type="submit" value="submit" onclick="v = change(12, document.getElementById('apple-vv-${apples.length}').value, ${apples.length});" title="The Vertical Apple Conversion Button"><br>
    </form>
    <form onsubmit="return false;">
     <label title="X-coordinate of The Apple">X-coordinate</label>
     <input type="number" value="1" id="apple-x-${apples.length}" title="X-coordinate of The Apple" disabled>
    </form>
    <form onsubmit="return false;">
     <label title="Y-coordinate of The Apple">Y-coordinate</label>
     <input type="number" value="8" id="apple-y-${apples.length}" title="Y-coordinate of The Apple" disabled>
    </form>
    <form onsubmit="return false;">
     <label title="Maximum Height of The Apple">Maximum Height</label>
     <input type="number" value="0.5" id="apple-maximum-${apples.length}" title="Maximum Height of The Apple" disabled>
     <input type="reset" value="reset" onclick="apple[0].maximum = 0;" title="Resets Maximum Height">
    </form>
    <form onsubmit="return false;">
     <label title="Horizontal Velocity of The Apple">Horizontal Velocity</label>
     <input type="number" value="0" id="apple-hvr-${apples.length}" title="Horizontal Velocity of The Apple" disabled>
    </form>
    <form onsubmit="return false;">
     <label title="Vertical Velocity of The Apple">Vertical Velocity</label>
     <input type="number" value="0" id="apple-vvr-${apples.length}" title="Vertical Velocity of The Apple" disabled>
    </form>
    <form onsubmit="return false;">
     <label title="Kinetic Energy of The Apple">Kinetic Energy</label>
     <input type="number" value="0" id="apple-ke-${apples.length}" title="Kinetic Energy of The Apple" disabled>
    </form>
    <form onsubmit="return false;">
     <label title="Potential Energy of The Apple">Potential Energy</label>
     <input type="number" value="0" id="apple-pe-${apples.length}" title="Potential Energy of The Apple" disabled>
    </form>
    <form onsubmit="return false;">
     <label title="Dynamics Energy of The Apple">Dynamics Energy</label>
     <input type="number" value="0" id="apple-de-${apples.length}" title="Dynamics Energy of The Apple" disabled>
    </form>`;
    let section = document.createElement('section');
    section.innerHTML = '<button id="add-apple">Add Apple</button>';
    section.className = 'converts';
    document.getElementById('configs').append(section);
    apples.push({
        x : 1,
        y : 8,
        radius : 0.25,
        velocity : [2, 0],
        mass : 1,
        maximum : 0
    });
    add_apple();
})}
add_apple();