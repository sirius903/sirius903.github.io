document.querySelectorAll(".main-btn").forEach((a, i) => {
    a.addEventListener("click", function(){
        switch (i) {
            case 0:
                document.getElementById('main-screen').classList.add('hidden');
                document.getElementById('level-screen').classList.remove('hidden');
                break;
            case 1:
                alert('level');
                break;
            default:
                alert('end');
                break;
        };
    });
});
document.querySelectorAll(".level-btn").forEach((a, i) => {
    a.addEventListener("click", function(){
        document.getElementById('level-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        switch (i) {
            case 0:
                break;
            case 1:
                break;
            default:
                break;
        };
    });
});