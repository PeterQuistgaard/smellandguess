import { drawlanguagemenuDD } from "./smellsutil.js";
import { langAvailableGame } from './constants.js';

const languageselectordropdownmenu = document.querySelector("#languageselector>.dropdown-menu")
drawlanguagemenuDD(languageselectordropdownmenu)
let flagbuttons = document.getElementById("flags")


function drawflags() {

    langAvailableGame.forEach((lan) => {
        const img = document.createElement("IMG");
        img.setAttribute("src", `./images/flagslanguage/${lan}.png`);
        img.setAttribute("alt", lan);
        img.style.cursor = "default"
        flagbuttons.appendChild(img)
    })
}

const numberofflanguages = document.querySelector('[data-i18n="index06"]');
numberofflanguages.setAttribute("data-i18n-opt", `{"count": ${langAvailableGame.length}}`)



drawflags();