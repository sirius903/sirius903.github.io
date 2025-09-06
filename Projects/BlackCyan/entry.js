import { login, signup, getIds } from './main.js';

//Log In, Sign Up 버튼
document.querySelectorAll('.to_entry').forEach((a, i) => {
    a.addEventListener("click", function(){
        document.getElementById('main-menu_btns').className = 'hidden';
        document.getElementById('exit_btn').className = '';
        document.getElementById('entry_section').className = '';
        document.getElementById('entry-background').className = 'background';
        document.getElementById('log-in_section').className = ['', 'hidden'][i];
        document.getElementById('sign-up_section').className = ['hidden', ''][i];
        document.getElementById(['log-in_email', 'sign-up_email'][i]).focus();
    })
});
//로그인 화면 숨기기
const hide_login = function(){
    document.getElementById('log-in_section').className = 'hidden';
    document.getElementById('log-in_email').value = '';
    document.getElementById('log-in_password').value = '';
};
//회원가입 화면 숨기기
const hide_signup = function(){
    document.getElementById('sign-up_section').className = 'hidden';
    document.getElementById('sign-up_email').value = '';
    document.getElementById('sign-up_password').value = '';
    document.getElementById('sign-up_id').value = '';
};
//Exit 버튼
document.getElementById('exit_btn').addEventListener("click", function(){
    document.getElementById('main-menu_btns').className = '';
    document.getElementById('exit_btn').className = 'hidden';
    document.getElementById('entry_section').className = 'hidden';
    document.getElementById('entry-background').className = 'background hidden';
    hide_login();
    hide_signup();
})
//Go to regist 버튼
document.getElementById('change_to_regist').addEventListener("click", function(){
    hide_login();
    document.getElementById('sign-up_section').className = '';
    document.getElementById('sign-up_email').focus();
})
//Go to log-in 버튼
document.getElementById('change_to_login').addEventListener("click", function(){
    hide_signup();
    document.getElementById('log-in_section').className = '';
    document.getElementById('log-in_email').focus();
})
//로그인 기능
document.getElementById('log-in_email').addEventListener("keydown", function(e){
    if(e.code === 'Enter'){
        document.getElementById('log-in_password').focus();
    }
})
document.getElementById('log-in_password').addEventListener("keydown", function(e){
    if(e.code === 'Enter'){
        login(document.getElementById('log-in_email').value, document.getElementById('log-in_password').value);
    }
})
document.getElementById('log-in').addEventListener("click", function(){
    login(document.getElementById('log-in_email').value, document.getElementById('log-in_password').value);
})
document.getElementById('guest').addEventListener("click", function(){
    // guest();
})

//회원가입 기능
document.getElementById('sign-up_email').addEventListener("keydown", function(e){
  if(e.code === 'Enter'){
    document.getElementById('sign-up_password').focus();
  }
})
document.getElementById('sign-up_password').addEventListener("keydown", function(e){
    if(e.code === 'Enter'){
        document.getElementById('sign-up_id').focus();
    }
})
document.getElementById('sign-up_id').addEventListener("change", function(){
    getIds().then(doc => {
        let message = 'Is available!';
        if(this.value === ''){
          message = 'Is blank!';
        }else if(doc.includes(this.value)){
          message = 'Duplicates!';
        }else if(this.value.length > 20){
            // 길어
        }else if(/*특수 문자*/false){
            //특수 문자 제외
        }
        if(message == 'Is available!'){
          document.getElementById('id-error').className = 'entry-error';
        }else{
          document.getElementById('id-error').className = 'entry-error error';
        }
        document.getElementById('id-error').replaceChildren(message);
    })
})
document.getElementById('sign-up_id').addEventListener("keydown", function(e){
    if(e.code === 'Enter'){
        if(document.getElementById('id-error').innerText == 'Is available!'){
            signup(document.getElementById('sign-up_email').value, document.getElementById('sign-up_password').value, document.getElementById('sign-up_id').value);
        }
    }
})
document.getElementById('sign-up').addEventListener("click", function(){
    if(document.getElementById('id-error').innerText == 'Is available!'){
        signup(document.getElementById('sign-up_email').value, document.getElementById('sign-up_password').value, document.getElementById('sign-up_id').value);
    }
})