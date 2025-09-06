import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, deleteDoc , onSnapshot, initializeFirestore, memoryLocalCache } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { getDatabase, ref, child, set, get, onValue, onDisconnect, serverTimestamp, off } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDdDEDKiB3BhkHulfzvA9KfFhAWHXRk89w",
  authDomain: "blackcyan-bffc2.firebaseapp.com",
  databaseURL: "https://blackcyan-bffc2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blackcyan-bffc2",
  storageBucket: "blackcyan-bffc2.appspot.com",
  messagingSenderId: "352934571969",
  appId: "1:352934571969:web:b8f28e725aba689d394940"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

/**
 * @name 로그인 함수
 * @param {String} email 이메일
 * @param {string} password 비밀번호
 * @description 이메일과 비밀번호로 로그인하는 함수
 */
const login = function(email, password){
  //firebase 로그인 함수
  signInWithEmailAndPassword(auth, email, password).then((user) => {
    /**
     * @type {String}
     * @description 유저 uid를 불러오는 변수
     */
    const uid = user.user.uid;
    /**
     * @description 유저의 상태를 저장하는 레퍼런스
     */
    const statusRef = ref(database, 'Users/' + uid + '/status');
    //유저 상태를 온라인으로 지정
    set(statusRef, 'online');
    //유저 상태가 바뀔 때마다 작동하는 함수
    onValue(ref(database, '.info/connected'), (snapshot) => {
      //온라인이면
      if(snapshot.val() === true){
        //저장된 상태를 온라인으로 전환
        set(statusRef, 'online');
        //오프라인으로 바뀔 시 저장된 상태를 오프라인으로 전환
        onDisconnect(statusRef).set('offline');
        //오프라인으로 바뀔 시 마지막 접속 시간을 저장
        onDisconnect(ref(database, 'Users/' + uid + '/lastOnine')).set(serverTimestamp());
      };
    });
    load(uid);
    //오류 발견 시
  }).catch((error) => {
    console.log(error.code);
    console.log(error.message);
  });
}

/**
 * @description 무작위 문자열을 뽑는 함수
 * @param {Number} n 문자열의 길이
 * @returns {String} 무작위 문자열
 */
function randomStr(n){
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let answer = '';
  for(let i = 0; i < n; i++){
    answer += chars[Math.floor(Math.random() * chars.length)];
  }
  return answer;
}

const guest = function(){
  signInAnonymously(auth).then((user) => {
    let id = 'Guest-000000';
    getIds().then(ids => {
      while(true){
        id = 'Guest-';
        id += randomStr(6);
        if(!ids.includes(id)) break;
      }
      setDoc(doc(db, "Users", user.user.uid), {
        id : id,
        email : 'guest'
      })
      set(ref(database, 'Users/' + user.user.uid), {
        displayName : id,
        email : 'guest',
        status : 'online',
        exp : 'guest',
        lastOnline : 0
      });
      onValue(ref(database, '.info/connected'), (snapshot) => {
        if (snapshot.val() === true){
          onDisconnect(statusRef).set('offline');
          set(statusRef, 'online');
          onDisconnect(ref(database, 'Users/' + user.user.uid + '/lastOnine')).set(serverTimestamp());
        }
      });
      connect();
    }).catch((error) =>{
      console.log(error.code);
      console.log(error.message);
    })  
}).catch((error) => {
    console.log(error.message);
  })
}

/**
 * @name 회원가입 함수
 * @param {String} email 이메일
 * @param {String} password 비밀번호
 * @param {String} id 아이디
 */
const signup = function(email, password, id){
  //글자 20제한 특수 기호 제한
  createUserWithEmailAndPassword(auth, email, password).then((user) => {
    const uid = user.user.uid;
    setDoc(doc(db, "Users", uid), {
      email : email,
      password : password,
      id : id,
      message : []
    });
    addDoc(doc(db, "Ids", id), {});
    set(ref(database, 'Users/' + uid), {
      id : id,
      status : 'online',
      exp : 0,
      lastOnline : 0,
      room : "",
    });
    set(ref(database, 'Users/' + uid + '/whisper'), {
      id : "",
      message : ""
    });
    onDisconnect(ref(database, 'Users/' + uid + '/status')).set('offline');
    load(uid);
  }).catch((error) => {
    console.log(error.code);
    console.log(error.message);
    document.getElementById('signup-error').innerText = error.code;
    document.getElementById('signup-error').className = 'entry-error error';
  })
}

async function getIds(){
  const ids = await getDocs(collection(db, "Ids"));
  return ids.docs.map((doc) => doc.id);
}

/**
 * @name 데이터를 불러오는 함수
 * @param {String} uid 유저의 uid
 */
function load(uid){
  //자신의 프로필 가져오기
  onValue(ref(database, 'Users/' + uid), (snapshot) => {
    const data = snapshot.val();
    //유저 아이디 표시
    document.getElementById('my-id').replaceChildren(data.id);
    //게스트인지 확인 및 유저 레벨 표시
    document.getElementById('my-level').replaceChildren(data.exp == 'guest' ? 'Guest' : 'Lv. ' + data.exp);
  });
  //모든 유저 데이터 불러오기
  onValue(ref(database, 'Users'), (snapshot) => {
    const data = snapshot.val();
    /**
     * @type {Array}
     * @description 오프라인인 유저들을 제외하고 저장하는 변수
     */
    const players = Object.keys(data).map(i => data[i]).filter(x => x.status != 'offline');
    //표시 중인 유저 리스트 초기화
    document.getElementById('players-list').replaceChildren('');
    //표시할 유저 수 만큼 반복
    players.forEach(a => {
      let player = document.createElement('div');
      player.className = 'player';
      player.innerHTML = `<div class="player-level">${a.exp == 'guest' ? 'Guest' : 'Lv. ' + a.exp}</div>
      <div class="player-id">${a.id}</div>
      <div class="player-status ${a.status}" title="${a.status}">●</div>`;
      //유저 표시
      document.getElementById('players-list').append(player);
    });
    //유저 수 표시
    document.getElementById('players-number').innerText = `(${players.length} / 100)`;
  });
  //'자리 비움'인지 확인
  document.addEventListener("visibilitychange", () => {
    //'자리 비움'일 시
    if(document.hidden){
      //저장 중인 상태를 자리 비움으로 전환
      set(ref(database, 'Users/' + uid + '/status'), 'away');
    }else{
      //저장 중인 상태를 온라인으로 전환
      set(ref(database, 'Users/' + uid + '/status'), 'online');
    };
  });
  //메인 메뉴를 숨기고 대기 화면을 불러옴
  document.querySelector('.main-menu').className = 'main-menu container hidden';
  document.querySelector('.list').className = 'list container scroller';
  //공개중인 방 목록을 불러옴
  onValue(ref(database, 'Rooms/Public'), (snapshot) => {
    /**
     * @type {Array}
     * @description 불러온 데이터를 배열로 변환하여 저장하는 변수
     */
    let rooms = Object.keys(snapshot.val()).map(i => snapshot.val()[i]);
    //표시 중인 방 목록을 초기화
    document.getElementById('rooms').innerHTML = '';
    //New Room 버튼 제작
    var add_item = document.createElement('div');
    add_item.className = 'rooms_item add_btn';
    add_item.innerHTML = '<div id="text">New Room</div>';
    //New Room 버튼 클릭시 작동
    add_item.addEventListener("click", ()=>{
      //방 생성
      create(uid);
    });
    //New Room 버튼 추가
    document.getElementById('rooms').append(add_item);
    //방 갯수 만큼 반복
    rooms.forEach(a => {
      let item = document.createElement('div');
      item.className = 'rooms_item';
      item.innerHTML = `<div class="rooms-title">${a.title}</div><div class="rooms-limit">${a.players + ' / ' + a.limit}</div>`;
      item.addEventListener("click", () => {enter(uid, a.id);});
      //방 표시
      document.getElementById('rooms').append(item);
    });
  });
  //채팅 불러옴
  onValue(ref(database, 'Chats/Main'), (snapshot) => {
    let chat = snapshot.val();
    if(chat.message != ''){
      let room_chat = document.getElementById('full-chat');
      //스크롤 하단으로 내릴 지 여부
      let scroll = true;
      if(room_chat.scrollTop + room_chat.clientHeight + 5 < room_chat.scrollHeight) scroll = false;
      let div = document.createElement('div');
      let h1 = document.createElement('h1');
      let p = document.createElement('p');
      h1.innerText = chat.id;
      p.innerText = chat.message;
      div.className = 'chat-message';
      h1.className = 'chat-tag';
      div.append(h1);
      div.append(p);
      room_chat.append(div);
      //스크롤 최하단으로 내림
      if(scroll) room_chat.scrollTop = room_chat.scrollHeight;
      set(ref(database, 'Chats/Main/message'), '');
    };
  });
  //채팅 입력 시
  document.getElementById('full-chat-input').addEventListener("keypress", function(e){
    if(e.code === 'Enter'){
      //데이터베이스에 채팅 정보 저장
      set(ref(database, 'Chats/Main'), {
        id : auth.currentUser.displayName,
        message : document.getElementById('full-chat-input').value
      });

      //todo firestore에 메시지 저장
      
      document.getElementById('full-chat-input').value = '';
    };
  });
};

/**
 * @name 방 제작 함수
 * @param {String} uid 유저의 uid
 * @description 방을 제작하는 화면을 보여주고 방을 제작한다.
 */
const create = function(uid){
  //유저 id를 불러옴
  get(child(ref(database), 'Users/' + uid + '/id')).then((snapshot) => {
    let id = snapshot.val();
    //방 기본 이름을 설정함
    document.getElementById('room_title').innerText = id + "'s Room";
    document.getElementById('room-title').value = id + "'s Room";
  });
  //방 목록을 숨기고 방 제작 화면을 보여줌
  document.querySelector('.rooms-list').className = 'rooms-list hidden';
  document.querySelector('.room').className = 'room';
  //방 제작 버튼 클릭 시
  document.getElementById('create-button').addEventListener("click", async function(){
    //기존 방 목록을 불러옴
    get(child(ref(database), 'Rooms/Public')).then((snapshot) => {
      /**
       * @type {Array}
       * @description 모든 방 id들을 배열로 저장함
       */
      let ids = Object.keys(snapshot.val()).map(i => snapshot.val()[i].id);
      var id = '';
      const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYNZ";
      while(true){
        //임시 id 제작
        id = alph[Math.floor(Math.random() * alph.length)] + alph[Math.floor(Math.random() * alph.length)] + alph[Math.floor(Math.random() * alph.length)] + alph[Math.floor(Math.random() * alph.length)]
        //id가 겹칠 시 다시 반복
        if(!ids.includes(id)) break;
      };
      //id에 맞춰 방을 제작
      set(ref(database, 'Rooms/Public/' + sha224(id)), {
        id : id,
        limit : parseInt(document.getElementById('room-limit').value),
        title : document.getElementById('room-title').value,
        manager : false,
        player1 : false,
        player2 : false,
        player3 : false,
        player4 : false,
        players : 0
      });
      set(ref(database, 'Chats/Public/' + sha224(id)), {
        id : '',
        message : ''
      })
      //방에 입장
      enter(uid, id);
    });
  });
};

/**
 * @name 방 참여 함수
 * @param {String} uid 유저 uid
 * @param {String} id 방 id
 * @description 방 id에 맞는 방에 유저를 참가 시킴
 */
const enter = function(uid, id){
  //방 데이터를 불러옴
  get(child(ref(database), 'Rooms/Public/' + sha224(id))).then((snapshot)=>{
    const data = snapshot.val();
    /**
     * @param {String} text 추가 레퍼런스 정보 기입
     * @returns 방에 대한 레퍼런스
     */
    function roomRef(text){return ref(database, 'Rooms/Public/' + sha224(id) + text);};
    //빈 자리가 있는 지 확인
    if(data.limit > data.players){
      let number;
      /**
       * @param {Number} n 어느 방에 들어갈지 정하는 변수
       * @description 자리에 유저를 넣는 함수
       */
      function change(n){
        set(roomRef('/player' + n), uid);
        number = n;
        //방장이 없을 시 유저를 방장으로 설정
        if(!data.manager){
          set(roomRef('/manager'), uid);
        }
      }
      //빈 자리에 들어감
      if(!data.player1){
        change(1);
      }else if(!data.player2){
        change(2);
      }else if(!data.player3){
        change(3);
      }else if(!data.player4){
        change(4);
      }
      //방 인원수 조정
      set(roomRef('/players'), data.players + 1);

      //
      set(ref(database, 'Users/' + uid + '/room'), sha224(id));
      onDisconnect(ref(database, 'Users/' + uid + '/room')).set('');

      //방에 표시되는 내용들 적용
      document.getElementById('room-players-title').className = '';
      document.getElementById('room_title').innerText = data.title;
      document.getElementById('room-title').value = data.title;
      document.getElementById('create-button').className = 'room-btn hidden';
      document.querySelector('.rooms-list').className = 'rooms-list hidden';
      document.querySelector('.room').className = 'room';

      document.getElementById('room-chat-box').className = 'settings';
      document.getElementById('room-chat-input').addEventListener("keypress", function(e){
        if(e.code === 'Enter'){
          set(ref(database, 'Chats/Public/' + sha224(id)), {
            id : auth.currentUser.displayName,
            message : document.getElementById('room-chat-input').value
          })
          //firestore에 메시지 저장
          document.getElementById('room-chat-input').value = '';
        }
      })
      onValue(ref(database, 'Chats/Public/' + sha224(id)), (snapshot) => {
        let chat = snapshot.val();
        if(chat.message != ''){
          let room_chat = document.getElementById('room-chat');
          let scroll = true;
          if(room_chat.scrollTop + room_chat.clientHeight + 5 < room_chat.scrollHeight) scroll = false;
          let div = document.createElement('div');
          let h1 = document.createElement('h1');
          let p = document.createElement('p');
          h1.innerText = chat.id;
          p.innerText = chat.message;
          div.className = 'chat-message';
          h1.className = 'chat-tag';
          div.append(h1);
          div.append(p);
          room_chat.append(div);
          if(scroll) room_chat.scrollTop = room_chat.scrollHeight;
          set(ref(database, 'Chats/Public/' + sha224(id) + '/message'), '');
        }
      })

      onValue(roomRef(''), (snapshot) => {
        const room = snapshot.val();
        onDisconnect(roomRef('')).cancel();
        document.getElementById('room-players').replaceChildren('');
        [room.player1, room.player2, room.player3, room.player4].forEach(a => {
          if(a){
            get(child(ref(database), 'Users/' + a)).then((b) => {
              let user = b.val()
              let player = document.createElement('div');
              player.className = 'room-player';
              player.innerHTML = `<img class="room-player-avatar" src="https://fastly.picsum.photos/id/251/250/250.jpg?hmac=_NUJeiKDfHVqhYGCW_85ojnjvg9ZWfHfMGppohybKyE">
              <div class="room-player-text">
                <div class="room-player-id">${user.id}</div>
                <div class="room-player-data">
                  <div class="room-player-level">Lv. ${user.exp}</div>
                  ${a == room.manager ? '<div class="room-player-host">Host</div>' : ''}
                </div>
              </div>`;
              document.getElementById('room-players').append(player);
            })
          }
        })
        document.getElementById('room-players-number').innerText = `(${room.players} / ${room.limit})`;
        document.getElementById('room_title').innerText = room.title;
        if(uid == room.manager){
          document.getElementById('room-configs').className = 'after';
          document.getElementById('change-button').className = 'room-btn';
          document.getElementById('start-button').className = 'room-btn' + (room.players > 1 ? ' active' : '');
          document.querySelectorAll('.config_item').forEach(a => {
            a.addEventListener("change", function(){
              document.getElementById('change-button').className = 'room-btn active';
            })
          })
          document.getElementById('change-button').addEventListener("click", function(){
            ['title', 'limit'].forEach(a => {
              set(roomRef('/' + a), document.getElementById('room-' + a).value);
            })
          })
          if(room.players > 1){
            document.getElementById('start-button').addEventListener("click", async function(){
              set(roomRef('/start'), true);
              let item = new Array(52);
              item.fill(1);
              item = item.map((x, i) => i + 1);
              item.sort(() => Math.random() - 0.5);
              let action = new Array(52);
              action.fill(1);
              action = action.map((x, i) => i + 1);
              action.sort(() => Math.random() - 0.5);
              await setDoc(doc(db, "Games", sha224(id)), {
                item : item,
                item1 : [],
                item2 : [],
                item3 : [],
                item4 : [],
                action : action,
                action1 : [],
                action2 : [],
                action3 : [],
                action4 : [],
                graveyard1 : [],
                graveyard2 : [],
                graveyard3 : [],
                graveyard4 : [],
              })
            })
          }
        }
        onDisconnect(roomRef('/players')).set(room.players - 1);
        onDisconnect(roomRef('/player' + number)).set(false);
        if(uid == room.manager){
          if(room.players > 1){
            if(room.player1 && room.player1 != room.manager){
              onDisconnect(roomRef('/manager')).set(room.player1);
            }else if(room.player2 && room.player2 != room.manager){
              onDisconnect(roomRef('/manager')).set(room.player2);
            }else if(room.player3 && room.player3 != room.manager){
              onDisconnect(roomRef('/manager')).set(room.player3);
            }else if(room.player4 && room.player4 != room.manager){
              onDisconnect(roomRef('/manager')).set(room.player4);
            }
          }else{
            onDisconnect(roomRef('')).remove();
          }
        }
        if(room.start){
          start(id, uid);
          off(roomRef(''));
        }
      });
    }else{
      alert('방 꽉 참');
    }
  })
  // set(ref(database, 'Rooms/Public/' + sha224(id) + '/players'))
}

const start = function(id, uid){
  onValue(ref(database, 'Rooms/Public/' + sha224(id)), (snapshot) => {
    const room = snapshot.val();
    document.querySelector('.list').className = 'list container scroller hidden';
    document.querySelector('.game').className = 'game container';
    let others = [room.player1, room.player2, room.player3, room.player4].filter(x => x != uid && x != false);
    if(others.length == 1){
      others.push(false);
      others.unshift(false);
    }else if(others.length == 2){
      others.splice(1, 0, false);
    }
    others.forEach((a, i) => {
      if(a){
        get(child(ref(database), 'Users/' + a)).then((data) => {
          let user = data.val();
          let player = document.getElementById('player' + (i + 1));
          player.querySelector('.profile-id').innerText = user.id;
        })
      }
    })
    get(child(ref(database), 'Users/' + uid)).then((data) => {
      let user = data.val();
      let my = document.getElementById('my-section');
      my.querySelector('.profile-id').innerText = user.id;
    })
  })
  onSnapshot(doc(db, "Games", sha224(id)), (doc) => {
    let data = doc.data();
    
    console.log(data);
  })
}

// function enter(id){
//   if(id === false){
//   }else{
//     get(child(ref(database), 'rooms/' + id)).then((snapshot)=>{
//       let room = snapshot.val();
//       document.getElementById('room-title').innerText = room.name;
//       document.getElementById('room-name').value = room.name;
//     });

//   }
//   document.querySelector('.rooms-list').className = 'rooms-list hidden';
//   document.querySelector('.room').className = 'room';
//   document.getElementById('create-button').addEventListener("click", async function(){
//     var ids = [];
//     var id = '';
//     const rooms = await getDocs(collection(db, "Rooms"));
//     rooms.forEach(a => {
//         ids.push(a.data().id);
//     })
//     const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYNZ"
//     while(true){
//       id = alph[Math.floor(Math.random() * alph.length)] + alph[Math.floor(Math.random() * alph.length)] + alph[Math.floor(Math.random() * alph.length)] + alph[Math.floor(Math.random() * alph.length)]
//       if(!ids.includes(id)){
//           break;
//       }
//     }
//     set(ref(database, 'user/' + auth.currentUser.uid + '/role'), 'owner')
//     set(ref(database, 'rooms/' + id), {
//       name : document.getElementById('room-name').value,
//       limit : document.getElementById('room-limit').value,
//       id : id,
//       owner : auth.currentUser.uid
//     })
//     onDisconnect(ref(database, 'rooms/' + id)).remove();
//   })
// }




export { login, signup, getIds };