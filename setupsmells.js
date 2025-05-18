"use strict";
import { defaultsmells } from "./defaultsmells.js";
import i18next from '../lib/i18next.js';
import { getallsmells, getnumberoffavailablesmells,drawlanguagemenuDD,browserlocales} from "./smellsutil.js";
// import {langAvailableHomepage,langAvailableGame} from './constants.js';


document.addEventListener("DOMContentLoaded", function () {

 
  //Global variables
  let id = -1;
  let nextplayerindex = -1;
  let players;
  let smells;
  let game;
 


  /* #region scanner */
  const video = document.createElement("video");
  const canvasElement = document.getElementById("canvas"); 
  const canvas = canvasElement.getContext("2d", { willReadFrequently: true });

  const loadingMessage = document.getElementById("loadingMessage");

  const scanstart = document.getElementById("btnScanStart");
  const scanstop = document.getElementById("btnScanStop");
  const btnTorch= document.getElementById("btnTorch");

  const clearAllSmells = document.getElementById("clearAllSmells");
  const outercontainersmells=document.getElementById("outercontainersmells")
  const containerqrscanner = document.getElementById("containerqrscanner");



  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x + canvas.width / 4, begin.y + canvas.height / 4);
    canvas.lineTo(end.x + canvas.width / 4, end.y + canvas.height / 4);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  function drawRect(color, width = 4) {
    let oneforth = canvasElement.width / 4;
    canvas.beginPath();
    canvas.rect(canvasElement.width / 4, canvasElement.height / 4, canvasElement.width / 2, canvasElement.height / 2);
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
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


      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;

      //video-frame tegnes som billede på canvas 
     canvas.drawImage(video, 0, 0, canvasElement.width * 1, canvasElement.height * 1);
      // canvas.drawImage(video, 0, 0, canvasElement.width*1.5, canvasElement.height*1.5);

      var imageData = canvas.getImageData(canvasElement.width / 4, canvasElement.height / 4, canvasElement.width / 2, canvasElement.height / 2);


      let code = await jsQRpromise(imageData);


      //var code = jsQR(imageData.data, imageData.width, imageData.height, {
      //inversionAttempts: "dontInvert", 
      //});


      if (code) {
        //console.log(`QR code fundet ${code.data}`)
        id = parseInt(code.data);
        //if(Number.isNaN(id)){console.error(`Er ikke et nummer! ${id}`)}

        //tjek om id er et nummer og om dette nummer findes i defaultsmells
        if (!Number.isNaN(id) && defaultsmells.some(field => field.id == id)) {
          drawCorners("green", 15);

          addSmell(id);
        }

      } else {
        drawCorners("#dc3545");//red
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
    containerqrscanner.hidden = true;
    scanstart.hidden = false;
    btnTorch.classList.remove("text-warning");
    setTimeout(() => canvasElement.hidden = true, 1000)//vent 1 sek og skjul derefter cancas


  }


                
  btnTorch.addEventListener("click", (e) => {
    alert("Torch")
    const stream = video.srcObject.getVideoTracks()[0];
    alert(stream)

    const result = e.target.classList.toggle("text-warning");//yellow color on/off on icon
    console.log(result)
    if (result) {
      //alert("tænd")
      const track = stream.getVideoTracks()[0];
      track.applyConstraints({
        advanced: [{ torch: true }]
      })
    }
    else {
      //alert("sluk")
      const track = stream.getVideoTracks()[0];
      track.applyConstraints({
        advanced: [{ torch: false }]
      })
    }


  })




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
        containerqrscanner.hidden = false;


//#region torch


            // get the active track of the stream
            //const track = video.srcObject.getVideoTracks()[0];
            const track = stream.getVideoTracks()[0];
            // console.log(track)
            // console.log("antal streams",stream.getVideoTracks().length)
            video.addEventListener('loadedmetadata', (e) => {
              window.setTimeout(() => (
                //onCapabilitiesReady(track.getCapabilities())
              ), 500);
            });

            function onCapabilitiesReady(capabilities) {              

              if (capabilities.torch) {
                  console.log("torch er tilgængelig")
                

                btnTorch.hidden = false;
              }
              else {
                btnTorch.hidden=true;
                console.log("torch ikke tilgængelig")
              }

            }

//#endregion torch




      }
      ).catch((err) => {
        /* handle the error */
        loadingMessage.innerText = "🎥 Unable to access video stream (please make sure you have a webcam enabled)"
        console.log(err);
      });;
  }

  scanstart.addEventListener("click", (e) => {
    e.preventDefault();
    startScanner();
  });

  scanstop.addEventListener("click", (e) => {
    e.preventDefault();
    stopStreamedVideo(video);
  });



  clearAllSmells.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("smells");
    location.reload();//genindlæs siden
  });


  /* #endregion scanner */



  // let setupmode;

  //references to UI elements

  const containersmells = document.getElementById("containersmells");
  const divsmellcount = document.getElementById("divsmellcount")




  //init or get from localstorage
  players = getPlayers();
  smells = getSmells();
  game = getGame();

  containersmells.innerHTML = "";
  drawSmells2()



  function drawSmells2() {
    containersmells.innerHTML = "";

    smells.forEach((item) => {
     const div = document.createElement("div");
      div.setAttribute('data-id', item.id);
      if (item.id == id) {
        div.classList.add("currentDiv")
      }

      div.classList.add("me-1");
      //div.innerHTML = item.name;
      div.innerHTML = getSmellNameById(item.id,i18next.language);
      const icon = document.createElement("i")
      icon.classList.add("fa");
      icon.classList.add("fa-times");
      icon.classList.add("ms-1");

      div.appendChild(icon);

      containersmells.appendChild(div);


    }
    );



  
    setcountsmells()
  }




  function setGame(game) {
    localStorage.setItem("game2", JSON.stringify(game));

    
  };

  function setPlayers(players) {
    localStorage.setItem("players", JSON.stringify(players));
  };

  function setcountsmells() {
   
    divsmellcount.innerHTML = "";

    

    if (smells.length > 0) {
      console.log(smells.length)
      divsmellcount.innerHTML =`${i18next.t("numberofregistratesmells")}: ${smells.length}` ;// 
      divsmellcount.setAttribute("data-i18n","numberofregistratesmells")
      clearAllSmells.hidden=false;
      outercontainersmells.hidden=false;
    }
    else{
    
      clearAllSmells.hidden=true;
      outercontainersmells.hidden=true;
      //clearAllSmells.hidden=true
    }


  }

  function addSmell(id) {
    const isExist = smells.some(f => f.id == id)
    if (!isExist) {
      let newsmell = {
        "id": id,
        "name": getSmellNameById(id,i18next.language)
      }
      smells.unshift(newsmell);

      saveSmells(smells);
      if (localStorage.getItem("game2") != null) {
        localStorage.removeItem("game2"); //if exist    
      }
    }

    //setcountsmells()
   
    drawSmells2();
  }

  function removeSmell(id) {
    console.log(smells)
    smells = smells.filter(s => s.id != id);
    console.log(smells)

    saveSmells(smells);
    if (localStorage.getItem("game2") != null) {
      localStorage.removeItem("game2"); //if exist    
    }

    //setcountsmells()

    drawSmells2();

  }



  function saveSmells(smells) {
    localStorage.setItem("smells", JSON.stringify(smells));
  };

  function getGame() {
    //get from localstorage or init new game if not exist
    const value = localStorage.getItem("game2") || initGame(smells, players);
    return JSON.parse(value);
  }


  function getPlayers() {
    const value = localStorage.getItem("players") || initPlayers();
    return JSON.parse(value);
  }

  function initPlayers() {
    const defaultplayers = [];
    setPlayers(defaultplayers);
    return JSON.stringify(defaultplayers);
  }


  function getSmells() {
    const value = localStorage.getItem("smells") || initSmells();
    return JSON.parse(value);
  }

  function initSmells() {
    return JSON.stringify([]);
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








  const defaultlang = "da";
  function getSmellNameById(id, lang = "en") {
   
    if (id === -1) return "";

    const _tmp = defaultsmells.find(field => field.id == id);

    if (!_tmp.hasOwnProperty("languages")) {
      return _tmp.name;
    }
    if (_tmp.languages.hasOwnProperty(lang) && _tmp.languages[lang] > ""){
      //alert(lang)
      return _tmp.languages[lang];
    }
    else if (_tmp.languages.hasOwnProperty(defaultlang) && _tmp.languages[defaultlang] > "") {
      //alert("2")
      return _tmp.languages[defaultlang];
    }
    else {
      //alert("3")
      return _tmp.name;
    }
  }




  function getPlayerNameById(id) {
    let name = players[id];
    return name;
  }







  /*Nulstiller game i localstorage for at starter et nyt spil*/
  function clearGame() {
    localStorage.removeItem("game2");
    initGame(smells, players)
    location.reload();//genindlæs siden
  }




  i18next.on('languageChanged', function(lng) {
    drawSmells2()
  })


  const smellsremovebuttons = containersmells.querySelectorAll('[data-id')

  containersmells.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-times")) {
      const dataId = e.target.parentNode.getAttribute("data-id");
      removeSmell(dataId);    }
  })


  const languageselectordropdownmenu = document.querySelector("#languageselector>.dropdown-menu")
  drawlanguagemenuDD(languageselectordropdownmenu)

});



