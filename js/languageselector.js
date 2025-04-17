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