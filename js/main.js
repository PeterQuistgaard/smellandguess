

document.addEventListener("DOMContentLoaded", function () {
  //Global variables
  let id = -1;//current smell id
  let nextplayerindex = -1;
  let players;
  let smells;
  let currentroundidx = -1;

 

  //samme smell kan vælges flere gange - brugerne skal selv blande krukkerne mellem hver runde 
  //alternaivt er der flere krukker med samme smell - evt. i forskellig intensitet
  let shuffelmode = true;

  //console.log(defaultsmells2.da.ka)
  // console.log(defaultsmells2.en.ka)

  /* #region scanner */
  const video = document.createElement("video");
  const canvasElement = document.getElementById("canvas");
  const canvas = canvasElement.getContext("2d", { willReadFrequently: true });


  const loadingMessage = document.getElementById("loadingMessage");
  const outputContainer = document.getElementById("output");
  const outputMessage = document.getElementById("outputMessage");
  const outputData = document.getElementById("outputData");
  const btnScanStart = document.getElementById("btnScanStart");
  const btnScanStop = document.getElementById("btnScanStop");

  const containerqrscanner = document.getElementById("containerqrscanner");

  function drawRect(color) {
    let oneforth = canvasElement.width / 4;
    canvas.beginPath();
    canvas.rect(canvasElement.width / 4, canvasElement.height / 4, canvasElement.width / 2, canvasElement.height / 2);
    canvas.strokeStyle = color;
    canvas.stroke();

   
  }

  function drawCorners(color) {
    canvas.lineWidth = 10
    canvas.strokeStyle = color;

    canvas.beginPath();
    const left = canvasElement.width * 1 / 4;
    const top = canvasElement.height * 1 / 4;
    const right = canvasElement.width * 3 / 4;
    const bottom = canvasElement.height * 3 / 4;

    const xlenght = canvasElement.width / 10;
    const ylenght = canvasElement.height / 10;

    //top-left corner
    canvas.moveTo(left + xlenght, top);
    canvas.lineTo(left, top);
    canvas.lineTo(left, top + ylenght);
    canvas.stroke();

    //top-rught corner
    canvas.moveTo(right - xlenght, top);
    canvas.lineTo(right, top);
    canvas.lineTo(right, top + ylenght);
    canvas.stroke();

    //bottom-left corner
    canvas.moveTo(left + xlenght, bottom);
    canvas.lineTo(left, bottom);
    canvas.lineTo(left, bottom - ylenght);
    canvas.stroke();

    //bottom-right corner
    canvas.moveTo(right - xlenght, bottom);
    canvas.lineTo(right, bottom);
    canvas.lineTo(right, bottom - ylenght);
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

      var imageData = canvas.getImageData(canvasElement.width / 4, canvasElement.height / 4, canvasElement.width / 2, canvasElement.height / 2);

      let code = await jsQRpromise(imageData);


      if (code) {

        id = parseInt(code.data);

        if (!Number.isNaN(id)) {
          //code er ikke et nummer og derfor ikke en QR kode fra spillet

          drawCorners("green");
          outputMessage.hidden = true;
          outputData.parentElement.hidden = true;
          outputData.innerText = code.data;

          //tjek om fundet id er en del af spillet!
          const isInGame = smells.some(f => f.id == id)
          if (!isInGame) {
            //console.log("Ikke en del af spillet")
            containerplayer.style.color = "red";
            containerplayer.style.backgroundColor = "Black";
            //containerplayer.innerText = `${getSmellNameById(id)} - men denne lugt er ikke aktiveret i dette spil!`;
            containerplayer.innerText = `${getSmellNameById(id)} - ${translate("butthissmellisnotactivatedinthisgame")}!`;
            //translate("butthissmellisnotactivatedinthisgame")
            containersmells.innerHTML = "";
            btnGetTotalScore.hidden = true;//vis knappen "Get total score"
            containerplayer.hidden = false;
            containerqrscanner.hidden = true;
            btnScanStart.hidden = false;
          }
          else {
            //NYT

            createRound(id)//id=smellid og ikke round id
            setNextplayer();
            drawSmellButtons();
          }
          stopStreamedVideo(video);//der er fundet en QR kode og derfor stoppes video

        }
      }
      else {
        drawCorners("red")
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
    //btnScanStop.hidden = true;
    containerqrscanner.hidden = true;

    setTimeout(() => canvasElement.hidden = true, 1000)//vent 1 sek og skjul derefter canvas

  }



  let language = navigator.language; //from browser 
  let languages = navigator.languages; //from browser 
 // let locale = Intl.getCanonicalLocales(language); //from browser validated




  document.addEventListener('DOMContentLoaded', () => {
    //skip the lang value in the HTML tag for this example
    // let zones = document.querySelectorAll('html [lang]');
    // applyStrings(zones);

    let lang = findLocaleMatch();
    
    // let container = document.querySelector(`html [lang*=${lang}]`);
    // container.className = 'lang-match';
  });

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
        btnScanStart.hidden = true;
        containerqrscanner.hidden = false;
        //btnScanStop.hidden = false;
      }
      ).catch((err) => {
        /* handle the error */
        loadingMessage.innerText = "🎥 Unable to access video stream (please make sure you have a webcam enabled)"
        console.error(err);
      });;
  }

  btnScanStart.addEventListener("click", (e) => {
    e.preventDefault();


    //hide result
    containertotalscore.innerHTML = "";
    containerplayer.innerHTML = "";
    containerplayer.hidden = true

    btnGetTotalScore.hidden = true;
    startScanner();

  });

  btnScanStop.addEventListener("click", (e) => {
    e.preventDefault();
    stopStreamedVideo(video);

    btnScanStart.hidden = false;
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



  containersmells.addEventListener("click", (e) => {

    if (e.target.hasAttribute("data-id")) {
      //Hent id fra btn som er GuessId
      const dataId = e.target.getAttribute("data-id");
      setmove(nextplayerindex, id, dataId);
      setNextplayer();
      drawSmellButtons();

    }
  })

  //init or get from localstorage
  players = getPlayers();
  smells = getSmells();
  game2 = getGame2();




  // console.log(players, players)
  // console.log(smells, smells)

  if (players.length === 0) {
    alert("Gå til setup og opret mindst én spiller")
    location.replace("/setupplayers.html")
  }
  if (smells.length === 0) {
    alert("Gå til setup og opret lugte")
    location.replace("/setupsmells.html")

  }


  function setGame2(game2) {
    localStorage.setItem("game2", JSON.stringify(game2));
  };

  function setPlayers(players) {
    localStorage.setItem("players", JSON.stringify(players));
  };

  function setSmells(smells) {
    localStorage.setItem("smells", JSON.stringify(smells));
  };


  function getGame2() {
    //get from localstorage or init new game if not exist
    const value = localStorage.getItem("game2") || initGame2(smells, players);
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
    const defaultSmells = [];
    setSmells(defaultSmells);
    return JSON.stringify(defaultSmells);
  }

  function initGame2(smells, players) {
    let _emptygame2 = [];

    setGame2(_emptygame2);
    return JSON.stringify(_emptygame2);
  };


  function createRound(smellid) {

    //tjek if smellid alredy is in a round
    let smellidisinround = game2.some(field => field.id == id);
    if (shuffelmode == true || smellidisinround != true) {

      let smell = smells.find(field => field.id == id);

      let newRound = {
        "id": smell.id,
        "name": getSmellNameById(smell.id),
        "Guesses": Array.from({ length: players.length }, () => -1)
      }
      game2.push(newRound);

      setGame2(game2);
      currentroundidx = game2.length - 1;//set to global var

    }



  }


  //tag også hensyn til runde 1dx
  function setmove(userid, smellid, guessid) {
    game2[currentroundidx].Guesses[userid] = guessid;
    setGame2(game2);
  }



  //hent players guesses på en smell id. 
  //hvis ingen endnu har afgivet gæt returneres -1 som er default 
  function getRound(smellid) {
    //console.log("ROUND",gameround);
    //let _round = game2.find(field => field.id == smellid);
    let _round = game2[currentroundidx];

    //console.log("_round", _round)

    let lastElement = game2[game2.length - 1];
    //console.log("lastElementl", lastElement);




    if (_round) {
      // console.log("_round.Guesses", _round.Guesses)
      return _round.Guesses;
    }

    return 0;
  }


  //Players horizontal and Smells vertical
  function getTotalScore1(lang) {


    containerplayer.hidden = true;

    const fragment = document.createDocumentFragment();
    const table = document.createElement("TABLE");
    table.classList.add("table");
    table.classList.add("table-bordered");
    table.classList.add("table-sm");
    table.classList.add("rounded-1");
    table.classList.add("overflow-hidden");

    const thead = document.createElement("THEAD");
    thead.classList.add("table-dark")
    const tbody = document.createElement("TBODY");


    let trheader = document.createElement("TR");
    let thleftuppercorner = document.createElement("TH")
    trheader.appendChild(thleftuppercorner);

    players.forEach((player, index) => {
      const th = document.createElement("TH");
      th.append(getPlayerNameById(index));
      trheader.appendChild(th);
    });
    thead.appendChild(trheader);
    table.appendChild(thead);

    let _game = game2.filter(
      (item) =>
        !item.Guesses.some((guess) => guess == -1) //alle skal have gættet før en smell vises
    );

    _game.forEach((item, index) => {
      //console.log(item, index)
      const tr = document.createElement("TR");
      const tdleft = document.createElement("TD");
      //tdleft.append(item.name);
      tdleft.append(getSmellNameById(item.id, lang));
      tr.appendChild(tdleft);

      item.Guesses.forEach(guess => {
        const td = document.createElement("TD");

        td.append(getSmellNameById(guess, lang));

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
    let strRunder = "runder"
    if (_game.length == 1) {
      strRunder = "runde"
    }
    //tdleft.append(`${_game.length} ${strRunder}`);
    

   // tdleft.append(translate("round-plural",{"count": _game.length}));
   // tdleft.setAttribute("data-i18n-opt",`{"count": ${_game.length}}`)

    //tdleft.setAttribute("data-i18n-opt",`{"count": ${_game.length}}`)


    tdleft.setAttribute("data-i18n-key","round-plural")
    tdleft.setAttribute("data-i18n-opt",`{"count": ${_game.length}}`)
    tdleft.append(translate("round-plural",{"count": _game.length}));

    tr.appendChild(tdleft);
    tr.classList.add("table-dark")

    players.forEach((player, index) => {
      const td = document.createElement("Td");
      let points = getPointsByUserIndex(index);

      // let strPoints = "rigtige";
      // if (points == 1) {
      //   strPoints = "rigtig";
      // }
      //td.append(`${points} ${strPoints}`);      
      //data-i18n-key="setupsmells"
      //data-i18n-opt='{"count": 2}'
      td.setAttribute("data-i18n-key","correct-plural")
      td.setAttribute("data-i18n-opt",`{"count": ${points}}`)
      td.append(translate("correct-plural",{"count": points}));
    

      tr.appendChild(td);

    });

    tbody.append(tr);


    table.appendChild(tbody);
    fragment.appendChild(table);
    containertotalscore.innerHTML = "";

    console.log(table)
    containertotalscore.appendChild(fragment)


    getLanguageButtons("total")

    // let userslanguages = [...new Set(players.map((p) => p.lang))] //distinct! Hvert anvendt sprog kun en gang
    // if (!(userslanguages.length == 1 && userslanguages[0] == "da")) {
    //   userslanguages.forEach((lan) => {
    //     const btn = document.createElement("BUTTON");
    //     btn.classList.add("btn");
    //     btn.classList.add("btn-light");
    //     btn.classList.add("btn-sn");
    //     const img = document.createElement("IMG");
    //     img.setAttribute("src", `/images/flagslanguage/${lan}.png`);
    //     btn.appendChild(img)

    //     btn.addEventListener("click", () => {
    //       getTotalScore1(lan);
    //     })
    //     containertotalscore.appendChild(btn);
    //   })
    // }

  }



  function getPointsByUserIndex(userIdx) {
    let userpoints = 0;

    //alle skal have gættet før en smell vises i total score
    let _game = game2.filter(
      (item) =>
        !item.Guesses.some((guess) => guess == -1)
    );
    _game.forEach((item, index) => {
      //Er smell id på runden det samme som det brugeren gætted på - så give et point
      if (item.id == item.Guesses[userIdx]) {
        userpoints += 1;//givet 1 point
      }
    });
    return userpoints;
  }

  const defaultlang = "da";
  function getSmellNameById(id, lang = "da") {
    if (id === -1) return "";

    _tmp = defaultsmells3.find(field => field.id == id);

    if (!_tmp.hasOwnProperty("languages")) {
      return _tmp.name;
    }
    if (_tmp.languages.hasOwnProperty(lang) && _tmp.languages[lang] > "")
      return _tmp.languages[lang];
    else if (_tmp.languages.hasOwnProperty(defaultlang) && _tmp.languages[defaultlang] > "") {
      return _tmp.languages[defaultlang];
    }
    else {
      return _tmp.name;
    }
  }


  // function getSmellNameById(id) {
  //   if (id === -1) return "";
  //   _smell = defaultsmells.find(field => field.id == id);
  //   if (_smell == undefined) {
  //     return "";
  //   }
  //   let name = _smell.name;
  //   return name;
  // }


  function getPlayerNameById(id) {
    let player = players[id];
    return player.name;
  }

  //function removing class active form siblings and set active om current element
  // const setActiveAndRemoveFromSiblings = el => {
  //   [...el.parentElement.children].forEach(sibling => sibling.classList.remove('active'));
  //   el.classList.add('active');
  // }

function getLanguageButtons(round_total){

   //language buttons
   let userslanguages = [...new Set(players.map((p) => p.lang))] //distinct! Hvert anvendt sprog kun en gang
   if (!(userslanguages.length == 1 && userslanguages[0] == locale)) {



    const _div= document.createElement("DIV");
    _div.classList.add("btn-group");
    _div.setAttribute("role","group");

     userslanguages.forEach((lan) => {
       const btn = document.createElement("BUTTON");
       btn.classList.add("btn");
       btn.classList.add("btn-light");
       btn.classList.add("btn-sn");
       btn.setAttribute("type","button")
       const img = document.createElement("IMG");
       img.setAttribute("src", `/images/flagslanguage/${lan}.png`);
       btn.appendChild(img)

       btn.addEventListener("click", () => {
         //
         if(round_total=="total"){
          //console.log("TOTAL")
            getTotalScore1(lan);
         }
         if(round_total=="round"){
          //console.log("ROUND")
            getRoundResult(id, lan)     
         }
        


       })
       _div.appendChild(btn);
       
     })
     containertotalscore.appendChild(_div);
   }
}


  function getRoundResult(id,lan) {
    containertotalscore.innerHTML = "";

    let _round = getRound(id);// array med gæt  

    const fragment = document.createDocumentFragment();
    div = document.createElement("DIV");
    let rigtigtsvar = getSmellNameById(id,lan);
    //div.append(`Det rigtige svar var: ${rigtigtsvar} `)
    div.append(`${translate("thecorrectanswerwas")}: ${rigtigtsvar} `)
    //Det rigtige svar var
    fragment.appendChild(div);
    ul = document.createElement("UL");

    for (let index = 0; index < _round.length; index++) {


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

      spanplayer.append(`${getPlayerNameById(index)}: `);
      spanplayerguess.append(getSmellNameById(_round[index],lan));

      li.append(spanplayer, spanplayerguess);
      ul.appendChild(li);
      fragment.appendChild(ul);
    }

    containertotalscore.appendChild(fragment)


    getLanguageButtons("round")



    // //language buttons
    // let userslanguages = [...new Set(players.map((p) => p.lang))] //distinct! Hvert anvendt sprog kun en gang
    // if (!(userslanguages.length == 1 && userslanguages[0] == "da")) {
    //   userslanguages.forEach((lan) => {
    //     const btn = document.createElement("BUTTON");
    //     btn.classList.add("btn");
    //     btn.classList.add("btn-light");
    //     btn.classList.add("btn-sn");
    //     const img = document.createElement("IMG");
    //     img.setAttribute("src", `/images/flagslanguage/${lan}.png`);
    //     btn.appendChild(img)

    //     btn.addEventListener("click", () => {
    //       //getTotalScore1(lan);
    //       console.log("id",id,lan)

    //       getRoundResult(id, lan)
    //     })
    //     containertotalscore.appendChild(btn);
    //   })
    // }
    
  }



  /**/
  function setNextplayer() {
    containerplayer.hidden = false;
    let playersThisSmell = getRound(id);
    //console.log("playersThisSmell", playersThisSmell);
    //console.log("id", id);
    if (playersThisSmell) {

      nextplayerindex = playersThisSmell.findIndex(rank => rank === -1);
      //console.log("nextplayerindex", nextplayerindex);

      if (playersThisSmell == 0) {
        //spillet er ikke sat om med brugere
        containerplayer.style.color = "red";
        containerplayer.style.backgroundColor = "black";
        containerplayer.innerText = "Ingen spillere er oprettet!";

        containersmells.innerHTML = "Opret én eller flere spillere!";
        btnGetTotalScore.hidden = true;//vis knappen "Get total score"
      }
      else if (nextplayerindex == -1) {
        //ikke flere spillere i denne runde
        containerplayer.style.color = "yellow";
        containerplayer.style.backgroundColor = "black";
        //containerplayer.innerText = "Alle har givet deres gæt på denne lugt";
        //everyonehasgiventheirguesses
        containerplayer.innerText = translate("everyonehasgiventheirguesses");
        getRoundResult(id,locale);//vis resultatet for runden
        containersmells.innerHTML = "";
        btnGetTotalScore.hidden = false;//vis knappen "Get total score"
        btnScanStart.hidden = false;
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




  btnClearGame.addEventListener("click", clearGame)

  /*Nulstiller game i localstorage for at starter et nyt spil*/
  function clearGame() {
    //localStorage.removeItem("game");
    localStorage.removeItem("game2");
    //initGame(smells, players)
    initGame2(smells, players)
    location.reload();//genindlæs siden
  }






  function drawSmellButtons() {  
    
    containersmells.innerHTML = "";
    if (nextplayerindex == -1) return;
    //containersmells.innerHTML = "Næste spiller";
    containersmells.innerHTML = translate("nextplayer");


    let _nxtPlayer = players[nextplayerindex]
    let _lang = _nxtPlayer.lang;

    //sætter en timeout før smellbuttons vises. Så ved spilleren at turen skifter.
    setTimeout(() => {
      const fragment = document.createDocumentFragment();
      let _game0 = smells.filter((item) => item);
      let _game = _game0.sort((a, b) => 0.5 - Math.random());//Shuffel - så brugerne lettere kan skjule hvor på iPad de trykker

      _game.forEach((item) => {
        div = document.createElement("button");
        div.setAttribute('data-id', item.id);
        div.classList.add("btn");

        div.classList.add("btn-light");
        div.classList.add("me-3");
        div.classList.add("mb-2");
        div.innerHTML = getSmellNameById(item.id, _lang);
        //div.innerHTML = item.name;
        fragment.appendChild(div);
      }
      );

      containersmells.innerHTML = "";
      containersmells.appendChild(fragment);

    }, 1000);

  };

  setNextplayer();
  drawSmellButtons();
  

  btnGetTotalScore.addEventListener("click", () => {
    
    getTotalScore1(locale);
    btnGetTotalScore.hidden = true;
  });

  // document.getElementById("btnGetTotalScoreSv").addEventListener("click", () => {
  //   getTotalScore1("sv");
  // });
  // document.getElementById("btnGetTotalScoreFi").addEventListener("click", () => {
  //   getTotalScore1("fi");
  // });
  // document.getElementById("btnGetTotalScoreEn").addEventListener("click", () => {
  //   getTotalScore1("en");
  // });




//bootstrap language selector
const languageselector = document.getElementById("languageselector")
const languageselectordropdownmenu = languageselector.querySelector(".dropdown-menu")
const imgselectedlang = languageselector.querySelector(".imgselectedlang")
languageselectordropdownmenu.addEventListener("click", (e) => {
  //e.preventDefault()

  const _a = e.target.closest(`a`)

  if (_a.hasAttribute("data-lang")) {
   

    let selectedlang = _a.getAttribute("data-lang")
    //change img in menu
    imgselectedlang.src = `images/flagslanguage/${selectedlang}.png`

    //do other stuf
    setLocale(selectedlang);

        //Save user's language selection to localStorage
    localStorage.setItem("lang3", JSON.stringify(selectedlang));

   
  }
}, false)







});