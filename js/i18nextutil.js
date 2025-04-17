document.addEventListener("DOMContentLoaded", function () {       

i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        debug: false,
        resources: resources
    })
    .then(function (t) {
        // initialized and ready to go!
        updateContent();
    });

;

function splitafterfirstkomma(myText){
    let indexoffirstkomma=myText.indexOf(",");

    let _key;
    let _options;
    if(indexoffirstkomma==-1){           
        _key=myText
    }
    else {
        _key=myText.substring(0,indexoffirstkomma)
        _options=parseoptions(myText.substring(indexoffirstkomma+1) ) 
    }

    return {"key":_key,"options":_options}

}

function parseoptions(optionsstring) {
    //convert to json string
    //console.log("OP",optionsstring)
    const jsonStr = optionsstring.replace(/(\w+:)|(\w+ :)/g, function (matchedStr) {
        return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
    });
    let options = JSON.parse(jsonStr); //converts to a regular object

    return options;
}

function updateContent() {
    // document.getElementById('title').innerHTML = i18next.t('title');

    // document.getElementById('info').innerHTML = `detected user language: "${i18next.language}"  --> loaded languages: "${i18next.languages.join(', ')}"`;
    // document.getElementById('info').title = i18next.t("title")

    //const _elements = document.querySelectorAll("[data-i18n]");
    //disse 4 linjer finder alle elementer med [data-i18n]. Henter værdien og sætter den som innerHtml
    document.querySelectorAll("[data-i18n]").forEach((_element) => {


        const _key=_element.getAttribute("data-i18n")
        const _options = JSON.parse(_element.getAttribute("data-i18n-opt")) || {};

        //console.log("OPTIONS","opt",_options)
        _element.innerHTML = i18next.t(_key,_options)
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

  const _a = e.target.closest(`a`)

  if (_a.hasAttribute("data-lang")) {    
    let selectedlang = _a.getAttribute("data-lang")

    //change img in menu
    imgselectedlang.src = `images/flagslanguage/${selectedlang}.png`
    changeLng(selectedlang); 

    

  }
}, false)



})