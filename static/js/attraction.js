let url = window.location.href;
let id = url.split('/attraction/')[1];
let rightArrow = document.getElementById('right_arrow');
let leftArrow = document.getElementById('left_arrow');
let morning = document.getElementById('morning');
let afternoon = document.getElementById('afternoon');
let morningLabel = document.getElementById('morning_label');
let afternoonLabel = document.getElementById('afternoon_label');
let startBookingBtn = document.getElementById('start_booking_btn');

let data;
let currentPhoto = 0;   // 初始圖片位置在第 0 張

// Model: 取得當前頁面的景點資訊
function getAttractionData() {
  return fetch(`/api/attraction/${id}`)
    .then(response => response.json())
    .then(result => {
      if (result.data) {
        data = result.data;
        return data;
      } else if (result.error) {
        data = result.message;
        return data;
      }
    })
    .catch(error => console.log('Error: ' + error))
}

// Model: 確認是否已有預定的行程
function checkBookingStatus() {
  return fetch('/api/booking', {
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

// Model: 建立一個預定行程
function createBooking() {
  return fetch('/api/booking', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
    },
    body: JSON.stringify({
        attractionId: id,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        price: document.getElementById('price').value
    })
  })
    .then(response => response.json())
    .then(result => {
      if(result.ok) {
        window.location.href = '/booking';
      } else if(result.error) {
        if(result.message == '未登入') {
          showModal();
        } else {
          document.getElementById('booking_error_msg').textContent = result.message;
        }
      }
    })
}

// Model: 取代已預定的行程
function replaceBooking() {
  fetch('/api/booking', {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-csrf-token': document.cookie.split('csrf_access_token=')[1]
    }
  })
    .then(response => response.json())
    .then(result => {
      if(result.ok) {
        createBooking();
      }
    })
}

// View: 顯示目前圖片及黑點位置
function showPhoto(index) {
  document.querySelector('.attraction_imgs').style.backgroundImage = `url('${data.images[index]}')`;
  let currentDot = document.getElementById('current_dot');
  if (currentDot) {
    currentDot.remove();
    createDot(index);
  } else {
    createDot(index);   // 頁面初始化時直接新增黑點在第一張圖片位置
  }
}

// View: 根據圖片總數畫出對應數量的圓點
function renderCircles(num) {
  let dots = document.querySelector('.dots');
  for (let i = 0; i < num; i++) {
    let dotGroup = document.createElement('div');
    dotGroup.className = 'dot_group';
    let circle = document.createElement('div');
    circle.className = 'circle';
    circle.onclick = () => {
      currentPhoto = i;   // 點擊圈圈時更新目前圖片位置
      showPhoto(i);
    };
    dotGroup.appendChild(circle);
    dots.appendChild(dotGroup);
  }
}

// View: 生成一個黑點
function createDot(index) {
  let dot = document.createElement('div');
  dot.className = 'dot';
  dot.id = 'current_dot';
  document.querySelectorAll('.circle')[index].appendChild(dot);
}

// View: 畫出初始主畫面
function renderAttraction() {
  if (data == '查無此景點') {
    document.querySelector('.top_section').textContent = data;
    document.querySelector('.info_detail').remove();
  } else {
    renderCircles(data.images.length);   // 根據圖片數畫出對應的圈圈數量
    showPhoto(0);
    document.getElementById('title').textContent = data.name;
    // 若沒有 mrt 資訊則只顯示分類
    if(data.mrt) {
      document.getElementById('info').textContent = `${data.category} at ${data.mrt}`;
    } else {
      document.getElementById('info').textContent = `${data.category}`;
    }
    document.getElementById('description').textContent = data.description;
    document.getElementById('address').textContent = data.address;
    document.getElementById('transport').textContent = data.transport;
  }
}


// Controller: 頁面初始化，載入畫面
async function load() {
  userData = await getUserStatus();
  showBtn(userData);
  await getAttractionData();
  renderAttraction();
}

// Controller: 向右箭頭，顯示下一張圖片
function nextPhoto() {
  if (currentPhoto < data.images.length - 1) {
    currentPhoto += 1;
    showPhoto(currentPhoto);
  } else {
    currentPhoto = 0;
    showPhoto(currentPhoto);
  }
}

// Controller: 向左箭頭，顯示上一張圖片
function previousPhoto() {
  if (currentPhoto > 0) {
    currentPhoto -= 1;
    showPhoto(currentPhoto);
  } else {
    currentPhoto = data.images.length - 1;
    showPhoto(currentPhoto);
  }
}

// Controller: 顯示上半天費用
function showMorningPrice() {
  afternoonLabel.style.visibility = 'hidden';
  morningLabel.style.visibility = 'visible';
  document.getElementById('price').value = '2000';
  document.getElementById('time').value = 'morning';
  document.querySelector('.price').textContent = ' 新台幣 2000 元';
}

// Controller: 顯示下半天費用
function showAfternoonPrice() {
  morningLabel.style.visibility = 'hidden';
  afternoonLabel.style.visibility = 'visible';
  document.getElementById('price').value = '2500';
  document.getElementById('time').value = 'afternoon';
  document.querySelector('.price').textContent = ' 新台幣 2500 元';
}

// Controller: 開始預定行程
async function startBooking() {
  if(!userData) {
    showModal();
  } else {
    let bookingStatus = await checkBookingStatus();
    if(!bookingStatus.data) {
      createBooking();
    } else {
      replaceBooking();
    }
  }
}


window.addEventListener('load', load);
rightArrow.addEventListener('click', nextPhoto);
leftArrow.addEventListener('click', previousPhoto);
morning.addEventListener('click', showMorningPrice);
afternoon.addEventListener('click', showAfternoonPrice);
startBookingBtn.addEventListener('click', startBooking);
