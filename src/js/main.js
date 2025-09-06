window.onload = function(){
    fetch('src/json/shortcut.json').then(response => response.json()).then(x => {
        let arr = x;
        document.getElementById("ex").innerHTML = '';
        x.e.forEach((a, i) => {
            document.getElementById("ex").innerHTML += `
          <a class="cut" href="${a.src}">
            <img src="${a.img == '' ? 'src/images/logo.svg' : a.img}">
            <p>${a.title}</p>
          </a>`;
        })
        console.log(x.e);
    }).catch(error => console.error(error));
}