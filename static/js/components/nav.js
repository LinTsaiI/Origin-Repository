class Navigation extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <div class='navigation_block'>
        <div class='navigation'>
          <a href='/'><div class='page_name'>台北一日遊</div></a>
          <div class='btn_container'>
            <div id='booking_btn'>預定行程</div>
            <div id='sign_btn'>登入/註冊</div>
            <div id='signout'>登出系統</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('nav-component', Navigation);