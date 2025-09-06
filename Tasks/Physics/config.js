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
var time = 0;
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
    location.reload();
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
        case 13:
            planet.radius = v;
            break;
        case 14:
            planet.mass = v;
            break;
        case 15:
            satellite.radius = v;
            break;
        case 16:
            satellite.mass = v;
            break;
        case 17:
            satellite.x = v;
            break;
        case 18:
            satellite.y = v;
            break;
        case 19:
            satellite.velocity[0] = v;
            break;
        case 20:
            satellite.velocity[1] = v;
            break;
        case 21:
            pivot.x = v;
            break;
        case 22:
            pivot.y = v;
            break;
        case 23:
            pivot.radius = v;
            break;
        case 24:
            pendulum.angle = v / 180 * Math.PI;
            break;
        case 25:
            pendulum.radius = v;
            break;
        case 26:
            pendulum.mass = v;
            break;
        case 27:
            pendulum.velocity = v;
            break;
        case 28:
            waves[j].amplitude = v;
            break;
        case 29:
            waves[j].wavelength = v;
            break;
        case 30:
            waves[j].period = v;
            break;
        case 31:
            floater.radius = v;
            break;
    }
    let id = ['gravity-input', 'spring-width', 'spring-height', 'spring-energy', 'marble-radius', 'marble-mass', 'track-start', false, 'ground-height', 'apple-radius-' + j, 'apple-mass-' + j, 'apple-hv-' + j, 'apple-vv-' + j, 'planet-radius', 'planet-mass', 'satellite-radius', 'satellite-mass', 'satellite-ix', 'satellite-iy', 'satellite-hv', 'satellite-vv', 'pivot-x', 'pivot-y', 'string-length', 'pendulum-angle', 'pendulum-radius', 'pendulum-mass', 'pendulum-velocity'][n];
    if(id) document.getElementById(id).value = i;
}

var gravity = 9.8;// m/s^2
var velocity = 10;// m/s
var maximum = 0;//m
var minimum = Infinity;//m

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
var planet = {
    radius : 2,
    mass : 100000000
};
var satellite = {
    radius : 0.3,
    mass : 100000,
    x : 0,
    y : 3,
    velocity : [15, 0]
};
var pivot = {
    x : 0,
    y : 7,
    radius : 2.5
};
var pendulum = {
    angle : Math.PI / 4,
    radius : 0.25,
    mass : 1,
    velocity : 0
};
var waves = [{
    amplitude : 1,//진폭
    wavelength : 4,//파장(람다)
    period : 1
}];
var floater = {
    y : 0,
    radius : 0.25
}
function object(){
    marble.x = 1.25;
    marble.y = 0.5;
    marble.velocity = 0;
    apples.forEach((a, i) => {
        a.x = 1;
        a.y = 8;
        if(document.getElementById('apple-hv-0')) a.velocity = [parseFloat(document.getElementById('apple-hv-' + i).value), parseFloat(document.getElementById('apple-vv-' + i).value)]
    });
    if(document)
    if(document.getElementById('satellite-ix')){
        satellite.x = parseFloat(document.getElementById('satellite-ix').value);
        satellite.y = parseFloat(document.getElementById('satellite-iy').value);
        satellite.velocity = [parseFloat(document.getElementById('satellite-hv').value), parseFloat(document.getElementById('satellite-vv').value)];
    }
    if(document.getElementById('pendulum-angle')){
        pendulum.angle = parseFloat(document.getElementById('pendulum-angle').value) / 180 * Math.PI;
        pendulum.velocity = parseFloat(document.getElementById('pendulum-velocity').value);
    }
    if(document.getElementById('amplitude-0')){
        waves.forEach((a, i) => {
            a.amplitude = parseFloat(document.getElementById('amplitude-' + i).value);
            a.wavelength = parseFloat(document.getElementById('wavelength-' + i).value);
            a.period = parseFloat(document.getElementById('period-' + i).value);
        });
    }
    time = 0;
    floater.y = waves.map(x => x.amplitude * Math.sin(2 * Math.PI * (canvas.width / 2 / x.wavelength - (time) / x.period * meter) / meter)).reduce((a, b) => (a + b)) * meter;
}

if(document.getElementById('add-apple')) document.getElementById('add-apple').addEventListener("click", function(){
    let section = document.createElement('section');
    section.innerHTML = `
    <h1>${apples.length + 1 + ((apples.length >= 10 && apples.length <= 12) ? 'th' : apples.length % 10 == 0 ? 'st' : apples.length % 10 == 1 ? 'nd' : apples.length % 10 == 2 ? 'rd' : 'th')} Apple</h1>
    <form onsubmit="return false;">
     <label for="apple-radius-${apples.length}" title="The Radius of The Apple">Radius</label>
     <input type="number" placeholder="0.25" value="0.25" id="apple-radius-${apples.length}" min="0.01" max="1" step="0.01" onchange="change(9, this.value, ${apples.length});" title="Converts The Radius of The Apple(Default : 0.25)">
     <input type="reset" value="reset" onclick="change(9, 0.25, ${apples.length});" title="Resets The Radius(Default : 0.25)">
     <input type="submit" value="submit" onclick="change(9, document.getElementById('apple-radius-${apples.length}').value, ${apples.length});" title="The Radius Conversion Button"><br>
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
    document.querySelectorAll('.converts')[document.querySelectorAll('.converts').length - 1].before(section);
    apples.push({
        x : 1,
        y : 8,
        radius : 0.25,
        velocity : [2, 0],
        mass : 1,
        maximum : 0
    });
    apples_y.push([]);
});

if(document.getElementById('add-wave')) document.getElementById('add-wave').addEventListener("click", function(){
    let section = document.createElement('section');
    section.innerHTML = `
    <h1>${waves.length + 1 + ((waves.length >= 10 && waves.length <= 12) ? 'th' : waves.length % 10 == 0 ? 'st' : waves.length % 10 == 1 ? 'nd' : waves.length % 10 == 2 ? 'rd' : 'th')} Wave</h1>
    <form onsubmit="return false;">
     <label for="amplitude-${waves.length}" title="The Amplitude of The Wave">Amplitude</label>
     <input type="number" placeholder="1" value="1" id="amplitude-${waves.length}" min="-100" max="100" step="0.1" onchange="change(28, this.value, ${waves.length});" title="Converts The Amplitude of The Wave(Default : 1)">
     <input type="reset" value="reset" onclick="change(28, 1, ${waves.length})" title="Resets The Amplitude(Default : 1)">
     <input type="submit" value="submit" onclick="change(28, document.getElementById('amplitude-${waves.length}').value, ${waves.length});" title="The Amplitude Conversion Button">
    </form>
    <form onsubmit="return false;">
     <label for="wavelength-${waves.length}" title="The Wavelength of The Wave">Wavelength</label>
     <input type="number" placeholder="4" value="4" id="wavelength-${waves.length}" min="-100" max="100" step="0.1" onchange="change(29, this.value, ${waves.length});" title="Converts The Wavelength of The Wave(Default : 4)">
     <input type="reset" value="reset" onclick="change(29, 4, ${waves.length})" title="Resets The Wavelength(Default : 4)">
     <input type="submit" value="submit" onclick="change(29, document.getElementById('wavelength-${waves.length}').value, ${waves.length});" title="The Wavelength Conversion Button">
    </form>
    <form onsubmit="return false;">
     <label for="period-${waves.length}" title="The Period of The Wave">Period</label>
     <input type="number" placeholder="1" value="1" id="period-${waves.length}" min="-100" max="100" step="0.1" onchange="change(30, this.value, ${waves.length});" title="Converts The Period of The Wave(Default : 1)">
     <input type="reset" value="reset" onclick="change(30, 1, ${waves.length})" title="Resets The Period(Default : 1)">
     <input type="submit" value="submit" onclick="change(30, document.getElementById('period-${waves.length}').value, ${waves.length});" title="The Period Conversion Button">
    </form>`;
    document.querySelectorAll('.converts')[document.querySelectorAll('.converts').length - 2].before(section);
    waves.push({
        amplitude : 1,
        wavelength : 4,
        period : 1
    });
})