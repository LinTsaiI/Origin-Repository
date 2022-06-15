let signBtn = document.getElementById('sign_btn');
let closeSignIn = document.getElementById('close_signin');
let closeSignUp = document.getElementById('close_signup');
let signInForm = document.getElementById('signin_form');
let signUpForm = document.getElementById('signup_form');
let switchSignUpBtn = document.getElementById('switch_signup');
let switchSignInBtn = document.getElementById('switch_signin');
let signInBtn = document.getElementById('signin_btn');
let signUpBtn = document.getElementById('signup_btn');
let showBookingInfoBtn = document.getElementById('booking_btn');
let memberPage = document.getElementById('member_page');
let signInEmail = document.getElementById('signin_email');
let signInPassword = document.getElementById('signin_password');
let username = document.getElementById('signup_name');
let signUpEmail = document.getElementById('signup_email');
let signUpPassword = document.getElementById('signup_password');

// email 格式規範
let emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// password 使用8個字元以上的英文及數字，需至少含一個大寫英文字母
let passwordRegExp = /(?=.*[a-z])(?=.*[A-Z]+)(?=.*\d)[a-zA-Z\d]{8,}$/;

let userData;

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

// Model: 註冊會員
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


// View: 顯示會員中心連結按鈕
function showMemberBtn(userData) {
  // document.getElementById('btn_container').style.gridTemplateColumns = '1fr 1fr 0.5fr';
  signBtn.style.display = 'none';
  memberPage.style.display = 'block';
  let memberName = document.getElementById('member');
  memberName.textContent = userData.name[0].toUpperCase();
}

// View: 顯示「登入/註冊」或「登出系統」按鈕
function showBtn(userData) {
  if(userData) {
    signBtn.style.display = 'none';
    showMemberBtn(userData);
    showItemNumber(userData);
  } else {
    signBtn.style.display = 'block';
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
  signInEmail.style.border = '1px solid #CCCCCC';
  signInPassword.style.border = '1px solid #CCCCCC';
}

// View: 清空註冊表單 input value
function clearSignUpForm() {
  document.getElementById('signup_name').value = '';
  document.getElementById('signup_email').value = '';
  document.getElementById('signup_password').value = '';
  username.style.border = '1px solid #CCCCCC';
  signUpEmail.style.border = '1px solid #CCCCCC';
  signUpPassword.style.border = '1px solid #CCCCCC';
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
// function transitionOut() {
//   signInForm.classList.add('transition-out');
// }

// View: 根據購物車數量顯示數量小標
function showItemNumber(userData) {
  if(userData) {
    fetch('/api/booking', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
      }
    })
      .then(response => response.json())
      .then(result => {
        if(result.data) {
          itemNumber = result.data.length;
          let itemNumberMark = document.getElementById('booking_number')
          itemNumberMark.textContent = itemNumber;
          itemNumberMark.style.display = 'block';
        }
      })
  }
}

// View: 未輸入資訊的input欄位顯示紅色框
function showEmptyInput(targets) {
  targets.forEach(target => {
    if(target.value === '') {
      target.style.border = '2px solid rgb(212, 47, 47)'
    }
  })
}

// View: 未符合帳號密碼格式的input欄位顯示紅色框
function showInvalidInput(email, password) {
  if(!emailRegExp.test(email.value)) {
    email.style.border = '2px solid rgb(212, 47, 47)';
  }
  if(!passwordRegExp.test(password.value)) {
    password.style.border = '2px solid rgb(212, 47, 47)';
  }
}

// Controller: 確認使用者登入狀況
function getUserStatus() {
  return fetch('/api/user', {
    method: 'GET',
    credentials: 'same-origin',   // request 與後端 API 來自同一個 Domain
    headers: {
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]   // request 需帶上 csrftoken 作為比對 JWT 使用
    }
  })
    .then(response => response.json())
    .then(result => {
      userData = result.data;
      return userData;
    })
}

// Controller: 送出登入表單
async function submitSingIn() {
  let email = signInEmail.value;
  let password = signInPassword.value;
  if (email == '' || password == '') {
    showEmptyInput([signInEmail, signInPassword]);
    showFormMessage('signin_msg', '請輸入帳號密碼');
  } else {
    if(!emailRegExp.test(email) || !passwordRegExp.test(password)) {
      showInvalidInput(signInEmail, signInPassword);
      showFormMessage('signin_msg', '帳號密碼格式錯誤');
    } else {
      let result = await signin(email, password);
      if (result.ok) {
        window.location.reload();
      } else if(result.error) {
        showFormMessage('signin_msg', result.message);
      }
    }
  }
}

// Controller: 送出註冊表單 
async function submitSingUp() {
  let name = username.value;
  let email = signUpEmail.value;
  let password = signUpPassword.value;
  if (name == '' || email == '' || password == '') {
    showEmptyInput([username, signUpEmail, signUpPassword]);
    showFormMessage('signup_msg', '請輸入完整資訊');
  } else {
    if(!emailRegExp.test(email) || !passwordRegExp.test(password)) {
      showInvalidInput(signUpEmail, signUpPassword);
      showFormMessage('signup_msg', '帳號密碼格式錯誤');
    } else {
      let result = await signup(name, email, password);
      if (result.ok) {
        clearSignUpForm();
        showFormMessage('signup_msg', '註冊成功');
        userData = await getUserStatus();
        showBtn(userData);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (result.error) {
        showFormMessage('signup_msg', result.message);
      }
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

// Controller: 進入預定行程(購物車)頁面
function showBookingInfo() {
  if(signBtn.style.display == 'block') {
    showModal();
  } else if(memberPage.style.display == 'block') {
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
showBookingInfoBtn.addEventListener('click', showBookingInfo);
memberPage.addEventListener('click', () => location.href = '/member');

// 若sign in/sign out帳號密碼符合格式，外框變綠色
signInEmail.addEventListener('input', () => {
  if(emailRegExp.test(signInEmail.value)) {
    signInEmail.style.border = '2px solid #85b654';
  } else {
    signInEmail.style.border = '1px solid #CCCCCC';
  }
})
signInPassword.addEventListener('input', () => {
  if(passwordRegExp.test(signInPassword.value)) {
    signInPassword.style.border = '2px solid #85b654';
  } else {
    signInPassword.style.border = '1px solid #CCCCCC';
  }
})
signUpEmail.addEventListener('input', () => {
  if(emailRegExp.test(signUpEmail.value)) {
    signUpEmail.style.border = '2px solid #85b654';
  } else {
    signUpEmail.style.border = '1px solid #CCCCCC';
  }
})
signUpPassword.addEventListener('input', () => {
  if(passwordRegExp.test(signUpPassword.value)) {
    signUpPassword.style.border = '2px solid #85b654';
  } else {
    signUpPassword.style.border = '1px solid #CCCCCC';
  }
})


// Controller: 登入/註冊表格送出支援Enter鍵
let signInFormKeyupEventTarget = [
  document.getElementById('signin_email'),
  document.getElementById('signin_password'),
]
signInFormKeyupEventTarget.forEach(target => {
  target.addEventListener('keyup', (event) => {
  if(event.key === 'Enter') {
      signInBtn.click();
    }
  })
})

let signUpFormKeyupEventTarget = [
  document.getElementById('signup_name'),
  document.getElementById('signup_email'),
  document.getElementById('signup_password')
]
signUpFormKeyupEventTarget.forEach(target => {
  target.addEventListener('keyup', (event) => {
  if(event.key === 'Enter') {
      signUpBtn.click();
    }
  })
})


