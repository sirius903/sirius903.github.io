let sort = 'json';

document.getElementById("sort").addEventListener("change", function(){
  sort = this.value;
})

document.getElementById("translate").addEventListener("click", function(){
  let txt = document.getElementById("to-translate").value;
  let txt2 = document.getElementById("param").value;
  
  if(sort == 'json'){
    txt = txt.split("\n").filter(x => x.includes('=') && x[0] != '#').map(x => x.split('=')).map(x => [x[0][x[0].length - 1] == ' ' ? x[0].slice(0, -1) : x[0], x[1][0] == ' ' ? x[1].slice(1) : x[1]]).map(x => x.map(y => y.includes('"') ? y.split('"').join('\\"') : y)).map(x => `{
    "key": "${txt2.toUpperCase()}_${x[0].split(' ').join('-').split('\\N').join('')}",
    "original": "${x[0]}",
    "translation": "${x[1]}",
    "context": ""
  }`).join(`,`);
document.getElementById("translated").value = `[
  ${txt}
]`;
  }else if(sort == 'pro'){
    let src = ['Buildings.json', 'Cities.json', 'Tutorials.json', 'Nations.json', 'Units.json', 'Mods/Unciv Korean Translation.json'];
    let array = [];
    let n = 0;
    src.forEach(x => {
      fetch('../Unciv/utf8/' + x, {
        headers: {'Accept' : 'application/vnd.github.v3.raw'}
      }).then(response => response.json()).then(data => {
        array.push(Array.from(data).map(y => y.original + ' = ' + y.translation));
        n += 1;
        if(n == src.length){
          document.getElementById("translated").value = array.flat().join(`
`);
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    })
  }
})


fetch(`https://raw.githubusercontent.com/yairm210/Unciv/master/android/assets/jsons/translations/template.properties`, {
  headers: {'Accept': 'application/vnd.github.v3.raw'}
}).then(response => response.text()).then(data => {
  document.getElementById("templete").value = data;
}).catch(error => {
  console.error('Error:', error);
});
fetch(`https://raw.githubusercontent.com/yairm210/Unciv/master/android/assets/jsons/translations/Korean.properties`, {
  headers: {'Accept': 'application/vnd.github.v3.raw'}
}).then(response => response.text()).then(data => {
  document.getElementById("korean").value = data;
}).catch(error => {
  console.error('Error:', error);
});

