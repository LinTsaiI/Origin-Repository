let url = window.location.href;
let id = url.replace('http://0.0.0.0:3000/attraction/', '');
// let id = url.substring(url.lastIndexOf('/')+1, url.length+1);
let rightArrow = document.getElementById('right_arrow');
let leftArrow = document.getElementById('left_arrow');
let morning = document.getElementById('morning');
let afternoon = document.getElementById('afternoon');
let morningLabel = document.getElementById('morning_label');
let afternoonLabel = document.getElementById('afternoon_label');
let btn = document.getElementById('btn');
let data;
let images;
let currentPhoto = 0;

// Model: 取得當前頁面的景點資訊
function getAttractionData(id) {
  return fetch(`/api/attraction/${id}`)
    .then(response => response.json())
    .then(result => {
      data = result.data;
      images = result.data.images;
      return [data, images];
    })
    .catch(error => console.log('Error: ' + error))
}


// View: 顯示目前圖片
function showPhoto(index) {
  document.querySelector('.attraction_imgs').style.backgroundImage = `url('${images[index]}')`;
}

// View: 根據圖片總數畫出對應數量的圓點
function renderCircles(num) {
  let dots = document.querySelector('.dots');
  for (let i = 0; i < num; i++) {
    let dotGroup = document.createElement('div');
    dotGroup.className = 'dot_group';
    let circle = document.createElement('div');
    circle.className = 'circle';
    // circle.onclick = `showPhoto(${i});`;
    // circle.setAttribute('onclick', `showPhoto(${i});`)
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

// View: 移動黑點顯示目前圖片位置
function showCurrentDot(index) {
  let currentDot = document.getElementById('current_dot');
  if (currentDot) {
    currentDot.remove();
    createDot(index);
  } else {
    createDot(index);
  }
}

// View: 畫出主畫面
function renderAttraction() {
  showPhoto(0);
  renderCircles(data.images.length);
  showCurrentDot(0);
  // document.getElementById('attraction_id').value = data.id;
  document.getElementById('title').innerHTML = data.name;
  if(data.mrt) {
    document.getElementById('info').innerHTML = `${data.category} at ${data.mrt}`;
  } else {
    document.getElementById('info').innerHTML = `${data.category}`;
  }
  document.getElementById('description').innerHTML = data.description;
  document.getElementById('address').innerHTML = data.address;
  document.getElementById('transport').innerHTML = data.transport;
}


// Controller: 頁面初始化，載入畫面
async function load(id) {
  await getAttractionData(id);
  renderAttraction();
}

// Controller: 向右箭頭，顯示下一張圖片
function nextPhoto() {
  if (currentPhoto < images.length - 1) {
    currentPhoto += 1;
    showPhoto(currentPhoto);
    showCurrentDot(currentPhoto);
  } else {
    currentPhoto = 0;
    showPhoto(currentPhoto);
    showCurrentDot(currentPhoto);
  }
}

// Controller: 向左箭頭，顯示上一張圖片
function previousPhoto() {
  if (currentPhoto > 0) {
    currentPhoto -= 1;
    showPhoto(currentPhoto);
    showCurrentDot(currentPhoto);
  } else {
    currentPhoto = images.length - 1;
    showPhoto(currentPhoto);
    showCurrentDot(currentPhoto);
  }
}

// Controller: 顯示上半天費用
function showMorningPrice() {
  afternoonLabel.style.visibility = 'hidden';
  morningLabel.style.visibility = 'visible';
  document.getElementById('time').value = 'morning';
  // document.getElementById('price').value = 2000;
  document.querySelector('.price').innerHTML = '&nbsp新台幣&nbsp2000&nbsp元';
}

// Controller: 顯示下半天費用
function showAfternoonPrice() {
  morningLabel.style.visibility = 'hidden';
  afternoonLabel.style.visibility = 'visible';
  document.getElementById('time').value = 'afternoon';
  // document.getElementById('price').value = 2500;
  document.querySelector('.price').innerHTML = '&nbsp新台幣&nbsp2500&nbsp元';
}

// function sendBookingRequest() {
//   fetch('/api/booking', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         "attractionId": data.id,
//         "date": document.getElementById('date').value,
//         "time": document.getElementById('time').value,
//         "price": document.getElementById('price').value
//     })
//   })
//     .then(response => response.json())
//     .then(result => {
//       if(result.ok) {
//         window.location.href = '/booking';
//       }
//     })
// }

window.addEventListener('load', load(id));
rightArrow.addEventListener('click', nextPhoto);
leftArrow.addEventListener('click', previousPhoto);
morning.addEventListener('click', showMorningPrice);
afternoon.addEventListener('click', showAfternoonPrice);
// btn.addEventListener('click', sendBookingRequest);



// let dots = document.querySelectorAll('.circle');
// dots.forEach((element, index) => {
//   element.addEventListener('click', showPhoto(index));
// });
// console.log(dots);