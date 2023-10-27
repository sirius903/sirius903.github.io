let canvas = document.getElementById('canvas');
let resizer = document.getElementById('resizer');
let configs = document.getElementById('configs');
let playbar = document.getElementById('playing-bar');

canvas.width = 1500 * canvas.getBoundingClientRect().width / canvas.getBoundingClientRect().height;

let x = 0;
let leftWidth = 0;
resizer.addEventListener("mousedown", function(e){
   x = e.clientX;
   leftWidth = canvas.getBoundingClientRect().width;
   document.addEventListener("mousemove", move);
   document.addEventListener("mouseup", up)
})

const move = function(e){
    const dx = e.clientX - x;
    
    document.body.style.cursor = 'col-resizer';
    
    canvas.style.userSelect = 'none';
    canvas.style.pointerEvents = 'none';
    
    configs.style.userSelect = 'none';
    configs.style.pointerEvents = 'none';

    canvas.width = 1500 * canvas.getBoundingClientRect().width / canvas.getBoundingClientRect().height;
    canvas.style.width = `${leftWidth + dx}px`;
    configs.style.width = `${document.body.getBoundingClientRect().width - 10 - leftWidth - dx}px`
}

const up = function(){
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    canvas.style.removeProperty('user-select');
    canvas.style.removeProperty('pointer-events');

    configs.style.removeProperty('user-select');
    configs.style.removeProperty('pointer-events');

    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
}

let cx = 0;
let cy = 0;
let position = [0, 0];
canvas.addEventListener("mousedown", function(e){
    cx = e.clientX;
    cy = e.clientY;
    document.addEventListener("mousemove", canvasMove);
    document.addEventListener("mouseup", canvasUp);
})
const canvasMove = function(e){
    document.body.style.cursor = 'move';

    playbar.style.userSelect = 'none';
    playbar.style.pointerEvents = 'none';
    
    resizer.style.userSelect = 'none';
    resizer.style.pointerEvents = 'none';
    
    configs.style.userSelect = 'none';
    configs.style.pointerEvents = 'none';

    position[0] += e.clientX - cx;
    position[1] += e.clientY - cy;
    cx = e.clientX;
    cy = e.clientY;
}
const canvasUp = function(){
    canvas.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    resizer.style.removeProperty('user-select');
    resizer.style.removeProperty('pointer-events');

    configs.style.removeProperty('user-select');
    configs.style.removeProperty('pointer-events');

    document.removeEventListener("mousemove", canvasMove);
    document.removeEventListener("mouseup", canvasUp);
}