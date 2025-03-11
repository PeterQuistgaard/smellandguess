//:



document.addEventListener("DOMContentLoaded", function () {
  //Global variables
  let players;

  //references to UI elements
  const containerplayers = document.getElementById("containerplayers");

  document.getElementById("btnAddPlayer").addEventListener("click", () => {
    let playerName = document.getElementById("txtPlayerName").value;
    if (playerName) {
      addPlayer(playerName);
    }
  });

  //add listener to all elements in containerplayers
  document.getElementById("containerplayers").addEventListener('click', function(event){
    event.preventDefault();
    if(event.target.hasAttribute("data-id")){
      let playerIdx=event.target.getAttribute("data-id")
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

  function addPlayer(playerName) {
    players.push(playerName);
    setPlayers(players);//save to loalstorage

    localStorage.removeItem("game2");  //fjerner aktuelt game fra localStorage da index til brugere nu er ændret
    location.reload();
  }

  function drawContainerPlayers() {
    const fragment = document.createDocumentFragment();

    players.forEach((item) => {
      console.log("INDEX",item)
      div = document.createElement("DIV");
      
      deletebutton = document.createElement("I");
      deletebutton.classList.add("fa");
      deletebutton.classList.add("fa-times");
      deletebutton.classList.add("mx-2");
      deletebutton.setAttribute("aria-hidden", "true")     
      deletebutton.setAttribute("data-id",players.indexOf(item) )  


      
      span = document.createElement("SPAN");
      span.innerText=item;
      div.append(span);
      div.appendChild(deletebutton);
      fragment.appendChild(div);
    }
    );
    containerplayers.innerHTML = "";
    containerplayers.appendChild(fragment);
    
    console.log(containerplayers)
  };




  players = getPlayers();
  drawContainerPlayers();

});