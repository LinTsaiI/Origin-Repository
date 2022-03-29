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
let showBookingInfoBtn = document.getElementById('booking_btn');

let useData;

// Model: 登入系統
function signin(email, password) {
  return fetch('/api/user', {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(response => response.json())
    .then(result => result)
}

// Model: 註冊系統
function signup(name, email, password) {
  return fetch('/api/user', {
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
    .then(result => result)
}


// View: 顯示「登入/註冊」按鈕
function showBtn(userData) {
  if (userData) {
    signBtn.style.display = 'none';
    signOutBtn.style.display = 'block';
  } else {
    signBtn.style.display = 'block';
    signOutBtn.style.display = 'none';
  }
}

// View: 顯示登入/註冊畫面
function showModal() {
  document.querySelector('.modal_background').style.display = 'block';
  signInForm.style.display = 'block';
}

// View: 在表單上顯示訊息
function showFormMessage(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

// View: 清空登入表單 input value
function clearSignInForm() {
  document.getElementById('signin_email').value = '';
  document.getElementById('signin_password').value = '';
}

// View: 清空註冊表單 input value
function clearSignUpForm() {
  document.getElementById('signup_name').value = '';
  document.getElementById('signup_email').value = '';
  document.getElementById('signup_password').value = '';
}

// View: 隱藏登入/註冊畫面
function hideModal() {
  document.querySelector('.modal_background').style.display = 'none';
  if (signInForm.style.display == 'block') {
    signInForm.style.display = 'none';
    signInForm.classList.add('transition-in');
    showFormMessage('signin_msg', '');
    clearSignInForm();
  } else if (signUpForm.style.display == 'block') {
    signUpForm.style.display = 'none';
    signInForm.classList.add('transition-in');
    showFormMessage('signup_msg', '');
    clearSignUpForm();
  }
}

// View: 切換表單畫面
function switchForm() {
  if (signInForm.style.display == 'block') {
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
    signInForm.classList.remove('transition-in');
    showFormMessage('signin_msg', '');
    clearSignInForm();
  } else if (signUpForm.style.display == 'block') {
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
    showFormMessage('signup_msg', '');
    clearSignUpForm();
  }
}

// View: 關閉登入/註冊視窗，觸發 animation
function transitionOut() {
  signInForm.classList.add('transition-out');
}


// Controller: 確認使用者登入狀況
function getUserStatus() {
  return fetch('/api/user', { method: 'GET' })
    .then(response => response.json())
    .then(result => {
      userData = result.data;
      return userData;
    })
}

// Controller: 送出登入表單
async function submitSingIn() {
  let email = document.getElementById('signin_email').value;
  let password = document.getElementById('signin_password').value;
  if (email == '' | password == '') {
    showFormMessage('signin_msg', '請輸入帳號密碼');
  } else {
    let result = await signin(email, password);
    if (result.ok) {
        window.location.reload();
    } else if (result.error) {
      showFormMessage('signin_msg', result.message);
    }
  }
}

// Controller: 送出註冊表單 
async function submitSingUp() {
  let name = document.getElementById('signup_name').value;
  let email = document.getElementById('signup_email').value;
  let password = document.getElementById('signup_password').value;
  if (name == '' | email == '' | password == '') {
    showFormMessage('signup_msg', '請輸入完整資訊');
  } else {
    let result = await signup(name, email, password);
    if (result.ok) {
      clearSignUpForm();
      showFormMessage('signup_msg', '註冊成功');
      userData = await getUserStatus();
      showBtn(userData);
    } else if (result.error) {
      showFormMessage('signup_msg', result.message);
    }
  }
}

// Controller: 登出系統
function signOut() {
  fetch('/api/user', { method: 'DELETE' })
    .then(response => response.json())
    .then(result => {
      if (result.ok) {
        window.location.reload();
      }
    })
}

// Controller: 顯示預定行程
function showBookingInfo() {
  if(signBtn.style.display == 'block') {
    showModal();
  } else if(signOutBtn.style.display == 'block') {
    window.location.href = '/booking';
  }
}

signBtn.addEventListener('click', showModal);
closeSignIn.addEventListener('click', hideModal);
closeSignUp.addEventListener('click', hideModal);
switchSignUpBtn.addEventListener('click', switchForm);
switchSignInBtn.addEventListener('click', switchForm);
signInBtn.addEventListener('click', submitSingIn);
signUpBtn.addEventListener('click', submitSingUp);
signOutBtn.addEventListener('click', signOut);
showBookingInfoBtn.addEventListener('click', showBookingInfo);
