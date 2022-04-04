let url = window.location.href;
let orderId = url.split('/thankyou?number=')[1];

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
    .then(result => result)
}

// View: 查無此訂單訊息
function noOrderInfo() {
  let message = document.createElement('div');
  message.id = 'order_msg';
  message.textContent = '查無此訂單';
  document.querySelector('.thankyou_container').appendChild(message);
}

// View: 完成付款，顯示訂單編號
function orderSuccessfullyMsg(orderId) {
  let success = document.createElement('h3');
  success.textContent = '完成付款，行程預定成功';
  let orderIdText = document.createElement('div');
  orderIdText.id = 'order_msg';
  orderIdText.textContent = `訂單編號：${orderId}`;
  let hint = document.createElement('div');
  hint.textContent = '請記住此編號，或至會員中心查詢歷史訂單';
  let container = document.querySelector('.thankyou_container');
  container.appendChild(success);
  container.appendChild(orderIdText);
  container.appendChild(hint);
}

// View: 尚未完成付款，顯示訂單編號
function orderFailed(orderId) {
  let failed = document.createElement('h3');
  failed.textContent = '尚未完成付款';
  let orderIdText = document.createElement('div');
  orderIdText.id = 'order_msg';
  orderIdText.textContent = `訂單編號：${orderId}`;
  let hint = document.createElement('div');
  hint.textContent = '請至會員中心查詢該筆訂單，並完成付款';
  let container = document.querySelector('.thankyou_container');
  container.appendChild(failed);
  container.appendChild(orderIdText);
  container.appendChild(hint);
}

async function load() {
  userData = await getUserStatus();
  showBtn(userData);
  if(!userData) {
    window.location.href = '/';
  } else {
    result = await getOrderInfo();
    if(!result.data) {
      noOrderInfo();
    } else {
      orderId = result.data.number;
      if(result.data.status === 0) {
        orderSuccessfullyMsg(orderId);
      } else {
        orderFailed(orderId);
      }
    }
  }
}

window.addEventListener('load', load);