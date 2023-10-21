// ==UserScript==
// @name        Adobe Reader Interface Clean
// @namespace   Violentmonkey Scripts
// @match       https://documentcloud.adobe.com/gsuiteintegration/*
// @grant       none
// @version     1.0
// @author      Luiz
// @inject-into content
// @description 21/10/2023, 13:00:30
// ==/UserScript==

var pageNumber = "--";

function addStyle(styleText) {
  let s = document.createElement("style");
  s.appendChild(document.createTextNode(styleText));
  document.getElementsByTagName("head")[0].appendChild(s);
}

addStyle(`
.newTool-wrapper {
    display: flex;
    padding: 4px;
    justify-content: center;
    align-items: center;
    height: 40px;
    box-sizing: border-box;
}
.newTool {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background: none;
    border: 1px solid transparent;
}
.newTool:active {
	border: 1px solid rgb(225, 225, 225);
}
.newTool:hover {
	background: var(--spectrum-global-color-gray-100);
	cursor: pointer;
}
.newTool svg, .newTool path {
	fill: var(--spectrum-global-color-gray-800);
}
.toolActive {
	background: rgb(0, 114, 238) !important;
}
.toolActive svg, .toolActive  path {
	fill: var(--spectrum-global-color-gray-50);
}

.hidden .SkinnyRail__Wrapper___uuKuh {
	position: fixed;
	left: 100%;
}

.hidden .PageNumberUI__PageNumberUIContainerModern___18zMT {
	position: fixed;
	bottom: 0;
	left: 0;
	zoom: 0.9;
    margin: 20px 10px;
    background: var(--dc-global-color-background) 0 0 no-repeat padding-box;;
    padding: 4px;
    width: 40px;
    box-shadow: 0 3px 6px var(--spectrum-global-color-gray-50);
    border-radius: 4px;
    box-sizing: border-box;
}

.hidden .PageNumberUI__PageNumberUIContainerModern___18zMT > * {
	margin: 0px !important;
}

.QuickTools__DesktopQuickTools___3OUTY {
	left: 10px !important;
	zoom: 0.9;
}

.HeaderContainer__header___1rgFN {
	zoom: 0.9;
	transition: .3s;
}
.hiddenHeader .HeaderContainer__header___1rgFN  {
	margin-top: -64px;
	transition: .3s;
}

`);

// Função para esperar a existência de um elemento no DOM
function waitForElementToExist(selector) {
  return new Promise((resolve) => {
    const element1 = document.querySelector(selector);

    if (element1) {
      resolve(element1);
      return;
    }

    const observer = new MutationObserver(() => {
      const element1 = document.querySelector(selector);
      if (element1) {
        resolve(element1);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
}

function newToolAction(newToolInner, selector) {
  newToolInner.classList.toggle("toolActive");
  document.querySelector("#root").classList.toggle(selector);
}


//Função para adiconar fade no header
function addToolOnQuickTools(onClickFunction, className, svg) {
  var quickToolsList = document.querySelector("#quick-tools-view");

  var newTool = document.createElement("li");
  newTool.classList.add(`${className}-wrapper`);
  var newToolInner = document.createElement("button");

  newToolInner.classList.add(className);
  newToolInner.innerHTML = svg;
  newTool.appendChild(newToolInner);

  quickToolsList.append(newTool);
  newToolInner.addEventListener("click",
    function () {
      newToolAction(this, selector);
    },
    false
  );

  newToolInner.click();
}

// Chamada da função para esperar a existência do elemento desejado
waitForElementToExist(".ReactVirtualized__Grid").then((element) => {
  getLastPage();
});

// Chamada da função para esperar a existência do elemento desejado
waitForElementToExist("#quick-tools-view").then((element) => {
  addToolOnQuickTools(
    "hiddenHeader",
    "newTool",
    `<svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>page-top</title><g id="Layer_2" data-name="Layer 2"><g id="invisible_box" data-name="invisible box"><rect width="48" height="48" fill="none"/></g><g id="icons_Q2" data-name="icons Q2"><path d="M6,6H42a2,2,0,0,1,0,4H6A2,2,0,0,1,6,6Z"/><path d="M35.4,24.5l-10-9.9a1.9,1.9,0,0,0-2.8,0l-10,9.9a2.1,2.1,0,0,0-.2,2.7,1.9,1.9,0,0,0,3,.2L22,20.8V38a2,2,0,0,0,4,0V20.8l6.6,6.6a1.9,1.9,0,0,0,3-.2A2.1,2.1,0,0,0,35.4,24.5Z"/></g></g></svg>`
  );
  addToolOnQuickTools(
    "hidden",
    "newTool",
    `<svg style="rotate: 180deg;" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" fill="#0F0F0F"/></svg>`
  );
});

//Função para atualizar a página
function getLastPage() {
  var inputPage = document.querySelector("#PageNumberUIModern").value;
  pageNumber = localStorage.getItem("actualPage") || 0;

  for (var i = 0; i < Math.abs(pageNumber - inputPage); i++) {
    document
      .querySelector(
        "#skinny-rail > div.SkinnyRail__Footer___dMjiG > aside > div:nth-child(3) > div > button"
      )
      .click();
  }
  document
    .querySelector(".ReactVirtualized__Grid")
    .classList.add("overflow-auto");

  console.log("Página alterada: ", pageNumber);
}

setInterval(function () {
  if (pageNumber != "--") {
    const saveButton =
      document.querySelector(".SaveButton__saveActionButton___1O1Jh") || null;
    var newPageNumber =
      document.querySelector("#PageNumberUIModern").value || null;

    if (saveButton != null) {
      saveButton.click();
      console.log("Salvando");
    }

    if (
      newPageNumber != null &&
      pageNumber != newPageNumber &&
      newPageNumber != "--"
    ) {
      pageNumber = newPageNumber;
      localStorage.setItem("actualPage", pageNumber);
      console.log(newPageNumber);
    }
  }
}, 5000);
