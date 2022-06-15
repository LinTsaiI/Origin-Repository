let url = window.location.href;
let orderId = url.split('/thankyou?number=')[1];
let homeBtn = document.getElementById('home_btn');
let memberBtn = document.getElementById('member_btn');

// Model: 取得訂單編號
function getOrderInfo() {
  return fetch(`/api/order/${orderId}`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
    }
  })
    .then(response => response.json())
    .then(result => result.data)
}

// View: 顯示訂單細節
function showOrderInfo(orderInfo) {
  let orderNumber = document.getElementById('order_number');
  orderNumber.textContent = `訂單編號：${orderInfo[0].number}`;
  let orderStatus = document.getElementById('order_status');
  orderStatus.textContent = '訂單狀態：';
  let status = document.createElement('span');
  orderStatus.appendChild(status);
  if(orderInfo[0].status === 0) {
    status.style.color = '#448899';
    status.textContent = '已付款';
  } else {
    status.style.color = 'red';
    status.textContent = '未付款，請至會員中心查詢此訂單並完成付款';
  }
  let contactName = document.getElementById('contact_name');
  contactName.textContent = `聯絡姓名：${orderInfo[0].contact.name}`
  let contactEmail = document.getElementById('contact_email');
  contactEmail.textContent = `連絡信箱：${orderInfo[0].contact.email}`;
  let contactPhone = document.getElementById('contact_phone');
  contactPhone.textContent = `手機號碼：${orderInfo[0].contact.phone}`;
  let totalPrice = document.querySelector('.total_price');
  let price = document.createElement('div');
  price.textContent = `總金額：新台幣 ${orderInfo[0].total_price} 元`;
  totalPrice.appendChild(price);
  for(let i = 0; i < orderInfo.length; i++) {
    renderOrderItem(orderInfo[i].trip);
  }
}

// View: 畫出一個景點 item 區塊
function renderOrderItem(trip) {
  let img = trip.attraction.image;
  let attractionId = trip.attraction.id
  let attractionName = trip.attraction.name;
  let date = trip.date;
  let time = trip.time;
  let price = trip.price;
  let place = trip.attraction.address;
  let itemBlock = document.createElement('div');
  itemBlock.className = 'order_item';
  let attractionImg = document.createElement('img');
  attractionImg.className = 'attraction_img';
  attractionImg.src = img;
  attractionImg.onclick = () => location.href = `/attraction/${attractionId}`;
  itemBlock.appendChild(attractionImg);
  let itemDetail = document.createElement('div');
  itemDetail.className = 'item_detail';
  let destination = document.createElement('div');
  destination.className = 'destination';
  destination.textContent = `台北一日遊：${attractionName}`;
  destination.onclick = () => location.href = `/attraction/${attractionId}`;
  itemDetail.appendChild(destination);
  let dateBlock = document.createElement('div');
  dateBlock.className = 'style_inline';
  let dateTitle = document.createElement('div');
  dateTitle.className = 'style_bold';
  dateTitle.textContent = '日期： ';
  let dateText = document.createElement('div');
  dateText.textContent = date;
  dateBlock.appendChild(dateTitle);
  dateBlock.appendChild(dateText);
  itemDetail.appendChild(dateBlock);
  let timeBlock = document.createElement('div');
  timeBlock.className = 'style_inline';
  let timeTitle = document.createElement('div');
  timeTitle.className = 'style_bold';
  timeTitle.textContent = '時間： ';
  let timeText = document.createElement('div');
  if(time == 'morning') {
    timeText.textContent = '早上 8 點到下午 2 點';
  } else if(time == 'afternoon') {
    timeText.textContent = '下午 2 點到晚上 8 點';
  }
  timeBlock.appendChild(timeTitle);
  timeBlock.appendChild(timeText);
  itemDetail.appendChild(timeBlock);
  let priceBlock = document.createElement('div');
  priceBlock.className = 'style_inline';
  let priceTitle = document.createElement('div');
  priceTitle.className = 'style_bold';
  priceTitle.textContent = '費用： ';
  let priceText = document.createElement('div');
  priceText.textContent = `新台幣 ${price} 元`;
  priceBlock.appendChild(priceTitle);
  priceBlock.appendChild(priceText);
  itemDetail.appendChild(priceBlock);
  let placeBlock = document.createElement('div');
  placeBlock.className = 'style_inline';
  let placeTitle = document.createElement('div');
  placeTitle.className = 'style_bold';
  placeTitle.textContent = '地點： ';
  let placeText = document.createElement('div');
  placeText.textContent = place;
  placeBlock.appendChild(placeTitle);
  placeBlock.appendChild(placeText);
  itemDetail.appendChild(placeBlock);
  itemBlock.appendChild(itemDetail);
  document.querySelector('.order_content').appendChild(itemBlock);
}


// View: 顯示查無此訂單訊息
function showNoOrderMsg() {
  let message = document.querySelector('.order_msg');
  message.textContent = '查無此訂單';
}

// Controller: 頁面初始化
async function load() {
  userData = await getUserStatus();
  showBtn(userData);
  if(!userData) {
    window.location.href = '/';
  } else {
    document.getElementById('greeting').textContent = `${userData.name}，您的訂單明細如下：`
    result = await getOrderInfo();
    document.querySelectorAll('.loading_icon').forEach(element => element.remove());
    if(!result) {
      showNoOrderMsg();
    } else {
      showOrderInfo(result);
    }
  }
}

window.addEventListener('load', load);
homeBtn.addEventListener('click', () => window.location.href = '/');
memberBtn.addEventListener('click', () => window.location.href = '/member');