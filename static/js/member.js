let homeBtn = document.getElementById('home_btn');
let logOut = document.getElementById('signout_btn');

// Model: 取得會員的所有訂單資訊
function getMemberOrder() {
  return fetch('/api/order', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
    }
  })
    .then(response => response.json())
    .then(result => result);
}

// View: 生成一個 item 區塊
function createItem(target, attractionName, attractionId, date, time, price) {
  let itemBlock = document.createElement('div');
  itemBlock.className = 'item';
  let itemName = document.createElement('div');
  itemName.className = 'cell';
  let name = document.createElement('div');
  name.className = 'link';
  name.textContent = attractionName;
  itemName.onclick = () => location.href = `/attraction/${attractionId}`
  itemName.appendChild(name);
  let itemDate = document.createElement('div');
  itemDate.className = 'cell';
  itemDate.textContent = date;
  let itemTime = document.createElement('div');
  itemTime.className = 'cell';
  if(time == 'morning') {
    itemTime.textContent = '早上 8 點到下午 2 點';
  } else if(time == 'afternoon') {
    itemTime.textContent = '下午 2 點到晚上 8 點';
  }
  let itemPrice = document.createElement('div');
  itemPrice.className = 'cell';
  itemPrice.textContent = price;
  itemBlock.appendChild(itemName);
  itemBlock.appendChild(itemDate);
  itemBlock.appendChild(itemTime);
  itemBlock.appendChild(itemPrice);
  target.appendChild(itemBlock);
}

// View: 生成單一訂單編號資訊區塊
function createOrderBlock(orderId, item, totalPrice, paymentStatus) {
  let orderBlock = document.createElement('div');
  orderBlock.className = 'order';
  let orderBlockId = document.createElement('div');
  orderBlockId.className = 'cell';
  let number = document.createElement('div');
  number.className = 'link';
  number.textContent = orderId;
  number.onclick = () => location.href = `/thankyou?number=${orderId}`
  orderBlockId.appendChild(number);
  let orderBlockItems = document.createElement('div');
  orderBlockItems.className = 'order_items';
  orderBlockItems.id = orderId;
  let attractionName = item.attraction.name;
  let attractionId = item.attraction.id;
  let date = item.date;
  let time = item.time;
  let price = item.price;
  createItem(orderBlockItems, attractionName, attractionId, date, time, price);
  let orderBlockPrice = document.createElement('div');
  orderBlockPrice.className = 'cell';
  orderBlockPrice.textContent = totalPrice;
  let orderBlockStatus = document.createElement('div');
  orderBlockStatus.className = 'cell';
  if(paymentStatus === 0) {
    orderBlockStatus.textContent = '已付款';
    orderBlockStatus.classList.add('paid');
  } else {
    orderBlockStatus.textContent = '未付款';
    orderBlockStatus.classList.add('unpaid');
  }
  orderBlock.appendChild(orderBlockId);
  orderBlock.appendChild(orderBlockItems);
  orderBlock.appendChild(orderBlockPrice);
  orderBlock.appendChild(orderBlockStatus);
  document.getElementById('order_list').appendChild(orderBlock);
}

// View：生成整個訂單區塊
function renderEachOrder(orderInfo) {
  let orderId = '';
  for(let i = 0; i < orderInfo.length; i++) {
      let item = orderInfo[i].trip;
      let totalPrice = orderInfo[i].total_price;
      let paymentStatus = orderInfo[i].status;
    if(orderId != orderInfo[i].number) {
      orderId = orderInfo[i].number;
      createOrderBlock(orderId, item, totalPrice, paymentStatus);
    } else {
      let target = document.getElementById(orderId);
      let attractionName = item.attraction.name;
      let attractionId = item.attraction.id;
      let date = item.date;
      let time = item.time;
      let price = item.price;
      createItem(target, attractionName, attractionId, date, time, price)
    }
  }
}

// View: 畫出畫面
function render(userData, orderInfo) {
  let avatarText = userData.name[0].toUpperCase();
  avatar.style.display = 'block';
  document.getElementById('avatar').textContent = avatarText;
  document.getElementById('username').textContent = `用戶名稱：${userData.name}`;
  document.getElementById('account').textContent = `會員帳號：${userData.email}`;
  document.getElementById('password').textContent = '密碼：********';
  document.querySelectorAll('.loading_icon').forEach(element => element.remove());
  document.getElementById('order_info').style.display = 'block';
  if(!orderInfo) {
    let msg = document.createElement('div');
    msg.className = 'msg';
    msg.textContent = '暫無訂單資訊';
    document.getElementById('order_info').appendChild(msg);
  } else {
    document.querySelector('.title').style.display = 'inline-grid';
    renderEachOrder(orderInfo);
  }
}

// Controller: 頁面初始化
async function load() {
  userData = await getUserStatus();
  showBtn(userData);
  if(!userData) {
    window.location.href = '/';
  } else {
    orderInfo = await getMemberOrder(userData.id);
    if(orderInfo.error) {
      window.location.href = '/';
    } else {
      render(userData, orderInfo.data);
    }
  }
}

window.addEventListener('load', load);
homeBtn.addEventListener('click', () => window.location.href = '/');
logOut.addEventListener('click', signOut);

