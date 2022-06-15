let attractionGroup = document.getElementById('attractions_group');
let inputField = document.getElementById('search_field');
let searchBtn = document.getElementById('search_btn');

let isLoading = false;
let data;

// Model: 取得景點列表
function getAttractions(page = 0, keyword = []) {
  if (!isLoading) {
    isLoading = true;
    return fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
      .then(response => response.json())
      .then(results => {
        data = [results.data, results.nextpage];
        isLoading = false;
        return data;
      })
      .catch(error => console.log('Error: ' + error))
  }
}

// View: 產生一個景點 div 區塊
function createItem(id, imgURL, title, mrt, category) {
  let attraction = document.createElement('div');
  attraction.className = 'attraction';
  attraction.onclick = () => location.href = `/attraction/${id}`;
  let attraction_img = document.createElement('img');
  attraction_img.id = 'attraction_img';
  attraction_img.src = imgURL;
  let titleNode = document.createElement('div');
  titleNode.id = 'title';
  titleNode.textContent = title;
  let infoNode = document.createElement('div');
  infoNode.className = 'info';
  let mrtNode = document.createElement('div');
  mrtNode.id = 'mrt';
  mrtNode.textContent = mrt;
  let categoryNode = document.createElement('div');
  categoryNode.id = 'category';
  categoryNode.textContent = category;
  attraction.appendChild(attraction_img);
  attraction.appendChild(titleNode);
  attraction.appendChild(infoNode);
  infoNode.appendChild(mrtNode);
  infoNode.appendChild(categoryNode);
  return attraction;
}

// View: 根據景點列表在畫面上畫出景點區塊
function renderAttractions(attractionData, nextPage, keyword=[]) {
  for (let i = 0; i < attractionData.length; i++) {
    let id = attractionData[i].id;
    let imgURL = attractionData[i].images[0];
    let title = attractionData[i].name;
    let mrt = attractionData[i].mrt;
    let category = attractionData[i].category;
    let attraction = createItem(id, imgURL, title, mrt, category);
    attractionGroup.appendChild(attraction);
  }
  if (nextPage) {
    let html = document.documentElement;
    window.onscroll = async function () {
      if (html.scrollTop + html.clientHeight + 40 >= html.scrollHeight) {
        showLoadingIcon();
        await getAttractions(nextPage, keyword);
        document.getElementById('loading_icon').remove();
        renderAttractions(data[0], data[1], keyword);
      }
    }
  } else {
    // 若沒有下一頁則停止偵測 scroll event
    window.onscroll = () => false;
  }
}

// View: 顯示查無結果訊息
function showMessage(keyword) {
  let msg = document.createElement('div');
  msg.className = 'no_search_msg';
  attractionGroup.appendChild(msg).textContent = `查無「${keyword}」結果`;
}

// View: 初始後再次顯示 loading icon
function showLoadingIcon() {
  let loadingIcon = document.createElement('div');
  loadingIcon.id = 'loading_icon';
  let footer = document.getElementById('footer');
  let body = document.getElementsByTagName('body')[0];
  body.insertBefore(loadingIcon, footer);
}


// Controller: 頁面初始化，載入畫面
async function load() {
  userData = await getUserStatus();
  showBtn(userData);
  await getAttractions();
  document.getElementById('loading_icon').remove();
  renderAttractions(data[0], data[1]);
}

let previousInput;
// Controller: 輸入關鍵字
async function getKeywordAttractions() {
  let keyword = inputField.value;
  if (keyword != '' && keyword != previousInput) {
    previousInput = keyword;
    attractionGroup.textContent = '';  // 清除原本頁面
    await getAttractions(0, keyword);
    // 沒抓到景點
    if (!data[0]) {
      showMessage(keyword);
      window.onscroll = () => false;
    } else {   // 有抓到景點
      renderAttractions(data[0], data[1], keyword);
    }
  } else if (keyword != '' && keyword == previousInput) {
    return false;   // 若輸入的 keyword 沒變就不再重打 API
  }
}


window.addEventListener('load', load);
searchBtn.addEventListener('click', getKeywordAttractions);
inputField.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});