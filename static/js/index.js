let attractionGroup = document.getElementById('attractions_group');
let inputField = document.getElementById('search_field');
let searchBtn = document.getElementById('search_btn');

let isLoading = false;

// Model: 取得景點列表
function getAttractions(page = 0, keyword = []) {
  if (!isLoading) {
    isLoading = true;
    let data = fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
      .then(response => response.json())
      .then(results => {
        let nextPage = results.nextpage;
        let attractionData = results.data;
        isLoading = false;
        return [attractionData, nextPage];
      })
      .catch(error => console.log('Error: ' + error))
    return data;
  }
}

// View: 產生一個景點 div 區塊
function createItem(id, imgURL, title, mrt, category) {
  let attraction = document.createElement('div');
  attraction.className = 'attraction';
  // attraction.href = `/attraction/${id}`
  attraction.setAttribute('onclick', `location.href='/attraction/${id}'`);
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
        let data = await getAttractions(nextPage, keyword);
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
  msg.id = 'msg';
  attractionGroup.appendChild(msg).textContent = `查無「${keyword}」結果`;
}


// Controller: 頁面初始化，載入畫面
async function load() {
  let userData = await getUserStatus();
  showBtn(userData);
  let data = await getAttractions();
  renderAttractions(data[0], data[1]);
}

let previousInput;
// Controller: 輸入關鍵字
async function getKeywordAttractions() {
  let keyword = inputField.value;
  if (keyword != '' && keyword != previousInput) {
    previousInput = keyword;
    attractionGroup.textContent = '';  // 清除原本頁面
    let data = await getAttractions(0, keyword);
    // 沒抓到景點
    if (!data[0]) {
      showMessage(keyword);
    } else {   // 有抓到景點
      renderAttractions(data[0], data[1], keyword);
    }
  } else if (keyword != '' && keyword == previousInput) {
    return false;
  }
}


window.addEventListener('load', load);
searchBtn.addEventListener('click', getKeywordAttractions);
inputField.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});