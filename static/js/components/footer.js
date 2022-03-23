const footer = document.createElement('template');
footer.innerHTML = `
  <style>
    #footer {
      width: 100%;
      font-weight: bold;
      color: #FFFFFF;
      text-align: center;
      background: #757575;
      line-height: 104px;
      position: absolute;
      margin-bottom: end;
    }
  </style>
  <div id='footer'>COPYRIGHT © 2021 台北一日遊</div>
`;

document.body.appendChild(footer.content);