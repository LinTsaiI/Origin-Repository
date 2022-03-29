let deleteBtn = document.getElementById('delete_btn');
let confirmBtn = document.getElementById('confirm_btn');

// let userData;

// Model: 取得預定行程資訊
function getBookingInfo() {
  return fetch('/api/booking', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(result => result)
}

// Model: 從資料庫刪除預定資訊
function deleteBookingFromDb() {
  return fetch('/api/booking', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(result => result)
}

// View: 顯示預定行程細節
function renderBookingInfo(bookingInfo) {
  let attractionName = bookingInfo.attraction.name;
  let place = bookingInfo.attraction.address;
  let attractionCoverUrl = bookingInfo.attraction.image;
  let date = bookingInfo.date;
  let time = bookingInfo.time;
  let price = bookingInfo.price;
  document.getElementById('member_name').textContent = userData.name;
  document.getElementById('attraction_name').textContent = attractionName;
  document.getElementById('attraction_cover').src = attractionCoverUrl;
  document.getElementById('date').textContent = date;
  if(time == 'morning') {
    document.getElementById('time').textContent = '早上 8 點到下午 2 點';
  } else if(time == 'afternoon') {
    document.getElementById('time').textContent = '下午 2 點到晚上 8 點';
  }
  document.getElementById('price').textContent = price;
  document.getElementById('total_price').textContent = price;
  document.getElementById('place').textContent = place;
  document.getElementById('contact_name').value = userData.name;
  document.getElementById('contact_email').value = userData.email;
}

// View: 顯示刪除預定後的訊息
function showNoBookingMsg() {
  document.getElementById('member_name').textContent = userData.name;
  document.getElementById('headline_rest').innerHTML = '';
  let msg = document.createElement('div');
  msg.id = 'booking_msg';
  msg.textContent = '目前沒有任何待預訂的行程';
  document.getElementById('headline_rest').appendChild(msg);
}

// Controller: 頁面初始化，載入畫面
async function load() {
  userData = await getUserStatus();
  showBtn(userData);
  if(!userData) {
    window.location.href = '/';
  } else {
    let result = await getBookingInfo();
    if(!result.data) {
      showNoBookingMsg();
    } else if(result.data) {
      renderBookingInfo(result.data);
    } else if(result.error) {
      window.location.href = '/';
    }
  }
}

// Controller: 刪除預定行程
async function deleteBooking() {
  let result = await deleteBookingFromDb();
  if(result.ok) {
    showNoBookingMsg();
  } else if(result.error) {
    showModal();
  }
}

// Controller: 確認付款
function confirmPayment() {
  
}

window.addEventListener('load', load);
deleteBtn.addEventListener('click', deleteBooking);
confirmBtn.addEventListener('click', confirmPayment);
