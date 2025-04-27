"use strict";
import { defaultsmells } from "./defaultsmells.js";

import i18next from '../lib/i18next.js';
import { drawlanguagemenuDD} from "./smellsutil.js";



    document.addEventListener("DOMContentLoaded", function () {


        function drawautocomplete(lang) {
            let options = defaultsmells.map(({ id, languages }) => ({ "label": languages[i18next.language], "value": id.toString() }));

            options = options.sort((a, b) => a.label !== b.label ? a.label < b.label ? -1 : 1 : 0)

            //get last qrprint ids form localStorage
            const qrprintIntegers = JSON.parse(localStorage.getItem("qrprint"));

            let qrprintStrings = []//autocomplet needs array of strings
            if (qrprintIntegers) {
                qrprintStrings = qrprintIntegers.map((id) => (id.toString()));//convert from integers to strings
            }


            const autocomplete_select=document.querySelector(".autocomplete-select");
            autocomplete_select.innerHTML = ""; 

            var autocomplete = new SelectPure(".autocomplete-select", {
                options: options,
                value: qrprintStrings,
                multiple: true,
                autocomplete: true,
                icon: "fa fa-times",
                onChange: value => { console.log(value); }//virker ikke!
            });

          

        }
        async function getSelectedSmells() {

            const selecteditems = selectedcontainer.querySelectorAll(`[data-value]`);
            let selectedSmells = [];

            selecteditems.forEach((element) => {
                selectedSmells.push(parseInt(element.getAttribute('data-value')));
            });

            localStorage.setItem("qrprint", JSON.stringify(selectedSmells));

            const { jsPDF } = window.jspdf;
            let doc = new jsPDF("p", "mm", "a4");//l or p for landscape or portal,unit mm, 

            const leftmargin = 20;
            doc.text(`${i18next.t("setup19")} `, leftmargin, 20);//overskrift

            let ox = leftmargin;
            let oy = 30;
            const w = 16;//size on QR-kode in mm
            // doc.setDrawColor(255, 0, 0);
            doc.setDrawColor(125, 125, 125);
            doc.setLineWidth(0.075)

            const columns = 6;
            let rows = Math.ceil(selectedSmells.length / columns);

            console.log("rows colums", rows, columns);
            const space = 1.5;

            let x = 0;
            let y = 0;
            let idx = 0;

            for (let r = 0; r < rows; r++) {
                y = oy + (w * r) + (space * r)

                for (let c = 0; c < columns; c++) {
                    idx = r * columns + c;
                    const element = selectedSmells[idx];
                    x = ox + (w * c) + (space * c);

                    if (element != undefined) {
                        doc.addImage(await asyncqrcode(element.toString()), 'png', x, y, w, w);
                    }
                }

            }

            //vandrette skæremærker
            for (let r = 0; r < rows + 1; r++) {
                let y1 = oy + r * (w + space) - space / 2
                let y2 = y1

                let x1 = ox - space
                let x2 = x1 + columns * (w + space) + space

                doc.line(x1, y1, x2, y2)
            }

            //lodrette skæremærker
            for (let c = 0; c < columns + 1; c++) {
                let x1 = ox - space / 2 + c * (w + space)
                let x2 = x1

                let y1 = oy - space
                let y2 = y1 + rows * (w + space) + space

                doc.line(x1, y1, x2, y2)

            }

            doc.save("qrcodes.pdf");

        }

        drawautocomplete(i18next.language)

        i18next.on('languageChanged', function (lng) {
            drawautocomplete(lng)
        })


        document.getElementById("print").addEventListener("click", () => getSelectedSmells());
        const selectedcontainer = document.querySelector(".select-pure__label");
        //console.log(selectedcontainer)

        const languageselectordropdownmenu = document.querySelector("#languageselector>.dropdown-menu")
        drawlanguagemenuDD(languageselectordropdownmenu)

    });