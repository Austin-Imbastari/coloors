"use strict";
//global selection & variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll(".color h2");
let initialColors;
//function
function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors() {
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        console.log(hexText);
        const randomColors = generateHex();

        //add to bacground
        div.style.backgroundColor = randomColors;
        hexText.innerText = randomColors;
    });
}

randomColors();
