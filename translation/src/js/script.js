document.getElementById("translate").addEventListener("click", function(){
    let txt = document.getElementById("to-translate").value;
    let txt2 = document.getElementById("translated2").value;
    
    // txt2 = txt.split("\n").filter(x => x.includes('=') && x[0] != '#' && !x.includes('"')).map(x => x.split('=')).filter(x => x[2] != '' && x != ' ');

    // txt2 = txt.split("\n").filter(x => x.includes('=') && x[0] != '#' && !x.includes('"')).map(x => x.split('=')).filter(x => x[2] != '' && x != ' ');
    // txt3 = txt.split("\n").filter(x => x.includes('=') && x[0] != '#' && !x.includes('"')).map(x => x.split('=')[0])
    // console.log(txt2);
    // txt2 = txt2.map(x => txt3.includes(x[0]));
    
    txt = txt.split("\n").filter(x => x.includes('=') && x[0] != '#').map(x => x.split('=')[0]).map(x => x[x.length - 1] == ' ' ? x.slice(0, -1) : x).map(x => x.includes('"') ? x.split('"').join('\\"') : x).map((x, y) => `{
        "key": "KEY_${!x.includes("'") ? x.toUpperCase().split(' ').join('-') : ('WONDER_' + x.toUpperCase().split(' ').join('-').slice(0, 5) + '_QUOTE')}",
        "original": "${x}",
        "translation": "",
        "context": ""
    }`).join(`,`);
        
//     txt = txt.split("\n").filter(x => x.includes('=') && x[0] != '#').join(`
// `);

    
    // txt = txt.split("\n").filter(x => x.includes('=') && x[0] != '#' && !x.includes('"')).map(x => x.split('=')[0]).map(x => x[x.length - 1] == ' ' ? x.slice(0, -1) : x).map((x, y) => `key - ${y},${x},`).join(`
// `);

    document.getElementById("translated").value = `[
    ${txt}
]`;
})

let array
fetch(`../Translation/Unciv/utf8/Buildings.json`, {
  headers: {
    'Accept': 'application/vnd.github.v3.raw' // 파일 내용을 그대로 가져오기 위해 raw 형식으로 요청
  }
}).then(response => response.json()).then(data => {
  console.log(Array.from(data));
  array = Array.from(data)
  array = array.map(x => x.original + ' = ' + x.translation);
  
  document.getElementById("translated").value = array.join(`
`);
  // console.log()
}).catch(error => {
  console.error('Error:', error);
});


// fetch(`https://raw.githubusercontent.com/yairm210/Unciv/master/android/assets/jsons/translations/template.properties`, {
//   headers: {
//     'Accept': 'application/vnd.github.v3.raw' // 파일 내용을 그대로 가져오기 위해 raw 형식으로 요청
//   }
// })
//   .then(response => response.text())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });