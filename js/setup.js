"use strict";
import i18next from '../lib/i18next.js';
import { drawlanguagemenuDD} from "./smellsutil.js";

document.addEventListener("DOMContentLoaded", async function () {
    //Global variables


    //references to UI elements
    const containerplayers = document.getElementById("containerplayers");
    const containersmells = document.getElementById("containersmells2");
    const currentgame = document.getElementById("currentgame");
    const userlanguage = document.getElementById("userlanguage");


    function getPlayers() {

        const value = localStorage.getItem("players") || initPlayers();
        return JSON.parse(value);
    }

    function initPlayers() {
        const defaultplayers = [];
       // setPlayers(defaultplayers);
        return JSON.stringify(defaultplayers);
    }

    function getSmells() {
        const value = localStorage.getItem("smells") || initSmells();
        return JSON.parse(value);
    }

    function initSmells() {
        return JSON.stringify([]);
    }



    function tjekgame() {

        const value = localStorage.getItem("game2")
        //console.log("Gamestatus",value)
        currentgame.innerHTML = "";

        if (value  && value.length > 0) {
            const _game = JSON.parse(value)
            

            if(_game.length > 0){
            
            
            const div = document.createElement("DIV");
            const span = document.createElement("SPAN")


            span.setAttribute("data-i18n","gameinprogress")
            span.setAttribute("data-i18n-opt",`{"count": ${_game.length}}`)
            span.innerText=i18next.t("gameinprogress",{"count": _game.length});

            
            div.appendChild(span)
            currentgame.appendChild(div)
            const btn = document.createElement("BUTTON");
            btn.classList.add("btn");
            btn.classList.add("btn-warning");
            btn.classList.add("btn-sn");
            btn.setAttribute("type", "button")
            btn.innerText = i18next.t("cleargame");

            btn.innerText = i18next.t("cleargame");
            btn.setAttribute("data-i18n", "cleargame")
            btn.addEventListener("click", clearGame)
            currentgame.appendChild(btn)
        }
        }
    }




    function clearGame() {
        localStorage.removeItem("game2");
        //initGame(smells, players)
        //initGame2(smells, players)
        location.reload();//genindlæs siden
    }

    function drawSmells2(smells) {

        // console.log(smells)                        
        const div = document.createElement("DIV");
        if (smells[0]) {
            //så er mindst en smell oprettet

            div.innerText = i18next.t("setup03")
            div.setAttribute("data-i18n","setup03")           
            
            containersmells.appendChild(div);
            const ul = document.createElement("UL");

            smells.forEach((item) => {
                const li = document.createElement("LI");
                li.innerHTML = item.name;
                ul.appendChild(li);
            });

            containersmells.appendChild(ul);
            containersmells.classList.add("alert")
            containersmells.classList.add("alert-secondary")
        }
        else {
            div.innerText =i18next.t("setup09") //"Der er ikke oprettet nogen lugte i det aktuelle spil."
            div.setAttribute("data-i18n","setup09")  
            containersmells.appendChild(div);
            
            containersmells.classList.add("alert")
            containersmells.classList.add("alert-danger")
        }

    }




    function drawContainerPlayers(players) {
        const fragment = document.createDocumentFragment();

        let div = document.createElement("DIV");


        if (players[0]) {
            //så er mindst en spiller oprettet
            div.innerText =i18next.t("setup02") //"Disse spiller er oprettet i det aktuelle spil:"
            div.setAttribute("data-i18n","setup02")     
            fragment.appendChild(div);

            players.forEach((item) => {
                div = document.createElement("DIV");
                const  img = document.createElement("IMG");
                img.classList.add("mx-2");
                img.style.width = "20px";
                img.setAttribute("src", `./images/flagslanguage/${item.lang}.png`)
                img.setAttribute("alt", item.lang)
                const span = document.createElement("SPAN");
                span.innerText = item.name;
                div.append(span);
                div.append(img)
                fragment.appendChild(div);
            }
            );
            containerplayers.innerHTML = "";
            containerplayers.appendChild(fragment);
            
            containerplayers.classList.add("alert")
            containerplayers.classList.add("alert-secondary")

        }
        else {
            div.innerText =i18next.t("setup10") //"Der er ikke oprettet nogen spillere i det aktuelle spil."
            div.setAttribute("data-i18n","setup10")              
            containerplayers.appendChild(div);
            containerplayers.classList.add("alert")
            containerplayers.classList.add("alert-danger")
        }



    };

    tjekgame();
    let players = getPlayers();
    let smells = getSmells();


    drawContainerPlayers(players);
    drawSmells2(smells)


        const languageselectordropdownmenu = document.querySelector("#languageselector>.dropdown-menu")
        drawlanguagemenuDD(languageselectordropdownmenu)

});
