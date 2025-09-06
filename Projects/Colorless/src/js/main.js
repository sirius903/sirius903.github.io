import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5pzJghuZzUE_nXfmxNTMt6gVzTyFoacQ",
  authDomain: "holdem-83e64.firebaseapp.com",
  databaseURL: "https://holdem-83e64-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "holdem-83e64",
  storageBucket: "holdem-83e64.appspot.com",
  messagingSenderId: "178433789946",
  appId: "1:178433789946:web:8b11249c35b35b9c6f9e43"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

document.getElementById("play").addEventListener("click", function(){
  // alert(document.getElementById("id").value)
  signInWithPopup(auth, provider)
  // .then((result) => {
  //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   const token = credential.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  //   console.log('user :\n', JSON.stringify(user, null, 2));  })
})


// signInWithRedirect(auth).then((result) => {
//     // This gives you a Google Access Token. You can use it to access Google APIs.
//   const credential = GoogleAuthProvider.credentialFromResult(result);
//   const token = credential.accessToken;

//   // The signed-in user info.
//   const user = result.user;
//   // IdP data available using getAdditionalUserInfo(result)
//   // ...
// }).catch((error) => {
//   // // Handle Errors here.
//   // const errorCode = error.code;
//   // const errorMessage = error.message;
//   // // The email of the user's account used.
//   // const email = error.customData.email;
//   // // The AuthCredential type that was used.
//   // const credential = GoogleAuthProvider.credentialFromError(error);
//   // // ...
// })