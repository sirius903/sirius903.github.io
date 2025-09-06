import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, query, collection, doc, onSnapshot, addDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPOzJfWCcP3dnM0MImNGv5bWM_QBdNOrc",
  authDomain: "beomeo-2024-code.firebaseapp.com",
  projectId: "beomeo-2024-code",
  storageBucket: "beomeo-2024-code.appspot.com",
  messagingSenderId: "960631603446",
  appId: "1:960631603446:web:ae52b96d338d275b84ecd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


onSnapshot(collection(db, "FAQ"), (qas) => {
    let list = [];
    qas.forEach((doc) => {
        if(doc.data().a != ''){
            list.push([doc.data().q, doc.data().a]);
        }
    })
    document.querySelector(".faq-container").innerHTML = '';
    list.forEach(a => {
        document.querySelector(".faq-container").innerHTML += `
        <div class="faq">
          <h3 class="faq-title">${a[0]}</h3>
          <p class="faq-text">${a[1]}</p>
          <button class="faq-toggle">
            <i class="fas fa-chevron-down"></i>
            <i class="fas fa-times"></i>
          </button>
        </div>`;
    })
    const toggles = document.querySelectorAll(".faq-toggle");
    
    toggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            toggle.parentNode.classList.toggle("active");
        });
    });
})

document.getElementById("faq-submit").addEventListener("click", async function(){
    const input = document.getElementById("faq-input");
    // console.log(input.value);
    await addDoc(collection(db, "FAQ"), {
        q : input.value,
        a : ''
    })
    input.value = '';
    alert("문의 완료");
})

document.getElementById("app-btn").addEventListener("click", async function(){
    const classNumber = document.getElementById("app-class");
    const name = document.getElementById("app-name");
    const text = document.getElementById("app-text");
    const date = new Date;
    if(classNumber.value == '' || name.value == '' || text.value == ''){
        alert("이름이나 학번이 모두 기입되지 않았습니다.");
    }else{
        await setDoc(doc(db, "Application", classNumber.value), {
            class : classNumber.value,
            name : name.value,
            text : text.value,
            date : date,
            boolean : false
        });
    
        classNumber.value = '';
        name.value = '';
        text.value = `[코드 가입 신청]
`;
        alert("신청 완료");
    }

})

const password = '95582e1021cd7ebc39cc552519680686084b3bfea5dbfa15c05503150004d9cd';

document.getElementById("dev-btn").addEventListener("click", function(){
    operater(prompt('비밀번호'));
});

function operater(x){
    if(sha256(x ?? '') == password){
        onSnapshot(collection(db, "Application"), (app) => {
            let list = [];
            app.forEach((doc) => {
                if(doc.data().a != ''){
                    list.push([doc.data().class, doc.data().name, doc.data().text, doc.data().date, doc.data().boolean]);
                }
            })
            document.getElementById("op").innerHTML = '';
            list.sort((a, b) => a[3].seconds - b[3].seconds);
            list.forEach(a => {
                document.getElementById("op").innerHTML += `
                <div class="apper">
                 <div class="학번">${a[0]} ${a[1]}</div>
                 <div>${a[2].split('[코드 가입 신청]').join('')}</div>
                 <div>${a[3].seconds}.${a[3].nanoseconds}</div>
                 <div class="boolean ${a[4]}">${a[4]}</div>
                </div>`;
            })

            document.querySelectorAll('.boolean').forEach((a, i) => {
                a.addEventListener("click", async function(){
                    if(a.innerText == 'true' || a.innerText == 'false'){
                        await updateDoc(doc(db, "Application", document.querySelectorAll(".학번")[i].innerText.split(' ')[0]), {
                            boolean : !JSON.parse(a.innerText)
                        });
                    }else{
                        await updateDoc(doc(db, "Application", document.querySelectorAll(".학번")[i].innerText.split(' ')[0]), {
                            boolean : false
                        });
                    }
                })
            })
        })
        alert("관리자 전환 완료.");
    }else{
        alert("옳바르지 않은 비밀번호입니다.");
    }
}

onSnapshot(collection(db, "Application"), (app) => {
    let list = [];
    app.forEach((doc) => {
        list.push(1);
    })
    document.getElementById("퍼큐").innerText = `(${list.length}/35)`;
})