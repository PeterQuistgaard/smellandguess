import i18next from '../lib/i18next.js';
import LanguageDetector from '../lib/i18nextBrowserLanguageDetector.js';
import {resources} from '../js/i18nextresources.js';


document.addEventListener("DOMContentLoaded", function () {

    i18next
        // .use(i18nextHttpBackend)
        .use(LanguageDetector)
        .init({
            fallbackLng: 'en',
            supportedLngs: ["da", "en"],
            debug: false,
            resources: resources
        })
        .then(function (t) {
            // initialized and ready to go!
            updateContent();
        });
    ;

  

    function updateContent() {
        //disse 4 linjer finder alle elementer med [data-i18n] og evt. [data-i18n-op] . Henter værdien og sætter den som innerHtml
        document.querySelectorAll("[data-i18n]").forEach((_element) => {
            const _key = _element.getAttribute("data-i18n")
            const _options = JSON.parse(_element.getAttribute("data-i18n-opt")) || {};
            _element.innerHTML = i18next.t(_key, _options)
        })
    }

    function changeLng(lng) {
        i18next.changeLanguage(lng);
    }

    i18next.on('languageChanged', () => {
        updateContent();
        document.documentElement.lang = i18next.language//change attribute lang in html tag
    });


    const languageselector = document.getElementById("languageselector")
    const languageselectordropdownmenu = languageselector.querySelector(".dropdown-menu")
    const imgselectedlang = languageselector.querySelector(".imgselectedlang")
    imgselectedlang.src = `images/flagslanguage/${i18next.language}.png`

    languageselectordropdownmenu.addEventListener("click", (e) => {

        const _li = e.target.closest(`li`)
       

        if (_li.hasAttribute("data-lang")) {
            let selectedlang = _li.getAttribute("data-lang")
            //change img in menu
            imgselectedlang.src = `images/flagslanguage/${selectedlang}.png`
            changeLng(selectedlang);        }
    }, false)
})