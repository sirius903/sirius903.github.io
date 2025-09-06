import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, query, collection, doc, onSnapshot, addDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjD6Ibas2Gu3pkNz1DQL1yYJg0xGj53kQ",
    authDomain: "code-repository-56a0f.firebaseapp.com",
    projectId: "code-repository-56a0f",
    storageBucket: "code-repository-56a0f.appspot.com",
    messagingSenderId: "1011659196301",
    appId: "1:1011659196301:web:9960a6ff54cee8f955dfc4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let sort = 'old';
let list = [];
let page = window.location.hash.slice(1);
page = page == '' ? 1 : parseInt(page);

document.getElementById("sort").addEventListener("change", function(){
    sort = this.value;
    changeCodes(page);
})

document.getElementById("form").addEventListener("submit", function(){
    let value = this.querySelector("#input").value;
    if(value == ''){
        window.location.href = '?';
    }else{
        window.location.hash = '';
        window.location.search = this.querySelector("#input").value;
    }
})

onSnapshot(collection(db, "CODE"), (qas) => {
    list = [];
    qas.forEach((doc) => {
        if(doc.data().a != ''){
            list.push([doc.data().name, doc.data().code, doc.data().date.toDate()]);
        }
    })
    changeCodes(page);
})

function changeCodes(n){
    let search = decodeURIComponent(window.location.search).toLowerCase().split('').filter(x => x != ' ' && x != '?');
    if(search != ''){
        document.getElementById("answer").innerText = "'" + decodeURIComponent(window.location.search).slice(1) + "'의 검색결과 :";
        document.getElementById("answer").classList.add("active");
        list = list.filter(function(a){
            let title = a[0].split(' ').join('');
            let answer = true;
            search.forEach((x, y) => {
                if(y + 1 != search.length){
                    title = title.split(x).slice(1).join(x);
                }else{
                    if(!title.includes(x)) answer = false;
                }
            })
            return answer;
        })
    }

    list.sort(function(a, b){
        if(sort == 'old'){
            return a[2] - b[2];
        }else if(sort == 'new'){
            return b[2] - a[2];
        }else if(sort == 'atoz'){
            return a[0].localeCompare(b[0]);
        }else if(sort == 'ztoa'){
            return b[0].localeCompare(a[0]);
        }
    })
    document.getElementById("pages").innerHTML = '';
    for(let i = 1; i <= Math.ceil(list.length / 15); i++){
        document.getElementById("pages").innerHTML += `<a class="page" href="#${i}">${i}</a>`;
    }
    document.querySelector("#codes").innerHTML = '';
    list.slice(15 * (n - 1), 15 * n).forEach(a => {
        
        let bytes = a[1] == '' ? 0 : a[1].split('').map(x => [127, 2047, 65535].filter(y => y <= x.charCodeAt()).length + 1).reduce((a,b) => (a+b));
        if(bytes == 0){
            bytes = '0 Bytes';
        }else{
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            bytes = parseFloat((bytes / Math.pow(1024, i)).toFixed(3)) + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i];
        }
        

        document.querySelector("#codes").innerHTML += `
        <div class="code">
          <h3 class="code-title">${a[0] + '(' + a[2].getFullYear() + '.' + String(a[2].getMonth() + 1).padStart(2, "0") + '.' + String(a[2].getDate()).padStart(2, "0") + ') - '}<strong class="data">${bytes}</strong></h3>
          <textarea spellcheck="false" class="code-text" onclick="this.select();document.execCommand('copy');alert('클립보드에 복사 되었습니다.');return false;" autocapitalize="off" autocomplete="off">${decodeURIComponent(atob(a[1]))}</textarea>
          <button class="code-toggle">
            <i class="fas code-chevron-down"></i>
            <i class="fas code-times"></i>
          </button>
        </div>`;
    })
    const toggles = document.querySelectorAll(".code-toggle");
    
    toggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            toggle.parentNode.classList.toggle("active");
        });
    });
    document.querySelectorAll('.page').forEach((x, y) => {
        if(y == page - 1){
            x.classList.add("active");
        }else{
            x.classList.remove("active");
        }
    })
}

window.addEventListener("hashchange", function(){
    page = window.location.hash.slice(1);
    page = page == '' ? 1 : parseInt(page);
    changeCodes(page);
})

document.getElementById("save").addEventListener("click", async function(){
    const name = document.getElementById("name");
    const code = document.getElementById("code");
    await addDoc(collection(db, "CODE"), {
        name : name.value,
        code : window.btoa(encodeURIComponent(code.value)),
        date : new Date
    })
    name.value = '';
    code.value = '';
    alert("저장 완료");
})

document.getElementById("to-save").addEventListener("click", function(){
    document.getElementById("name").focus();
})