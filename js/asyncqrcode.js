/*
        * Depent on qrcode.js
        * Wrap QRCode in promise to make it posible to run as async/await        
        */
const asyncqrcode = function (txt, colorLight = "white") {
    return new Promise((resolve, reject) => {
        try {
            const mydiv = document.createElement("DIV");

            // 72 dot/inc = 2.8346456693 dot/mm
            // 30mm = 2.8346456693 dot/mm *30 mm
            const width_mm = 30;
            const width_dot = 2.8346456693 * width_mm;

            new QRCode(mydiv, {
                text: txt,
                width: width_dot,
                height: width_dot,
                colorDark: "black",
                colorLight: colorLight,
                correctLevel: QRCode.CorrectLevel.H
            });

            //mydiv.children[0] is canvas-tag and mydiv.children[0] is img-tag
            const src = mydiv.children[0].toDataURL("image/png");//canvas toDataURL 
            mydiv.remove();//remove mydiv from DOM
            resolve(src);
        } catch (error) {
            reject(error)
        }
    });
};