"use strict";
import i18next from '../lib/i18next.js';
import { getallsmells, getnumberoffavailablesmells,drawlanguagemenuDD,browserlocales} from "./smellsutil.js";
import {langAvailableHomepage,langAvailableGame} from './constants.js';


document.addEventListener("DOMContentLoaded", function () {
     
    const smellcontainer = document.getElementById("smellcontainer");

    let flagbuttons = document.getElementById("flagbuttons")

    function flagbuttonssetactiveclass(lan) {
        const buttons = flagbuttons.querySelectorAll("button");
        buttons.forEach((btn) => {
            const btnlan = btn.getAttribute("data-lan")
            if (btnlan == lan) {
                btn.classList.add("active")
            }
            else {
                btn.classList.remove("active")
            }
        })
    }

    
    function drawflagbuttons(lng) {       

        langAvailableGame.forEach((lan) => {
            const btn = document.createElement("BUTTON");
            btn.classList.add("btn");
            btn.classList.add("btn-light");
            //btn.classList.add("btn-sn");        

            if (lan == lng) {
                btn.classList.add("active");
            }
            btn.setAttribute("type", "button")
            btn.setAttribute("data-lan", lan);
            const img = document.createElement("IMG");
            img.setAttribute("src", `./images/flagslanguage/${lan}.png`);
            img.setAttribute("alt", lan);
            btn.appendChild(img)

            btn.addEventListener("click", (e) => {
                drawlist(lan)
                flagbuttonssetactiveclass(lan)

            }, true)
            flagbuttons.appendChild(btn)
        })
    }


    i18next.on('languageChanged', function (lng) {
        drawlist(lng)
        flagbuttonssetactiveclass(lng)
    })


    //Lige nu er der xx lugte tilgængelig i WebApp'en.
    const smell02 = document.getElementById("smell02");
    //const numberofsmells = defaultsmells.length;
    const numberofsmells = getnumberoffavailablesmells();
    smell02.innerText = i18next.t("smell02", { "smellscount": numberofsmells })
    smell02.setAttribute("data-i18n-opt", `{"smellscount":${numberofsmells}}`)


    let _laninitdraw = i18next.language;

    const navigatorlanguages = browserlocales()
    //navigatorlanguages not undefined and first browserlanguage is in array langAvailableGame but not in langAvailableHomepage
    if (navigatorlanguages && !langAvailableHomepage.includes(navigatorlanguages[0]) && langAvailableGame.includes(navigatorlanguages[0])) {
        _laninitdraw = navigatorlanguages[0];
        // console.log("LANGUAGE from browser")
    }
    drawflagbuttons(_laninitdraw)
    drawlist( _laninitdraw)//draw with selectet lang or 1 of 8 languages in langAvailableGame


    function drawlist( _lang) {
        smellcontainer.innerHTML = ""

        const _smellsorderdbyname=getallsmells(_lang);


        _smellsorderdbyname.forEach(smell => {
            const _li = document.createElement("li");
            const _span = document.createElement("span");
            _span.innerText = smell;
            _li.appendChild(_span)
            smellcontainer.appendChild(_li)
        });

    }


    const languageselectordropdownmenu = document.querySelector("#languageselector>.dropdown-menu")
    drawlanguagemenuDD(languageselectordropdownmenu)

});


