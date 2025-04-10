//:



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

  usertxtlanguage.value=locale;
  userimgselectedlang.src=`images/flagslanguage/${locale}.png`

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
      const a = document.createElement("A");
      a.classList.add("dropdown-item");
      a.setAttribute("href", "#");
      a.setAttribute("data-lang", lang);

      const img = document.createElement("IMG");
      img.setAttribute("src", `images/flagslanguage/${lang}.png`);

      img.style.width = "20px"

      a.appendChild(img)
      li.appendChild(a)
      fragment.appendChild(li)
    });
    userlanguageselectordropdownmenu.appendChild(fragment)
  };

  drawDropdown();

  userlanguageselectordropdownmenu.addEventListener("click", (e) => {
    //e.preventDefault()

    const _a = e.target.closest(`a`)

    if (_a.hasAttribute("data-lang")) {
      let selectedlang = _a.getAttribute("data-lang")
      //change img in menu
      userimgselectedlang.src = `images/flagslanguage/${selectedlang}.png`
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
      div = document.createElement("DIV");
      //div.style.border="solid 1px"

      div.classList.add("p-2")
      div.classList.add("border")
      div.classList.add("rounded")


      deletebutton = document.createElement("I");
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



      img.setAttribute("src", `/images/flagslanguage/${item.lang}.png`)


      span = document.createElement("SPAN");
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




});