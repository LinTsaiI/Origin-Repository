let attractionGroup = document.getElementById('attractions_group');
let inputField = document.getElementById('search_field');
let searchBtn = document.getElementById('search_btn')
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

function getAttractions(page) {
  fetch(`http://0.0.0.0:3000/api/attractions?page=${page}`)
    .then(response => response.json())
    .then(results => {
      let nextPage = results.nextpage;
      let attractionData = results.data   // 景點的列表
      if(attractionData) {
        for(let i = 0; i < attractionData.length; i++) {
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
            if (html.scrollTop + html.clientHeight == html.scrollHeight) {
              getAttractions(nextPage);
            }
          }
        } else {
          // 若沒有下一頁則停止偵測 scroll event
          window.onscroll = () => false;
        }
      }
    })
    .catch(error => console.log('Error: ' + error))
}

function getKeywordAttractions() {
  let keyword = inputField.value;
  if(keyword != '') {
    searchBtn.removeEventListener('click', () => false);
    fetch(`http://0.0.0.0:3000/api/attractions?keyword=${keyword}`)
      .then(response => response.json())
      .then(results => {
        let nextPage = results.nextpage;
        let attractionData = results.data
        if(!attractionData) {
          if(!document.getElementById('msg')) {
            document.querySelectorAll('.attraction').forEach(e => e.remove());
            let msg = document.createElement('div');
            msg.id = 'msg';
            attractionGroup.appendChild(msg).innerHTML = '查無此結果';
          } 
        } else {
          document.querySelectorAll('.attraction').forEach(e => e.remove());   // 先將原先畫面loading的結果清除
          if(document.getElementById('msg')) {
            document.getElementById('msg').remove();
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
                if (html.scrollTop + html.clientHeight == html.scrollHeight) {
                  getAttractions(nextPage);
                }
              }
            } else {
              window.onscroll = () => false;
            }
          } else {
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
                if (html.scrollTop + html.clientHeight == html.scrollHeight) {
                  getAttractions(nextPage);
                }
              }
            } else {
              window.onscroll = () => false;
            }
          }
        }
      })
      .catch(error => console.log('Error: ' + error))
  }
}


window.addEventListener('load', () => getAttractions(0));
searchBtn.addEventListener('click', getKeywordAttractions);

