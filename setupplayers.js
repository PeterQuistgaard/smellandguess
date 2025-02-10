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
    //only if element has classname 'btn-delete'
    if(event.target.classList.contains('btn-delete')){
      let playername=event.target.nextElementSibling.innerHTML;
       deletePlayer(playername);
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
  
  function deletePlayer(playerName) {
    console.log("delete",playerName)
    var index = players.indexOf(playerName);
    if (index !== -1) {
      players.splice(index, 1);
      setPlayers(players);
      localStorage.removeItem("game");  //fjerner aktuelt game fra localStorage da index til brugere nu er ændret
      location.reload();
    }
  }

  function addPlayer(playerName) {
    players.push(playerName);
    setPlayers(players);//save to loalstorage

    localStorage.removeItem("game");  //fjerner aktuelt game fra localStorage da index til brugere nu er ændret
    location.reload();
  }

  function drawContainerPlayers() {
    const fragment = document.createDocumentFragment();

    players.forEach((item) => {
      
      div = document.createElement("DIV");
      
      deletebutton = document.createElement("BUTTON");

      deletebutton.classList.add("btn-delete");
      deletebutton.classList.add("btn");
      deletebutton.classList.add("btn-secondary");
      deletebutton.classList.add("btn-sm");
      deletebutton.innerText = "x";
      div.appendChild(deletebutton);
      span = document.createElement("SPAN");
      span.innerText=item;
      div.append(span);
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