let attractionGroup = document.getElementById('attractions_group');
let inputField = document.getElementById('search_field');
let searchBtn = document.getElementById('search_btn')
let isLoading = false;
/*
生成一個 attraction 區塊
<div class='attraction'>
  <img id='attraction_img' src='../static/img/demo.png'>
  <div id='title'>平安鐘</div>
  <div class='info'>
    <div id='mrt'>忠孝復興</div>
    <div id='category'>公共藝術</div>
  </div>
</div>
*/
function createItem(imgURL, title, mrt, category) {
  let attraction = document.createElement('div');
  attraction.className = 'attraction';
  let attraction_img = document.createElement('img');
  attraction_img.id = 'attraction_img';
  attraction_img.src = imgURL;
  let titleNode = document.createElement('div');
  titleNode.id = 'title';
  titleNode.innerHTML = title;
  let infoNode = document.createElement('div');
  infoNode.className = 'info';
  let mrtNode = document.createElement('div');
  mrtNode.id = 'mrt';
  mrtNode.innerHTML = mrt;
  let categoryNode = document.createElement('div');
  categoryNode.id = 'category';
  categoryNode.innerHTML = category;
  attraction.appendChild(attraction_img);
  attraction.appendChild(titleNode);
  attraction.appendChild(infoNode);
  infoNode.appendChild(mrtNode);
  infoNode.appendChild(categoryNode);
  return attraction;
}

function renderAttractions(attractionData, nextPage, keyword=[]) {
  for (let i = 0; i < attractionData.length; i++) {
    let imgURL = attractionData[i].images[0];
    let title = attractionData[i].name;
    let mrt = attractionData[i].mrt;
    let category = attractionData[i].category;
    let attraction = createItem(imgURL, title, mrt, category);
    attractionGroup.appendChild(attraction);
  }
  if (nextPage) {
    let html = document.documentElement
    window.onscroll = function () {
      if (html.scrollTop + html.clientHeight + 40 >= html.scrollHeight) {
        getAttractions(nextPage, keyword)
          .then(results => {
            let attractionData = results[0];
            let nextPage = results[1];
            renderAttractions(attractionData, nextPage, keyword);
          })
      }
    }
  } else {
    // 若沒有下一頁則停止偵測 scroll event
    window.onscroll = () => false;
  }
}

// 取得景點資訊
async function getAttractions(page=0, keyword=[]) {
  if (!isLoading) {
    isLoading = true
    let data = await fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
      .then(response => response.json())
      .then(results => {
        let nextPage = results.nextpage;
        let attractionData = results.data;
        return [attractionData, nextPage];
      })
      .catch(error => console.log('Error: ' + error))
    isLoading = false;
    return data;
  }
}

// 進入首頁載入頁面
function load() {
  getAttractions()
    .then(results => {
      let attractionData = results[0];
      let nextPage = results[1];
      renderAttractions(attractionData, nextPage);
    })
}

let previousInput;
// 輸入關鍵字
function getKeywordAttractions() {
  let keyword = inputField.value;
  if (keyword != '' && keyword != previousInput) {
    previousInput = keyword;
    attractionGroup.innerHTML = '';  // 清除原本頁面
    getAttractions(0, keyword)
      .then(results => {
        let attractionData = results[0];
        let nextPage = results[1];
        // 沒抓到景點
        if (!attractionData) {
            let msg = document.createElement('div');
            msg.id = 'msg';
            attractionGroup.appendChild(msg).innerHTML = `查無「${keyword}」結果`;
        } else {   // 有抓到景點
            renderAttractions(attractionData, nextPage, keyword);
        }
      })
      .catch(error => console.log('Error: ' + error))
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