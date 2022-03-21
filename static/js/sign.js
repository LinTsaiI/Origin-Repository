let signBtn = document.getElementById('sign_btn');
let closeSignIn = document.getElementById('close_signin');
let closeSignUp = document.getElementById('close_signup');
let signInForm = document.getElementById('signin_form');
let signUpForm = document.getElementById('signup_form');
let switchSignUpBtn = document.getElementById('switch_signup');
let switchSignInBtn = document.getElementById('switch_signin');
let signInBtn = document.getElementById('signin_btn');
let signUpBtn = document.getElementById('signup_btn');
let signOutBtn = document.getElementById('signout');

// Model: 確認使用者登入狀況
function getUserStatus() {
  fetch('/api/user', { method: 'GET' })
    .then(response => response.json())
    .then(result => {
      let userData = result.data;
      if (userData) {
        signBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
      } else {
        signBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
      }
    })
}

// View: 顯示登入/註冊畫面
function showModal() {
  document.querySelector('.modal_background').style.display = 'block';
  signInForm.style.display = 'block';
}

// View: 隱藏登入/註冊畫面
function hideModal() {
  document.querySelector('.modal_background').style.display = 'none';
  if (signInForm.style.display == 'block') {
    signInForm.style.display = 'none';
    document.getElementById('signin_error').textContent = '';
    document.getElementById('signin_email').value = '';
    document.getElementById('signin_password').value = '';
  } else if (signUpForm.style.display == 'block') {
    signUpForm.style.display = 'none';
    document.getElementById('signup_error').textContent = '';
    document.getElementById('signup_name').value = '';
    document.getElementById('signup_email').value = '';
    document.getElementById('signup_password').value = '';
  }
}

// View: 切換表單畫面
function switchForm() {
  if (signInForm.style.display == 'block') {
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
    document.getElementById('signin_error').textContent = '';
    document.getElementById('signin_email').value = '';
    document.getElementById('signin_password').value = '';

  } else if (signUpForm.style.display == 'block') {
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
    document.getElementById('signup_error').textContent = '';
    document.getElementById('signup_name').value = '';
    document.getElementById('signup_email').value = '';
    document.getElementById('signup_password').value = '';
  }
}


// 登入/登出
function submitSingIn() {
  let email = document.getElementById('signin_email').value;
  let password = document.getElementById('signin_password').value;
  if (email == '' | password == '') {
    document.getElementById('signin_error').textContent = '請輸入帳號密碼';
  } else {
    fetch('/api/user', {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.ok) {
            window.location.reload();
        } else if (result.error) {
          document.getElementById('signin_error').textContent = result.message;
        }
      })

  }
}

function submitSingUp() {
  let name = document.getElementById('signup_name').value;
  let email = document.getElementById('signup_email').value;
  let password = document.getElementById('signup_password').value;
  if (name == '' | email == '' | password == '') {
    document.getElementById('signup_error').textContent = '請輸入完整資訊';
  } else {
    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.ok) {
          document.getElementById('signup_error').textContent = '註冊成功';
          name = '';
          email = '';
          password = '';
          signBtn.style.display = 'none';
          signOutBtn.style.display = 'block';
        } else if (result.error) {
          document.getElementById('signup_error').textContent = result.message;
        }
      })
  }
}

function signOut() {
  fetch('/api/user', { method: 'DELETE' })
    .then(response => response.json())
    .then(result => {
      if (result.ok) {
        window.location.reload();
      }
    })
}

// 登入/登出
signBtn.addEventListener('click', showModal);
closeSignIn.addEventListener('click', hideModal);
closeSignUp.addEventListener('click', hideModal);
switchSignUpBtn.addEventListener('click', switchForm);
switchSignInBtn.addEventListener('click', switchForm);
signInBtn.addEventListener('click', submitSingIn);
signUpBtn.addEventListener('click', submitSingUp);
signOutBtn.addEventListener('click', signOut);
