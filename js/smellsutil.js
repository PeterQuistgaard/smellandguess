import { defaultsmells } from "./defaultsmells.js";
import { langAvailableHomepage } from './constants.js';

export function getallsmells(_lang) {
    return defaultsmells.map(smell => smell.languages[_lang]).sort(function (a, b) { return a !== b ? a < b ? -1 : 1 : 0 })
}


/*get number of languages ​​available smells*/
export function getnumberoffavailablesmells() {
    return defaultsmells.length;
}

const defaultlang = "en";
export function getSmellNameById(id, lang = "en") {
    if (id === -1) return "";

    if (!defaultsmells) {
        console.log("Cant find defaultsmells")
        return undefined;
    }

    let _tmp = defaultsmells.find(field => field.id == id);

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


/*
 * Creates a list of li elements and appends them to the ul element
 * langAvailableHomepage are the languages ​​to be added to the list
 */
export function drawlanguagemenuDD(ulelement) {
    const fragment = document.createDocumentFragment();

    langAvailableHomepage.forEach((lang) => {
        const li = document.createElement("LI");
        li.classList.add("dropdown-item");
        li.setAttribute("data-lang", lang);
        li.style.cursor = "pointer"
        const img = document.createElement("IMG");
        img.setAttribute("src", `images/flagslanguage/${lang}.png`);
        img.setAttribute("alt", lang);
        //img.style.width = "20px"

        li.appendChild(img)
        fragment.append(li)
    })

    ulelement.append(fragment)
}


/**
 * Retrieve user-preferred locales from browser
 *
 * @param {boolean} languageCodeOnly - when true, returns
 * ["en", "da"] instead of ["en-US", "da-DK"]
 * @returns array | undefined
 */
export function browserlocales(languageCodeOnly = false) {
    return navigator.languages.map((locale) =>
      languageCodeOnly ? locale.split("-")[0] : locale,
    );
  }
  



  export function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}