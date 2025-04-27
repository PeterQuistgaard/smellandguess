


const languageselector = document.getElementById("languageselector")
const languageselectordropdownmenu = languageselector.querySelector(".dropdown-menu")

function drawlanguagemenuDD(element) {
     const fragment = document.createDocumentFragment();

     langAvailableHomepage.forEach((lang) => {
          const li = document.createElement("LI");
          li.classList.add("dropdown-item");
          li.setAttribute("data-lang", lang);
          li.style.cursor = "pointer"
          const img = document.createElement("IMG");
          img.setAttribute("src", `./images/flagslanguage/${lang}.png`);
          img.setAttribute("alt", lang);
          //img.style.width = "20px"

          li.appendChild(img)
          fragment.append(li)
     })

     element.append(fragment)
}

drawlanguagemenuDD(languageselectordropdownmenu)
