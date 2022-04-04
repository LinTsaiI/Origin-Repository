let deleteBtn = document.getElementById('delete_btn');
let confirmBtn = document.getElementById('confirm_btn');
let contactName = document.getElementById('contact_name');
let contactEmail = document.getElementById('contact_email');
let phoneNumber = document.getElementById('contact_phone');
let cardNumber = document.getElementById('card_number');
let expirationDate = document.getElementById('card_expiration_date');
let cvv = document.getElementById('card_cvv');

let bookingInfo;

TPDirect.setupSDK(11327, 'app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC', 'sandbox');
let fields = {
  number: {
    element: cardNumber,
    placeholder: '**** **** **** ****',
  },
  expirationDate: {
    element: expirationDate,
    placeholder: 'MM / YY',
  },
  ccv: {
    element: cvv,
    placeholder: 'cvv',
  }
}

TPDirect.card.setup({
  fields: fields,
  styles: {
    'input': {
      'font-size': '16px',
    },
    '.valid': {
      'color': 'green'
    },
    '.invalid': {
      'color': 'red'
    },
  }
});


TPDirect.card.onUpdate((update) => {
  if(update.canGetPrime) {
    confirmBtn.removeAttribute('disabled');
  } else {
    confirmBtn.setAttribute('disabled', true);
  }
})

// Model: 取得預定行程資訊
function getBookingInfo() {
  return fetch('/api/booking', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
    }
  })
    .then(response => response.json())
    .then(result => bookingInfo = result)
}

// Model: 從資料庫刪除預定資訊
function deleteBookingFromDb() {
  return fetch('/api/booking', {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
    }
  })
    .then(response => response.json())
    .then(result => result)
}

// View: 顯示預定行程細節
function renderBookingInfo() {
  let attractionId = bookingInfo.data.attraction.id
  let attractionName = bookingInfo.data.attraction.name;
  let place = bookingInfo.data.attraction.address;
  let attractionCoverUrl = bookingInfo.data.attraction.image;
  let date = bookingInfo.data.date;
  let time = bookingInfo.data.time;
  let price = bookingInfo.data.price;
  document.getElementById('member_name').textContent = userData.name;
  document.getElementById('attraction_name').textContent = attractionName;
  document.getElementById('attraction_name').onclick = () => location.href = `/attraction/${attractionId}`;
  document.getElementById('attraction_cover').src = attractionCoverUrl;
  document.getElementById('attraction_cover').onclick = () => location.href = `/attraction/${attractionId}`;
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
    await getBookingInfo();
    if(!bookingInfo.data) {
      showNoBookingMsg();
    } else if(bookingInfo.data) {
      renderBookingInfo();
    } else if(bookingInfo.error) {
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
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  if (tappayStatus.canGetPrime === true) {
    TPDirect.card.getPrime((result) => {
      fetch('/api/order', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
        },
        body: JSON.stringify({
          prime: result.card.prime,
          order: {
            price: bookingInfo.data.price,
            trip: {
              attraction: {
                id: bookingInfo.data.attraction.id,
                name: bookingInfo.data.attraction.name,
                address: bookingInfo.data.attraction.address,
                image: bookingInfo.data.attraction.image
              },
              date: bookingInfo.data.date,
              time: bookingInfo.data.time
            },
            contact: {
              name: contactName.value,
              email: contactEmail.value,
              phone: phoneNumber.value
            }
          }
        })
      })
        .then(response => response.json())
        .then(result => {
          if(result.data) {
            window.location.href = `/thankyou?number=${result.data.number}`
          }
        })
    })
  }
}

window.addEventListener('load', load);
deleteBtn.addEventListener('click', deleteBooking);
confirmBtn.addEventListener('click', confirmPayment);
