let confirmBtn = document.getElementById('confirm_btn');
let contactName = document.getElementById('contact_name');
let contactEmail = document.getElementById('contact_email');
let phoneNumber = document.getElementById('contact_phone');
let cardNumber = document.getElementById('card_number');
let expirationDate = document.getElementById('card_expiration_date');
let cvv = document.getElementById('card_cvv');

let bookingNumber;
let bookingInfo;

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
function deleteBookingFromDb(bookingId) {
  return fetch(`/api/booking/${bookingId}`, {
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

// View: 顯示會員姓名
function showMemberName(name) {
  let greetingBlock = document.createElement('div');
  greetingBlock.className = 'info_head headline';
  greetingBlock.textContent = `您好，${name}，待預訂的行程如下：`;
  let main = document.querySelector('.booking_main');
  let rest = document.getElementById('headline_rest');
  main.insertBefore(greetingBlock, rest);
}

// View: 畫出一個 booking item 區塊
function createBookingItem(bookingId, attractionId, attractionName, place, attractionCoverUrl, date, time, price) {
  let bookingItem = document.createElement('div');
  bookingItem.className = 'booking_item';
  bookingItem.id = `booking_item_${bookingId}`;
  let attractionImg = document.createElement('img');
  attractionImg.className = 'attraction_img';
  attractionImg.id = 'attraction_cover';
  attractionImg.src = attractionCoverUrl;
  attractionImg.onclick = () => location.href = `/attraction/${attractionId}`;
  let bookingDetail = document.createElement('div');
  bookingDetail.className = 'booking_detail';
  let destination = document.createElement('div');
  destination.className = 'destination';
  destination.innerHTML = '台北一日遊：' + '<span id="attraction_name">' + attractionName + '</span>';
  destination.onclick = () => location.href = `/attraction/${attractionId}`;
  let dateBlock = document.createElement('div');
  dateBlock.className = 'style_inline';
  let dateText = document.createElement('div');
  dateText.className = 'style_bold';
  dateText.textContent = '日期： ';
  let bookingDate = document.createElement('div');
  bookingDate.id = 'date';
  bookingDate.textContent = date;
  dateBlock.appendChild(dateText);
  dateBlock.appendChild(bookingDate);
  let timeBlock = document.createElement('div');
  timeBlock.className = 'style_inline';
  let timeText = document.createElement('div');
  timeText.className = 'style_bold';
  timeText.textContent = '時間： ';
  let bookingTime = document.createElement('div');
  bookingTime.id = 'time';
  if(time == 'morning') {
    bookingTime.textContent = '早上 8 點到下午 2 點';
  } else if(time == 'afternoon') {
    bookingTime.textContent = '下午 2 點到晚上 8 點';
  }
  timeBlock.appendChild(timeText);
  timeBlock.appendChild(bookingTime);
  let priceBlock = document.createElement('div');
  priceBlock.className = 'style_inline';
  let priceText = document.createElement('div');
  priceText.className = 'style_bold';
  priceText.textContent = '費用： ';
  let bookingPrice = document.createElement('div');
  bookingPrice.innerHTML = '新台幣 ' + '<span class="price">' + price + '</span>' + ' 元';
  priceBlock.appendChild(priceText);
  priceBlock.appendChild(bookingPrice);
  let placeBlock = document.createElement('div');
  placeBlock.className = 'style_inline';
  let placeText = document.createElement('div');
  placeText.className = 'style_bold';
  placeText.textContent = '地點： ';
  let bookingPlace = document.createElement('div');
  bookingPlace.id = 'place';
  bookingPlace.textContent = place;
  placeBlock.appendChild(placeText);
  placeBlock.appendChild(bookingPlace);
  bookingDetail.appendChild(destination);
  bookingDetail.appendChild(dateBlock);
  bookingDetail.appendChild(timeBlock);
  bookingDetail.appendChild(priceBlock);
  bookingDetail.appendChild(placeBlock);
  let deleteBtn = document.createElement('img');
  deleteBtn.className = 'delete';
  deleteBtn.src = '../static/img/icon_delete.png';
  deleteBtn.id = `delete_btn_${bookingId}`;
  deleteBtn.onclick = () => {
    deleteBooking(bookingId);
  }
  bookingItem.appendChild(attractionImg);
  bookingItem.appendChild(bookingDetail);
  bookingItem.appendChild(deleteBtn);
  document.getElementById('booking_container').appendChild(bookingItem);
}


// View: 顯示預定行程細節
function renderBookingInfo(bookingInfo) {
  for(let i=0; i < bookingInfo.length; i++) {
    let bookingId = bookingInfo[i].id;
    let attractionId = bookingInfo[i].attraction.id
    let attractionName = bookingInfo[i].attraction.name;
    let place = bookingInfo[i].attraction.address;
    let attractionCoverUrl = bookingInfo[i].attraction.image;
    let date = bookingInfo[i].date;
    let time = bookingInfo[i].time;
    let price = bookingInfo[i].price;
    createBookingItem(bookingId, attractionId, attractionName, place, attractionCoverUrl, date, time, price);
  }
  calculateTotalPrice();
  document.getElementById('contact_name').value = userData.name;
  document.getElementById('contact_email').value = userData.email;
}

// View: 刪除指定的 booking item 區塊
function removeBookingItem(target) {
  target.remove();
  bookingNumber -= 1;
}

// 計算總金額
function calculateTotalPrice() {
  let totalPrice = 0;
  document.querySelectorAll('.price').forEach((element) => {
    totalPrice += parseInt(element.innerText);
  });
  document.getElementById('total_price').textContent = totalPrice;
}

// View: 顯示無預定行程的訊息
function showNoBookingMsg() {
  document.getElementById('headline_rest').innerHTML = '';
  let msg = document.createElement('div');
  msg.id = 'booking_msg';
  msg.textContent = '目前沒有任何待預訂的行程';
  document.getElementById('headline_rest').appendChild(msg);
}

// View: 刪除行程，購物車商品數量-1
function deleteItem() {
  let itemNumber = document.getElementById('booking_number');
  let number = parseInt(itemNumber.textContent);
  if(number === 1) {
    itemNumber.style.display = 'none';
    showNoBookingMsg();
  } else {
    number -= 1;
    itemNumber.textContent = number;
  }
}

// View: 顯示付款中視窗
function showPayingWindow() {
  document.querySelector('.modal_background').style.display = 'block';
  document.getElementById('paying_window').style.display = 'block';
}

// View: 顯示付款中視窗
function hidePayingWindow() {
  document.querySelector('.modal_background').style.display = 'none';
  document.getElementById('paying_window').style.display = 'none';
}


// Controller: 頁面初始化，載入畫面
async function load() {
  userData = await getUserStatus();
  showBtn(userData);
  if(!userData) {
    window.location.href = '/';
  } else {
    showMemberName(userData.name);
    await getBookingInfo();
    document.getElementById('loading_icon').remove();
    if(!bookingInfo.data) {
      showNoBookingMsg();
    } else if(bookingInfo.data) {
      renderBookingInfo(bookingInfo.data);
    } else if(bookingInfo.error) {
      window.location.href = '/';
    }
  }
}

// Controller: 刪除預定行程
async function deleteBooking(bookingId) {
  let target = document.getElementById(`booking_item_${bookingId}`);
  let result = await deleteBookingFromDb(bookingId);
  if(result.ok) {
    deleteItem();
    removeBookingItem(target);
    await getBookingInfo();
    calculateTotalPrice();
    if(bookingNumber == 0) {
      showNoBookingMsg();
    }
  } else if(result.error) {
    showModal();
  }
}

// TapPay 設定
TPDirect.setupSDK(123986, 'app_y3Y4LJuDQD1oatjcR2PTPg5G9BDzGeBOARxu3bXVPT3gBCRuQ3AqJ4PhM6kx', 'sandbox');
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


// Controller: 確認付款
function confirmPayment() {
  showPayingWindow();
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  if (tappayStatus.canGetPrime === true) {
    let totalPrice = parseInt(document.getElementById('total_price').textContent);
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
            price: totalPrice,
            trip: bookingInfo.data,
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
            hidePayingWindow();
            window.location.href = `/thankyou?number=${result.data.number}`
          }
        })
    })
  }
}

window.addEventListener('load', load);
confirmBtn.addEventListener('click', confirmPayment);
