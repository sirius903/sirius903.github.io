import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, query, collection, getDocs, getDoc, addDoc, setDoc, doc, deleteDoc , onSnapshot, initializeFirestore, memoryLocalCache } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { getDatabase, ref, child, set, get, onValue, onDisconnect, serverTimestamp, off } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';

let admin = false;

const firebaseConfig = {
    apiKey: "AIzaSyC5pzJghuZzUE_nXfmxNTMt6gVzTyFoacQ",
    authDomain: "holdem-83e64.firebaseapp.com",
    databaseURL: "https://holdem-83e64-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "holdem-83e64",
    storageBucket: "holdem-83e64.appspot.com",
    messagingSenderId: "178433789946",
    appId: "1:178433789946:web:4be2ea34acc93d9e6f9e43"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

document.getElementById("login-btn").addEventListener("click", function(){
    if(true){
        signInAnonymously(auth).then((user) => {
            updateProfile(user.user, {
                displayName : document.getElementById("id-input").value
            })
            const statusRef = ref(database, 'Users/' + user.user.uid + '/status');
            set(statusRef, 'online');
            onValue(ref(database, '.info/connected'), (snapshot) => {
                if(snapshot.val() === true){
                    set(statusRef, 'online');
                    set(ref(database, 'Users/' + user.user.uid + '/id'), document.getElementById("id-input").value);
                    set(ref(database, 'Users/' + user.user.uid + '/uid'), user.user.uid);
                    set(ref(database, 'Users/' + user.user.uid + '/gaming'), false);
                    onDisconnect(statusRef).set('offline');
                    onDisconnect(ref(database, 'Users/' + user.user.uid + '/lastOnine')).set(serverTimestamp());
                    document.getElementById("login-div").style.display = 'none';
                    alert("You're logged in!");
                    run();
                };
            });
        });
    }
})


function run(){
    if(window.location.hash == '#admin') admin = true;
    document.getElementById("users").innerHTML = '';

    document.getElementById("start").addEventListener("click", function(){
        let card = new Array(13).fill(1).map((x, y) => {
            if(y == 0 || (y <= 12 && y >= 10)){
                return ['A', 'J', 'Q', 'K'][y % 9];
            }else{
                return y + 1;
            }
        });
        let cards = [];
        ['♠', '♥', '♦', '♣'].forEach((a, i) => {
            cards.push(card.map(x => Object({
                name : a + x,
                type : a,
                number : x
            })));
        })
        cards = cards.flat();
        shuffle(cards);
        let show = cards.splice(0, 5);
        set(ref(database, 'Cards/show'), show);
        get(child(ref(database), 'Users')).then((snapshot) => {
            let users = Object.values(snapshot.val());
            users.forEach(a => {
                if(a.status == 'online'){
                    a.gaming = true;
                    set(ref(database, 'Users/' + a.uid + '/card'), cards.splice(0, 2));
                    document.getElementById('users').innerHTML += `
                    <div>Gyuwon</div>
        <div></div>`
                }else{
                    a.gaming = false;
                }
            })
        })
        set(ref(database, 'Cards/cards'), cards);
    })
}





// let cards1 = [];
// let abandon1 = [];
// let cards2 = [];
// let abandon2 = [];
// let cards3 = [];
// let abandon3 = [];

// load();

// let turn = 0;

// button.addEventListener("click", function(){
//     draw(turn % 3);
//     turn++;
//     load();
// })

// for(let i = 0; i < 13; i++){
//     for(let j = 0; j < 3; j++){
//         draw(j);
//         load();
//     }
// }

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// function draw(n){
//     [cards1, cards2, cards3][n].push(cards.splice(Math.floor(Math.random() * cards.length) , 1)[0]);
// }

// function load() {
//     deck.innerText = 'Deck : ' + cards.map(x => x.name).join(', ');
//     player1.innerHTML = 'Player1 : <p class="card">' + cards1.map(x => x.name).join(', </p><p class="card">') + '</p> [' + cards1.length + '장]';
//     player2.innerHTML = 'Player1 : <p class="card">' + cards2.map(x => x.name).join(', </p><p class="card">') + '</p> [' + cards2.length + '장]';
//     player3.innerHTML = 'Player1 : <p class="card">' + cards3.map(x => x.name).join(', </p><p class="card">') + '</p> [' + cards3.length + '장]';
// }

// document.querySelectorAll('.card').forEach(c => {
//     c.addEventListener("click", function(){
//         alert(this.innerText);
//     })
// })