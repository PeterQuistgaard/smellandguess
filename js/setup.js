


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



    function tjekgame() {

        const value = localStorage.getItem("game2")
        //console.log("Gamestatus",value)
        currentgame.innerHTML = "";

        if (value  && value.length > 0) {
            const _game = JSON.parse(value)
            

            if(_game.length > 0){
            
            
            div = document.createElement("DIV");
            span = document.createElement("SPAN")
            // span.setAttribute("data-i18n-opt", `{"round": ${game.length}}`)
            // span.innerText = translate("round-plural", { "count": game.length })

            span.setAttribute("data-i18n","gameinprogress-plural")
            span.setAttribute("data-i18n-opt",`{"count": ${_game.length}}`)
            span.innerText=translate("gameinprogress-plural",{"count": _game.length});

            
            div.appendChild(span)
            currentgame.appendChild(div)
            const btn = document.createElement("BUTTON");
            btn.classList.add("btn");
            btn.classList.add("btn-warning");
            btn.classList.add("btn-sn");
            btn.setAttribute("type", "button")
            btn.innerText = translate("cleargame");
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
        div = document.createElement("DIV");
        if (smells[0]) {
            //så er mindst en smell oprettet

            div.innerText = translate("setup03")
            
            containersmells.appendChild(div);
            ul = document.createElement("UL");

            smells.forEach((item) => {
                li = document.createElement("LI");
                li.innerHTML = item.name;
                ul.appendChild(li);
            });

            containersmells.appendChild(ul);
        }
        else {
            div.innerText =translate("setup09") //"Der er ikke oprettet nogen lugte i det aktuelle spil."
            containersmells.appendChild(div);
        }

    }




    function drawContainerPlayers(players) {
        const fragment = document.createDocumentFragment();

        div = document.createElement("DIV");
        if (players[0]) {
            //så er mindst en spiller oprettet
            div.innerText =translate("setup02") //"Disse spiller er oprettet i det aktuelle spil:"
            fragment.appendChild(div);

            players.forEach((item) => {
                div = document.createElement("DIV");
                let img = document.createElement("IMG");
                img.classList.add("mx-2");
                img.style.width = "20px";
                img.setAttribute("src", `/images/flagslanguage/${item.lang}.png`)
                span = document.createElement("SPAN");
                span.innerText = item.name;
                div.append(span);
                div.append(img)
                fragment.appendChild(div);
            }
            );
            containerplayers.innerHTML = "";
            containerplayers.appendChild(fragment);

        }
        else {
            div.innerText =translate("setup10") //"Der er ikke oprettet nogen spillere i det aktuelle spil."
            containerplayers.appendChild(div);

        }



    };

    tjekgame();
    let players = getPlayers();
    let smells = getSmells();


    drawContainerPlayers(players);
    drawSmells2(smells)

});
