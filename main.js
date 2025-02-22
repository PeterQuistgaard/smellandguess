//:

document.addEventListener("DOMContentLoaded", function () {
  //Global variables
  let id = -1;
  let nextplayerindex = -1;
  let players;
  let smells;
  let game;
  let smellArray=[];//PQ
  

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
  const defaultsmells = [
    { id: 0, name: "Hindbær"},
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

  function drawRect(color) {
    let oneforth = canvasElement.width / 4;
    canvas.beginPath();
    canvas.rect(canvasElement.width / 4, canvasElement.height / 4, canvasElement.width / 2, canvasElement.height / 2);
    canvas.strokeStyle = color;
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
        //console.log(imageData);
        drawRect("green");
        outputMessage.hidden = true;
        outputData.parentElement.hidden = true;
        outputData.innerText = code.data;

        id = parseInt(code.data);        

        //Hvis i setupmode skal scanning ikke stoppe efter et glas
        

        setupmode=false
        if(setupmode==true){        
          const isExist = smellArray.some(f => f.id == id)
          

          if(!isExist){
            let newsmell = {
              "id": id,
              "name": getSmellNameById(id)
            }

            smellArray.push(newsmell);
            setSmells(smellArray);
            console.log(smellArray);
          }
          else {
            console.log(getSmellNameById(id));
          }
        }
        else{
          


          //tjek om fundet id er en del af spillet!
          const isInGame = smells.some(f => f.id == id)
          if(!isInGame){
              console.log("Ikke en del af spillet")
              containerplayer.style.color = "red";
              containerplayer.style.backgroundColor = "Black";
              containerplayer.innerText = `${getSmellNameById(id)} - men denne lugt er ikke aktiveret i dette spil!`;              
              containersmells.innerHTML = "";
              btnGetTotalScore.hidden = true;//vis knappen "Get total score"
          }
          else {

            setNextplayer();
            drawSmellButtons();
          }

          stopStreamedVideo(video);//der er fundet en QR kode og derfor stoppes video

        }

        


      } else {
        drawRect("red")
        outputMessage.hidden = false;
        outputData.parentElement.hidden = true;
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
    //  canvasElement.hidden = true;

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
    containertotalscore.innerHTML = "";
    containerplayer.innerHTML = "";

    btnGetTotalScore.hidden = true;
    startScanner();

  });

  scanstop.addEventListener("click", (e) => {
    e.preventDefault();
    stopStreamedVideo(video);
  });

  /* #endregion scanner */


  //let setupmode = localStorage.getItem("setupmode");
  let setupmode;

  //references to UI elements
  const containerplayer = document.getElementById("containerplayer");
  const containertotalscore = document.getElementById("containertotalscore");
  const containerplayers = document.getElementById("containerplayers");
  const containersmellguess = document.getElementById("containersmellguess");
  const containersmells = document.getElementById("containersmells");
//  const btnClearGame = document.getElementById("btnClearGame");
  const btnGetTotalScore = document.getElementById("btnGetTotalScore");

 // const containersetup = document.getElementById("containersetup");
 // const btnShowSetup = document.getElementById("btnShowSetup");



  //init or get from localstorage
  players = getPlayers();
  smells = getSmells();
  game = getGame();


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
    const shuffledSmellArray = defaultsmells.sort((a, b) => 0.5 - Math.random());
    setSmells(shuffledSmellArray);
    return JSON.stringify(shuffledSmellArray);
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
    console.log("_round",_round)
    //if (_round === undefined) {
    //   addSmell(smellid);//hvis smell ikke er oprettet ved init 
     // return -1;//smell er ikke sat op tl dette spil
   // }

    if (_round) {
      console.log("_round.Guesses",_round.Guesses)
      return _round.Guesses;
    }

    return 0;
  }

  //Players vertical and Smells horizontal
  function getTotalScore2() {

    
    const fragment = document.createDocumentFragment();
    const table = document.createElement("TABLE");
    table.classList.add("table");
    table.classList.add("table-bordered");
    table.classList.add("table-sm");

    const thead = document.createElement("THEAD");
    thead.classList.add("table-dark")
    const tbody = document.createElement("TBODY");


    let trheader = document.createElement("TR");
    let thleftuppercorner = document.createElement("TH")
    trheader.appendChild(thleftuppercorner);

    let _game = game.filter(
      (item) =>
        // item.isactive &&
        // item.isactive == true &&
        !item.Guesses.some((guess) => guess == -1) //alle skal have gættet før en smell vises

    );
    _game.forEach((item) => {
      const th = document.createElement("TH");

      th.append(item.name);
      trheader.appendChild(th);
    });

    let thscore = document.createElement("TH")
    thscore.append("Point");
    trheader.appendChild(thscore);


    let thrightuppercorner = document.createElement("TH")
    trheader.appendChild(thrightuppercorner);

    thead.appendChild(trheader);
    table.appendChild(thead);

    players.forEach((player, index) => {
      const tr = document.createElement("TR");
      const tdleft = document.createElement("TD");
      tdleft.append(player);
      tr.appendChild(tdleft);
      let points = 0;

      _game.forEach((item) => {

        const td = document.createElement("TD");

        const usersguess = item.Guesses[index];
        let point = item.Points[index];
        if (usersguess != -1) {

          points += point;

/* */           if (item.name.toLowerCase() == usersguess.toLowerCase()) {
            //points++;
            td.setAttribute("class", "green");
          } else {
            td.setAttribute("class", "red");
          }
        }
        //td.append(`${usersguess} (${point})`);   
        td.append(`${usersguess}`);
        tr.appendChild(td);
      });

      const tdscore = document.createElement("TD")
      tdscore.append(points);
      tr.appendChild(tdscore);

      //add playername as last cell in the row
      const tdright = document.createElement("TD");
      tdright.append(player);
      tr.appendChild(tdright);

      tbody.appendChild(tr);


    });

    table.appendChild(tbody);
    fragment.appendChild(table);
    containertotalscore.innerHTML = "";


    containertotalscore.appendChild(fragment)
  }


  //Players horizontal and Smells vertical
  function getTotalScore1() {
    containerplayer.hidden=true;

    const fragment = document.createDocumentFragment();
    const table = document.createElement("TABLE");
    table.classList.add("table");
    table.classList.add("table-bordered");
    table.classList.add("table-sm");

    const thead = document.createElement("THEAD");
    thead.classList.add("table-dark")
    const tbody = document.createElement("TBODY");


    let trheader = document.createElement("TR");
    let thleftuppercorner = document.createElement("TH")
    trheader.appendChild(thleftuppercorner);

    players.forEach((player, index) => {
      const th = document.createElement("TH");
      th.append(player);
      trheader.appendChild(th);
    });
    thead.appendChild(trheader);
    table.appendChild(thead);



    let _game = game.filter(
      (item) =>
        // item.isactive &&
        // item.isactive == true &&
        !item.Guesses.some((guess) => guess == -1) //alle skal have gættet før en smell vises

    );
    //console.log(_game.length);

    _game.forEach((item, index) => {
      console.log(item, index)
      const tr = document.createElement("TR");
      const tdleft = document.createElement("TD");
      tdleft.append(item.name);
      tr.appendChild(tdleft);

      item.Guesses.forEach(guess => {

        const td = document.createElement("TD");

        td.append(getSmellNameById(guess));

        // if (item.name.toLowerCase() == guess.toLowerCase()) {
        //   //points++;
        //   td.setAttribute("class", "text-success");
        // } else {
        //   td.setAttribute("class", "text-danger");
        // }
        if (item.id == guess) {          
          td.setAttribute("class", "text-success");
        } else {
          td.setAttribute("class", "text-danger");
        }



        tr.appendChild(td);
      });
      tbody.append(tr);
    });



    const tr = document.createElement("TR");
    const tdleft = document.createElement("TD");
    let strRunder="runder"
    if(_game.length==1){
      strRunder="runde"
    }
    tdleft.append(`${_game.length} ${strRunder}`);
    tr.appendChild(tdleft);
    tr.classList.add("table-dark")

    players.forEach((player, index) => {
      const td = document.createElement("Td");
      let points = getPointsByUserIndex(index);
      //let points=0;
      let strPoints="rigtige";
      if(points==1){
        strPoints="rigtig";
      }


      td.append(`${points} ${strPoints}`);

      tr.appendChild(td);

    });

    tbody.append(tr);


    table.appendChild(tbody);
    fragment.appendChild(table);
    containertotalscore.innerHTML = "";


    containertotalscore.appendChild(fragment)
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
    containertotalscore.innerHTML = "";

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

    containertotalscore.appendChild(fragment)
  }



  /**/
  function setNextplayer() {    
    containerplayer.hidden=false;
    let playersThisSmell = getRound(id);
    console.log("playersThisSmell",playersThisSmell);
    console.log("id",id);
    if (playersThisSmell) {
      
      nextplayerindex = playersThisSmell.findIndex(rank => rank === -1);
      console.log("nextplayerindex",nextplayerindex);

      if(playersThisSmell==0){
        //spillet er ikke sat om med brugere
        containerplayer.style.color = "red";
        containerplayer.style.backgroundColor = "black";
        containerplayer.innerText = "Ingen spillere er oprettet!";
        
        containersmells.innerHTML = "Opret én eller flere spillere!";
        btnGetTotalScore.hidden = true;//vis knappen "Get total score"
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
        containerplayer.style.backgroundColor = "black";
        containerplayer.innerText = "Alle har givet deres gæt på dette glas";
        getRoundResult(id);//vis resultatet for runden
        containersmells.innerHTML = "";
        btnGetTotalScore.hidden = false;//vis knappen "Get total score"
      }
      else {
        btnGetTotalScore.hidden = true;//skjul knappen totalscore
        let nextPlayerName = getPlayerNameById(nextplayerindex);
        containerplayer.innerText = nextPlayerName;
        containerplayer.style.color = "white";
        containerplayer.style.backgroundColor = generateHSLByName(nextPlayerName);//sæt players color som beregnes ud fra navne       
      }

    }
  }


  /*   if(nextplayerindex==-1){
      //Ikke flere spillere i denne runde - alle har afgivet et gæt på indholdet i glasset
    console.log("nextplayerindex",nextplayerindex)  
      
      containersmells.innerHTML="";                
  } */

  btnClearGame.addEventListener("click", clearGame)



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
        
        //div.classList.add("btn-lg");
        div.classList.add("btn-light");
        div.classList.add("me-3");
        div.classList.add("mb-2");
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

  setNextplayer();
  drawSmellButtons();



  //Setup
  //drawContainerPlayers();

  btnGetTotalScore.addEventListener("click", () => {
    getTotalScore1();
    btnGetTotalScore.hidden = true;
  });


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