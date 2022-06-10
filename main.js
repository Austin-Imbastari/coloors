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
        // check for contrast
        checkTextContrast(randomColors, hexText);

        //initial colorize sliders
        const color = chroma(randomColors);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        console.log(hue);
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });
}

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    luminance > 0.5
        ? (text.style.color = "black")
        : (text.style.color = "white");
}

function colorizeSliders(color, hue, brightness, saturation) {
    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);

    //input update colors
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);

    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
        0
    )}, ${scaleSat(1)})`;

    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
        0
    )}, ${scaleBright(0.5)},${scaleBright(1)})`;

    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,74,75), rgb(204,204,75), rgb(74,204,75),rgb(75,204,204),rgb(74,75,204), rgb(204,75,204),rgb(204,75,75))`;
}

randomColors();
