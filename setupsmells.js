//:

document.addEventListener("DOMContentLoaded", function () {
  //Global variables
  let id = -1;
  let nextplayerindex = -1;
  let players;
  let smells;
  let game;
  let smellArray = [];//PQ


  /* #region scanner */
  const video = document.createElement("video");
  const canvasElement = document.getElementById("canvas");
  const canvas = canvasElement.getContext("2d");
  const loadingMessage = document.getElementById("loadingMessage");
  const outputContainer = document.getElementById("output");
  const outputMessage = document.getElementById("outputMessage");
  const outputData = document.getElementById("outputData");
  const scanstart = document.getElementById("scanstart");
  const scanstop = document.getElementById("scanstop");
  const clearAllSmells = document.getElementById("clearAllSmells");


  const defaultsmells = [
    { id: 0, name: "Hindbær" },
    { id: 1, name: "Lime" },
    { id: 2, name: "Timian" },
    { id: 3, name: "Eddike" },
    { id: 4, name: "Karry" },
    { id: 5, name: "Karamel" },
    { id: 6, name: "Ananas" },
    { id: 7, name: "Pebermynte" },
    { id: 8, name: "Kamille" },
    { id: 9, name: "Kirsebær" },
    { id: 10, name: "Abrikos" },
    { id: 11, name: "Kardemomme" },
    { id: 12, name: "Allehånde" },
    { id: 13, name: "Koriander" },
    { id: 14, name: "Spidskommen" },
    { id: 15, name: "Kaffe" },
    { id: 16, name: "Kanel" },
    { id: 17, name: "Mandel" },
    { id: 18, name: "Vanilje" },
    { id: 19, name: "Nellike" },
    { id: 20, name: "Rosmarin" },
    { id: 21, name: "Muskat" },
    { id: 22, name: "Ingefær" },
    { id: 23, name: "Cayenne" },
    { id: 24, name: "Anis" },
    { id: 25, name: "Banan" },
    { id: 26, name: "Kokos" },
    { id: 27, name: "Peanuts" },
    { id: 28, name: "Mandarin" },
    { id: 29, name: "Jordbær" }
  ];

  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x + canvas.width / 4, begin.y + canvas.height / 4);
    canvas.lineTo(end.x + canvas.width / 4, end.y + canvas.height / 4);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  function drawRect(color,width=4) {
    let oneforth = canvasElement.width / 4;
    canvas.beginPath();
    canvas.rect(canvasElement.width / 4, canvasElement.height / 4, canvasElement.width / 2, canvasElement.height / 2);
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    canvas.stroke();
  }


  /*Wrap jsQR in promise make it posible to run as async/await */
  var jsQRpromise = function (myimg) {
    return new Promise(function (resolve) {
      var code = jsQR(myimg.data, myimg.width, myimg.height, {
        inversionAttempts: "dontInvert",
      });
      resolve(code);
    });
  };


  //function tick() {      
  const tick = async () => {
    loadingMessage.innerText = "⌛ Loading video..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      loadingMessage.hidden = true;
      canvasElement.hidden = false;
      outputContainer.hidden = false;

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;

      //video-frame tegnes som billede på canvas 
      canvas.drawImage(video, 0, 0, canvasElement.width * 1, canvasElement.height * 1);
      //canvas.drawImage(video, 0, 0, canvasElement.width*1.5, canvasElement.height*1.5);

      var imageData = canvas.getImageData(canvasElement.width / 4, canvasElement.height / 4, canvasElement.width / 2, canvasElement.height / 2);


      let code = await jsQRpromise(imageData);


      //var code = jsQR(imageData.data, imageData.width, imageData.height, {
      //inversionAttempts: "dontInvert", 
      //});

      if (code) {

        drawRect("green",15);
        outputMessage.hidden = false;
        outputData.parentElement.hidden = true;
        // outputData.innerText = code.data;

        id = parseInt(code.data);

        setupmode = true
        if (setupmode == true) {
          const isExist = smells.some(f => f.id == id)
          if (!isExist) {
            let newsmell = {
              "id": id,
              "name": getSmellNameById(id)
            }
            smells.push(newsmell);
            setSmells(smells);

            if (localStorage.getItem("game") != null) {
              localStorage.removeItem("game"); //if exist    
            }
          }

          containersmells.innerHTML = "";
          let count = document.createElement("span");
          count.innerHTML=smells.length;
          outputMessage.innerHTML = smells.length;

         // containersmells.appendChild(count);
          
          smells.forEach((item) => {
            div = document.createElement("div");
            div.setAttribute('data-id', item.id);
            if (item.id == id) {
              div.classList.add("currentDiv")
            }

            div.classList.add("me-1");
            div.innerHTML = item.name;
            containersmells.appendChild(div);
          }
          );

        }
      } else {
        drawRect("red")
        //outputMessage.hidden = false;
        //outputData.parentElement.hidden = true;
      }
    }
    requestAnimationFrame(tick);//Enten er der ikke ENOUGH_DATA eller også er der ikke fundet en QR kode. Så vi prøver med en ny frame!
  }


  function stopStreamedVideo(videoElem) {

    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });
    videoElem.srcObject = null;
    scanstop.hidden = true;
    scanstart.hidden = false;
    setTimeout(() => canvasElement.hidden = true, 1000)//vent 1 sek og skjul derefter cancas


  }

  function startScanner() {
    loadingMessage.hidden = false;

    navigator.mediaDevices.getUserMedia(
      {
        audio: false,
        video: {
          facingMode: "environment",
          //width: { min: 1024, ideal: 1280, max: 1920 },
          //height: { min: 576, ideal: 720, max: 1080 }
        }
      }
    )
      .then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
        scanstart.hidden = true;
        scanstop.hidden = false;
      }
      ).catch((err) => {
        /* handle the error */
        loadingMessage.innerText = "🎥 Unable to access video stream (please make sure you have a webcam enabled)"
        console.log(err);
      });;
  }

  scanstart.addEventListener("click", (e) => {
    e.preventDefault();


    //hide result
    // containertotalscore.innerHTML = "";
    containerplayer.innerHTML = "";

    //btnGetTotalScore.hidden = true;
    startScanner();

  });

  scanstop.addEventListener("click", (e) => {
    e.preventDefault();
    stopStreamedVideo(video);
  });



  clearAllSmells.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("smells");
    //containersmells.innerHTML="";

    location.reload();//genindlæs siden
  });


  /* #endregion scanner */



  let setupmode;

  //references to UI elements
  const containerplayer = document.getElementById("containerplayer");
  //const containertotalscore = document.getElementById("containertotalscore");
  const containerplayers = document.getElementById("containerplayers");
  const containersmellguess = document.getElementById("containersmellguess");
  const containersmells = document.getElementById("containersmells");
  //  const btnClearGame = document.getElementById("btnClearGame");
  //const btnGetTotalScore = document.getElementById("btnGetTotalScore");

  // const containersetup = document.getElementById("containersetup");
  // const btnShowSetup = document.getElementById("btnShowSetup");



  //init or get from localstorage
  players = getPlayers();
  smells = getSmells();
  game = getGame();



  containersmells.innerHTML = "";

  smells.forEach((item) => {
    div = document.createElement("div");
    div.setAttribute('data-id', item.id);
    // div.classList.add("btn");
    // div.classList.add("btn-light");
    div.classList.add("me-1");
    div.innerHTML = item.name;
    containersmells.appendChild(div);

    // localStorage.removeItem("game");
    // initGame(smells, players);
  }
  );




  function setGame(game) {
    localStorage.setItem("game", JSON.stringify(game));
  };

  function setPlayers(players) {
    localStorage.setItem("players", JSON.stringify(players));
  };

  function setSmells(smells) {
    localStorage.setItem("smells", JSON.stringify(smells));
  };

  function getGame() {
    //get from localstorage or init new game if not exist
    const value = localStorage.getItem("game") || initGame(smells, players);
    return JSON.parse(value);
  }


  function getPlayers() {
    const value = localStorage.getItem("players") || initPlayers();
    return JSON.parse(value);
  }


  function getSmells() {
    const value = localStorage.getItem("smells") || initSmells();
    return JSON.parse(value);
  }

  function initPlayers() {
    const defaultplayers = [];
    setPlayers(defaultplayers);
    return JSON.stringify(defaultplayers);
  }

  function initSmells() {
    //const shuffledSmellArray = defaultsmells.sort((a, b) => 0.5 - Math.random());
    //setSmells(shuffledSmellArray);
    //return JSON.stringify(shuffledSmellArray);
    return JSON.stringify([]);
    //let _emptysmells = [];
    //return _emptysmells;
  }

  function initGame(smells, players) {
    let _emptygame = [];
    smells.forEach((item => {
      item.Guesses = Array.from({ length: players.length }, () => -1);
      item.Points = Array.from({ length: players.length }, () => -1);
      _emptygame.push(item);
    }))
    //console.log("GAME", _emptygame);
    setGame(_emptygame);
    return JSON.stringify(_emptygame);
  };



  /* Hente parmetre fra querystring*/
  //const params = new URLSearchParams(window.location.search.substr(1));

  /*henter specifik parametren id fra querystring. Består af en række ubrugte værdier for at sløre id på glasset.*/
  // const idstring = params.get("id");



  // if (idstring) {
  //   //id=idstring.charAt(21);//I position 21 står 1'er og i pos 25 står 10'er
  //   id = idstring.charAt(27) * 10 + idstring.charAt(21) * 1
  //   console.log(id)
  // }

  // function givePoint(userid, smellid, point) {
  //   let round = game.find(field => field.id == smellid)
  //   console.log(round);
  //   round.Points[userid] = point;
  //   setGame(game);
  // }

  // function setmove(userid, smellid, guessid) {


  //   let txtSmellguess = getSmellNameById(guessid);
  //   let txtSmellInGlass = getSmellNameById(smellid);
  //   let point = 0;
  //   if (txtSmellguess.toLowerCase() === txtSmellInGlass.toLowerCase()) {
  //     point = 1;
  //   }

  //   game.find(field => field.id == smellid).Guesses[userid] = txtSmellguess;
  //   game.find(field => field.id == smellid).Points[userid] = point;

  //   setGame(game);
  // }

  function setmove(userid, smellid, guessid) {


    // let txtSmellguess = getSmellNameById(guessid);
    // let txtSmellInGlass = getSmellNameById(smellid);
    let point = 0;
    if (guessid === smellid) {
      point = 1;
    }

    game.find(field => field.id == smellid).Guesses[userid] = guessid;
    game.find(field => field.id == smellid).Points[userid] = point;

    setGame(game);
  }

  // function setmovefreetext(userid, smellid, txtSmellguess) {

  //   let txtSmellInGlass = getSmellNameById(smellid);
  //   let point = 0;
  //   if (txtSmellguess.toLowerCase() === txtSmellInGlass.toLowerCase()) {
  //     point = 1;
  //   }
  //   game.find(field => field.id == smellid).Guesses[userid] = txtSmellguess;
  //   game.find(field => field.id == smellid).Points[userid] = point;

  //   setGame(game);
  // }


  //hent players guesses på en smell id. 
  //hvis ingen endnu har afgivet gæt returneres -1 som er default 
  function getRound(smellid) {
    //console.log("ROUND",gameround);
    let _round = game.find(field => field.id == smellid);
    console.log("_round", _round)
    //if (_round === undefined) {
    //   addSmell(smellid);//hvis smell ikke er oprettet ved init 
    // return -1;//smell er ikke sat op tl dette spil
    // }

    if (_round) {
      console.log("_round.Guesses", _round.Guesses)
      return _round.Guesses;
    }

    return 0;
  }




  function getPointsByUserIndex(userIdx) {
    let userpoints = 0;
    let _game = game.filter(
      (item) =>
        // item.isactive &&
        // item.isactive == true &&
        !item.Guesses.some((guess) => guess == -1) //alle skal have gættet før en smell vises
    );
    _game.forEach((item, index) => {
      let point = item.Points[userIdx];
      userpoints += point;
    });
    return userpoints;
  }


  function getSmellNameById(id) {
    if (id === -1) return "";
    _smell = defaultsmells.find(field => field.id == id);
    if (_smell == undefined) {
      return "";
    }
    let name = _smell.name;
    return name;
  }


  function getPlayerNameById(id) {
    let name = players[id];
    return name;
  }

  //function removing class active form siblings and set active om current element
  // const setActiveAndRemoveFromSiblings = el => {
  //   [...el.parentElement.children].forEach(sibling => sibling.classList.remove('active'));
  //   el.classList.add('active');
  // }

  function getRoundResult(id) {
    //containertotalscore.innerHTML = "";

    let _round = getRound(id);// array med gæt  

    const fragment = document.createDocumentFragment();
    div = document.createElement("DIV");
    let rigtigtsvar = getSmellNameById(id);
    div.append(`Det rigtige svar var: ${rigtigtsvar} `)
    fragment.appendChild(div);
    ul = document.createElement("UL");

    for (let index = 0; index < _round.length; index++) {

      // console.log("PP", _points[index]);
      li = document.createElement("LI");
      spanplayer = document.createElement("SPAN");
      spanplayerguess = document.createElement("SPAN");

      //let correctGuess = rigtigtsvar.toLowerCase() == _round[index].toLowerCase() ? true : false;
      let correctGuess = id == _round[index] ? true : false;


      if (correctGuess) {
        spanplayerguess.setAttribute("class", "text-success");
      }
      else {
        spanplayerguess.setAttribute("class", "text-danger");
      }


      //let tmpPoint = 0;

      // if (correctGuess == true) {
      //   tmpPoint = 1;
      // }

      //tmpPoint = _points[index];

      spanplayer.append(`${players[index]}: `);
      //console.log(_round[index]);
      spanplayerguess.append(getSmellNameById(_round[index]));

      li.append(spanplayer, spanplayerguess);
      /*
                spanpointbuttons=document.createElement("SPAN"); 
                for (let p = 0; p <=3 ; p++) {
                  const button = document.createElement("BUTTON");
                  button.innerText=p;
                  if(tmpPoint==p){
                      button.classList.add("active");
                  }
                  button.addEventListener("click",(e)=>{
                      setActiveAndRemoveFromSiblings(e.target);
      
                      let userIndex=index;
                      givePoint(userIndex,id,parseInt(button.innerText));
                  })
                  spanpointbuttons.appendChild(button);
                }
                li.appendChild(spanpointbuttons);
                */
      ul.appendChild(li);
      fragment.appendChild(ul);
    }

    //containertotalscore.appendChild(fragment)
  }



  /**/
  function setNextplayer() {
    containerplayer.hidden = false;
    let playersThisSmell = getRound(id);
    console.log("playersThisSmell", playersThisSmell);
    console.log("id", id);
    if (playersThisSmell) {

      nextplayerindex = playersThisSmell.findIndex(rank => rank === -1);
      console.log("nextplayerindex", nextplayerindex);

      if (playersThisSmell == 0) {
        //spillet er ikke sat om med brugere
        containerplayer.style.color = "red";
        containerplayer.style.backgroundColor = "Black";
        containerplayer.innerText = "Ingen spillere er oprettet!";

        containersmells.innerHTML = "Opret én eller flere spillere!";
        //btnGetTotalScore.hidden = true;//vis knappen "Get total score"
      }
      // else if(playersThisSmell==-1){
      //   //spillet er ikke sat om med brugere
      //   containerplayer.style.color = "red";
      //   containerplayer.style.backgroundColor = "Black";
      //   containerplayer.innerText = "Denne lugt er ikke sat op til dette spil!";       
      //   containersmells.innerHTML = "";
      //   btnGetTotalScore.hidden = true;//vis knappen "Get total score"
      // }
      else if (nextplayerindex == -1) {
        //ikke flere spillere i denne runde
        containerplayer.style.color = "yellow";
        containerplayer.style.backgroundColor = "Black";
        containerplayer.innerText = "Alle har givet deres gæt på dette glas";
        getRoundResult(id);//vis resultatet for runden
        containersmells.innerHTML = "";
        // btnGetTotalScore.hidden = false;//vis knappen "Get total score"
      }
      else {
        //btnGetTotalScore.hidden = true;//skjul knappen totalscore
        let nextPlayerName = getPlayerNameById(nextplayerindex);
        containerplayer.innerText = nextPlayerName;
        containerplayer.style.backgroundColor = generateHSLByName(nextPlayerName);//sæt players color som beregnes ud fra navne       
      }

    }
  }


  /*   if(nextplayerindex==-1){
      //Ikke flere spillere i denne runde - alle har afgivet et gæt på indholdet i glasset
    console.log("nextplayerindex",nextplayerindex)  
      
      containersmells.innerHTML="";                
  } */

  //btnClearGame.addEventListener("click", clearGame)



  /*Nulstiller game i localstorage for at starter et nyt spil*/
  function clearGame() {
    localStorage.removeItem("game");
    initGame(smells, players)
    location.reload();//genindlæs siden
  }






  function drawSmellButtons() {
    containersmells.innerHTML = "";
    if (nextplayerindex == -1) return;
    containersmells.innerHTML = "Næste spiller";

    //sætter en timeout før smellbuttons vises. Så ved spilleren at turen skifter.
    setTimeout(() => {
      const fragment = document.createDocumentFragment();
      // let _game0 = game.filter((item) => item.isactive && item.isactive == true);
      // let _game = _game0.sort((a, b) => 0.5 - Math.random());//Shuffel - så brugerne lettere kan skjule hvor på iPad de trykker
      let _game0 = game.filter((item) => item);
      let _game = _game0.sort((a, b) => 0.5 - Math.random());//Shuffel - så brugerne lettere kan skjule hvor på iPad de trykker

      _game.forEach((item) => {
        div = document.createElement("button");
        div.setAttribute('data-id', item.id);
        div.classList.add("btn");
        div.classList.add("btn-light");
        div.classList.add("me-1");
        div.innerHTML = item.name;
        div.addEventListener("click", (e) => {
          setmove(nextplayerindex, id, item.id);
          setNextplayer();
          drawSmellButtons();
        });

        fragment.appendChild(div);
      }
      );

      containersmells.innerHTML = "";
      containersmells.appendChild(fragment);

    }, 1000);

  };

  // setNextplayer();
  // drawSmellButtons();



  //Setup
  //drawContainerPlayers();




  // console.table(players);
  // console.table(smells);
  // console.table("GAME:", game);



  // function deletePlayer(playerName) {
  //   var index = players.indexOf(playerName);
  //   if (index !== -1) {
  //     players.splice(index, 1);
  //     setPlayers(players);
  //     initGame(smells, players);
  //     location.reload();
  //   }
  // }

  // function addPlayer(playerName) {
  //   players.push(playerName);
  //   setPlayers(players);//save to loalstorage
  //   initGame(smells, players);
  //   location.reload();
  // }




  // function drawContainerPlayers() {
  //   const fragment = document.createDocumentFragment();


  //   players.forEach((item) => {
  //     div = document.createElement("DIV");
  //     deletebutton = document.createElement("BUTTON");

  //     deletebutton.classList.add("btn");
  //     deletebutton.classList.add("btn-secondary");
  //     deletebutton.classList.add("btn-sm");
  //     deletebutton.innerText = "x";
  //     div.appendChild(deletebutton);

  //     div.append(item);

  //     deletebutton.addEventListener("click", (e) => {
  //       deletePlayer(item);
  //     });

  //     fragment.appendChild(div);

  //   }
  //   );
  //   containerplayers.innerHTML = "";
  //   containerplayers.appendChild(fragment);
  // };

  // const spanId = document.getElementById("spanId");
  // const inputSmell = document.getElementById("inputSmell");

  // const chkboxSmellIsactive = document.getElementById("chkboxSmellIsactive");


  // function getSmellForEdit() {
  //   let _smell = smells.find(field => field.id == id);
  //   if (_smell === undefined) {
  //     addSmell(id);
  //   }

  //   if (_smell) {
  //     spanId.innerHTML = id;
  //     inputSmell.value = _smell.name;
  //     chkboxSmellIsactive.checked = _smell.isactive;
  //   }
  // }


  // getSmellForEdit();

  // //function to add smell if not in game
  // function addSmell(id) {
  //   if (id != -1) {
  //     let newsmell = {
  //       "id": id,
  //       "name": "",
  //       "isactive": false
  //     }

  //     smells.push(newsmell);
  //     setSmells(smells);//save to loalstorage
  //     initGame(smells, players);
  //     location.reload();
  //   }
  // }

  // function saveSmell() {
  //   let smell = smells.find(field => field.id == id);
  //   smell.name = inputSmell.value;
  //   smell.isactive = chkboxSmellIsactive.checked;

  //   setSmells(smells);//save to loalstorage
  //   initGame(smells, players);
  //   location.reload();
  // }

  // document.getElementById("btnSaveSmell").addEventListener("click", saveSmell);

  // document.getElementById("btnAddPlayer").addEventListener("click", () => {
  //   let playerName = document.getElementById("txtPlayerName").value;
  //   if (playerName) {
  //     addPlayer(playerName);
  //   }
  // });


  // if (setupmode === null) {
  //   containersetup.style.display = "none";
  //   btnShowSetup.innerText = "Show Setup";
  // }
  // else {
  //   containersetup.style.display = "block";
  //   btnShowSetup.innerText = "Hide Setup";
  // }


  // btnShowSetup.addEventListener("click", () => {
  //   if (containersetup.style.display === "none" || containersetup.style.display === "") {
  //     containersetup.style.display = "block";
  //     btnShowSetup.innerText = "Hide Setup";
  //     localStorage.setItem("setupmode", true);
  //   } else {
  //     localStorage.removeItem("setupmode");
  //     containersetup.style.display = "none";
  //     btnShowSetup.innerText = "Show Setup";
  //   }
  // })



});