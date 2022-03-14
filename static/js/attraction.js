let url = window.location.href;
let id = url.substring(url.lastIndexOf('/')+1, url.length+1);
let rightArrow = document.getElementById('right_arrow');
let leftArrow = document.getElementById('left_arrow');
let morning = document.getElementById('morning');
let afternoon = document.getElementById('afternoon');
let morningLabel = document.getElementById('morning_label');
let afternoonLabel = document.getElementById('afternoon_label');
let currentPhoto = 0;

async function getImageList(id) {
  let data = await fetch(`/api/attraction/${id}`)
    .then(response => response.json())
    .then(result => {
      let images = result.data.images;
      return images
    })
    .catch(error => console.log('Error: ' + error))
  return data;
}

async function getAttractionData(id) {
  let data = await fetch(`/api/attraction/${id}`)
    .then(response => response.json())
    .then(result => result.data)
    .catch(error => console.log('Error: ' + error))
  return data;
}

function renderDots(num) {
  let dots = document.querySelector('.dots');
  for (let i = 0; i < num; i++) {
    let dotGroup = document.createElement('div');
    dotGroup.className = 'dot_group';
    let circle = document.createElement('div');
    circle.className = 'circle';
    dotGroup.appendChild(circle);
    dots.appendChild(dotGroup);
  }
}

function dot(index) {
  let dot = document.createElement('div');
  dot.className = 'dot';
  dot.id = 'current_dot';
  document.querySelectorAll('.circle')[index].appendChild(dot);
}

function renderAttraction(result) {
  let title = result.name;
  let category = result.category;
  let description = result.description;
  let address = result.address;
  let transport = result.transport;
  let mrt = result.mrt;
  let images = result.images;
  console.log(images.length)
  renderDots(images.length);
  dot(0);
  document.querySelector('.attraction_imgs').style.backgroundImage = `url('${images[0]}')`
  document.getElementById('title').innerHTML = title;
  document.getElementById('info').innerHTML = `${category} at ${mrt}`;
  document.getElementById('description').innerHTML = description;
  document.getElementById('address').innerHTML = address;
  document.getElementById('transport').innerHTML = transport;
}


function load(id) {
  getAttractionData(id)
    .then(result => {
      renderAttraction(result)
    })
}

function nextPhoto() {
  getImageList(id).then(images => {
    let totalNumber = images.length;
    if (currentPhoto < totalNumber - 1) {
      currentPhoto += 1;
      document.querySelector('.attraction_imgs').style.backgroundImage = `url('${images[currentPhoto]}')`;
      document.getElementById('current_dot').remove();
      dot(currentPhoto);
    } else {
      currentPhoto = 0;
      document.querySelector('.attraction_imgs').style.backgroundImage = `url('${images[currentPhoto]}')`;
      document.getElementById('current_dot').remove();
      dot(currentPhoto);
    }
  })
}

function previousPhoto() {
  getImageList(id).then(images => {
    let totalNumber = images.length;
    if (currentPhoto > 0) {
      currentPhoto -= 1;
      document.querySelector('.attraction_imgs').style.backgroundImage = `url('${images[currentPhoto]}')`;
      document.getElementById('current_dot').remove();
      dot(currentPhoto);
    } else {
      currentPhoto = totalNumber - 1;
      document.querySelector('.attraction_imgs').style.backgroundImage = `url('${images[currentPhoto]}')`;
      document.getElementById('current_dot').remove();
      dot(currentPhoto);
    }
  })
}

function showMorningPrice() {
  afternoonLabel.style.visibility = 'hidden';
  morningLabel.style.visibility = 'visible';
  document.querySelector('.price').innerHTML = '&nbsp新台幣&nbsp2000&nbsp元';
}

function showAfternoonPrice() {
  morningLabel.style.visibility = 'hidden';
  afternoonLabel.style.visibility = 'visible';
  document.querySelector('.price').innerHTML = '&nbsp新台幣&nbsp2500&nbsp元';
}

window.addEventListener('load', load(id))
rightArrow.addEventListener('click', nextPhoto);
leftArrow.addEventListener('click', previousPhoto);
morning.addEventListener('click', showMorningPrice);
afternoon.addEventListener('click', showAfternoonPrice);


