
//import i18next from '../lib/i18next.js';
import {t} from '../lib/i18next.js';
import { drawlanguagemenuDD} from "./smellsutil.js";


const responseclearlocalstorage=document.getElementById("responseclearlocalstorage")       
       
btnclearlocalstorage.addEventListener("click",()=>{
    localStorage.clear();

    // responseclearlocalstorage.innerText=i18next.t("privacy14")
    responseclearlocalstorage.innerText=t("privacy14")
    responseclearlocalstorage.hidden=false;
})


const languageselectordropdownmenu = document.querySelector("#languageselector>.dropdown-menu")
drawlanguagemenuDD(languageselectordropdownmenu)