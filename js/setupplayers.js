"use strict";
import i18next from '../lib/i18next.js';
import {langAvailableHomepage,langAvailableGame} from './constants.js';
import { drawlanguagemenuDD} from "./smellsutil.js";


document.addEventListener("DOMContentLoaded", function () {



  //Global variables
  let players;




  //references to UI elements
  const containerplayers = document.getElementById("containerplayers");
  const userlanguageselector = document.getElementById("userlanguageselector");

  const userlanguageselectordropdownmenu = userlanguageselector.querySelector(".dropdown-menu")
  const userimgselectedlang = userlanguageselector.querySelector(".userimgselectedlang")
  const usertxtlanguage = document.getElementById("userlanguage");


  const userlanguage = document.getElementById("userlanguage");




    /**
     * Retrieve user-preferred locales from browser
     *
     * @param {boolean} languageCodeOnly - when true, returns
     * ["en", "fr"] instead of ["en-US", "fr-FR"]
     * @returns array | undefined
     */
    function browserLocales(languageCodeOnly = false) {
      return navigator.languages.map((locale) =>
        languageCodeOnly ? locale.split("-")[0] : locale,
      );
    }
  
  

    // const navigatorlanguages = browserLocales()[0];//first language from browser - tjek for undefined!!



function setdefaultlanguage(){
      let _lan=i18next.language;

      const navigatorlanguages = browserLocales()
      //navigatorlanguages not undefined and first browserlanguage is in array langAvailableGame but not in langAvailableHomepage
      if(navigatorlanguages && !langAvailableHomepage.includes(navigatorlanguages[0]) && langAvailableGame.includes(navigatorlanguages[0] )){
        _lan=navigatorlanguages[0];
        console.log("LANGUAGE from browser")
      }
      usertxtlanguage.value = _lan;
      userimgselectedlang.src = `./images/flagslanguage/${_lan}.png`
}
setdefaultlanguage()


  userimgselectedlang.alt = `Select language`

  document.getElementById("btnAddPlayer").addEventListener("click", (e) => {
    e.preventDefault();
    let playerName = document.getElementById("txtPlayerName").value;

    let userlang = document.getElementById("userlanguage").value;

    if (playerName) {

      let _player = {
        name: playerName,
        lang: userlang
      }

      addPlayer(_player);

    }
  });


  //#region change
 

  function drawDropdown() {
    const fragment = document.createDocumentFragment();


    langAvailableGame.forEach(lang => {
      const li = document.createElement("LI");
      li.classList.add("dropdown-item");
      li.classList.add("dropdown-item");
      li.setAttribute("data-lang", lang);
      const img = document.createElement("IMG");
      img.setAttribute("src", `./images/flagslanguage/${lang}.png`);
      img.setAttribute("alt", lang);
      img.style.width = "20px"
      li.appendChild(img)
      fragment.appendChild(li)
    });
    userlanguageselectordropdownmenu.appendChild(fragment)
  };

  drawDropdown();

  userlanguageselectordropdownmenu.addEventListener("click", (e) => {
    const _li = e.target.closest(`li`)

    if (_li.hasAttribute("data-lang")) {
      let selectedlang = _li.getAttribute("data-lang")
      //change img in menu
      userimgselectedlang.src = `./images/flagslanguage/${selectedlang}.png`
      usertxtlanguage.value = selectedlang
    }
  }, false)

  //#endregion


  //add listener to all elements in containerplayers
  document.getElementById("containerplayers").addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.hasAttribute("data-id")) {
      let playerIdx = event.target.getAttribute("data-id")
      deletePlayer(playerIdx);
    }
  });


  function setPlayers(players) {
    localStorage.setItem("players", JSON.stringify(players));
  };

  function getPlayers() {
    const value = localStorage.getItem("players") || initPlayers();
    return JSON.parse(value);
  }

  function initPlayers() {
    const defaultplayers = [];
    setPlayers(defaultplayers);
    return JSON.stringify(defaultplayers);
  }

  function getPlayerNameById(id) {
    let name = players[id];
    return name;
  }

  function deletePlayer(playerIdx) {
    players.splice(playerIdx, 1);
    setPlayers(players);
    localStorage.removeItem("game2");  //fjerner aktuelt game fra localStorage da index til brugere nu er ændret
    location.reload();

  }

  function addPlayer(player) {
    players.push(player);
    setPlayers(players);//save to loalstorage

    localStorage.removeItem("game2");  //fjerner aktuelt game fra localStorage da index til brugere nu er ændret
    location.reload();
  }

  function drawContainerPlayers() {
    const fragment = document.createDocumentFragment();

    players.forEach((item) => {
      // console.log("INDEX", item)
      const div = document.createElement("DIV");
      //div.style.border="solid 1px"

      div.classList.add("p-2")
      div.classList.add("border")
      div.classList.add("rounded")


      const deletebutton = document.createElement("I");
      deletebutton.classList.add("fa");
      deletebutton.classList.add("fa-times");
      deletebutton.classList.add("mx-2");
      deletebutton.classList.add("float-end");
      //deletebutton.classList.add("cursor-pointer")

      deletebutton.setAttribute("aria-hidden", "true")
      deletebutton.setAttribute("data-id", players.indexOf(item))
      deletebutton.setAttribute("role", "button")


      let img = document.createElement("IMG");
      img.classList.add("mx-2");
      img.style.width = "20px";



      img.setAttribute("src", `./images/flagslanguage/${item.lang}.png`)
      img.setAttribute("alt", item.lang)

      const span = document.createElement("SPAN");
      span.innerText = item.name;
      div.append(span);
      div.append(img)
      div.appendChild(deletebutton);
      fragment.appendChild(div);
    }
    );
    containerplayers.innerHTML = "";
    containerplayers.appendChild(fragment);

    //console.log(containerplayers)
  };






  players = getPlayers();
  drawContainerPlayers();

    const languageselectordropdownmenu = document.querySelector("#languageselector>.dropdown-menu")
    drawlanguagemenuDD(languageselectordropdownmenu)

});