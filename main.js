"use strict";
//global selection & variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjust = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
const lockBtn = document.querySelectorAll(".lock");
let initialColors;

//local storage
let savedPalettes = [];

//event listeners
sliders.forEach((slider) => {
    slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUi(index);
    });
});

currentHex.forEach((hex) => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    });
});

popup.addEventListener("transitionend", () => {
    const popupBox = popup.children[0];
    popup.classList.remove("active");
    popupBox.classList.remove("active");
});

adjustBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        openAdjustPanel(index);
    });
});

closeAdjust.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        closeAdjustPanel(index);
    });
});

generateBtn.addEventListener("click", () => {
    randomColors();
});

lockBtn.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
        btn.children[0].classList.toggle("fa-lock-open");

        btn.children[0].classList.toggle("fa-lock");
        colorDivs[index].classList.toggle("locked");
    });
});

//function
function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors() {
    //initial colors
    initialColors = [];

    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColors = generateHex();
        if (div.classList.contains("locked")) {
            initialColors.push(hexText.innerText);
            return;
        } else {
            initialColors.push(chroma(randomColors).hex());
        }

        //add to bacground
        div.style.backgroundColor = randomColors;
        hexText.innerText = randomColors;
        // check for contrast
        checkTextContrast(randomColors, hexText);

        //initial colorize sliders
        const color = chroma(randomColors);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });
    //reset inputs
    resetInputs();
    //check for btn contrast
    adjustBtn.forEach((btn, index) => {
        checkTextContrast(initialColors[index], btn);

        checkTextContrast(initialColors[index], lockBtn[index]);
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

function hslControls(e) {
    const index =
        e.target.getAttribute("data-bright") ||
        e.target.getAttribute("data-sat") ||
        e.target.getAttribute("data-hue");
    let sliders = e.target.parentElement.querySelectorAll(
        "input[type='range']"
    );
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = initialColors[index];
    console.log(bgColor);

    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    colorDivs[index].style.backgroundColor = color;
    //colorixze slider/input
    colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUi(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();
    //check contrast
    checkTextContrast(color, textHex);
    for (let icon of icons) {
        checkTextContrast(color, icon);
    }
}

function resetInputs() {
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach((slider) => {
        if (slider.name === "hue") {
            const hueColor = initialColors[slider.getAttribute("data-hue")];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if (slider.name === "brightness") {
            const brightColor =
                initialColors[slider.getAttribute("data-bright")];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
        }
        if (slider.name === "saturation") {
            const satColor = initialColors[slider.getAttribute("data-sat")];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue * 100) / 100;
        }
    });
}

function copyToClipboard(hex) {
    const el = document.createElement("textarea");
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    //pop up animation
    const popupBox = popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");
}

function openAdjustPanel(index) {
    sliderContainers[index].classList.toggle("active");
}
function closeAdjustPanel(index) {
    sliderContainers[index].classList.remove("active");
}

//Save to palette and local storage
const saveBtn = document.querySelector(".save-panel");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-name");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

function openPalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.add("active");
    popup.classList.add("active");
}

function closePalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
}

function savePalette(e) {
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    let name = saveInput.value;
    console.log(saveInput);
    const colors = [];
    currentHex.forEach((hex) => {
        colors.push(hex.innerText);
    });
    //Generate Object
    let paletteNr = savedPalettes.length;
    const paletteObj = { name, colors, nr: paletteNr };
    savedPalettes.push(paletteObj);
    console.log(savedPalettes);
    //save to local storage
    saveToLocal(paletteObj);
    name = "";

    //generate the palette for library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");

    paletteObj.colors.forEach((color) => {
        const smallDiv = document.createElement("div");
        preview.appendChild(smallDiv);
        smallDiv.style.backgroundColor = color;
        console.log(color);
    });
    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObj.nr);
    paletteBtn.innerText = "Select";

    //attach events to btn
    paletteBtn.addEventListener("click", (e) => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color);
            colorDivs[index].style.backgroundColor = color;
            const text = colorDivs[index].children[0];
            checkTextContrast(color, text);
            updateTextUi(index);
        });
        resetInputs();
    });

    //append to library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
}

function saveToLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem("palettes") === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function openLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add("active");
    popup.classList.add("active");
}

function closeLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove("active");
}

function getLocal() {
    if (localStorage.getItem("palettes") === null) {
        localPalettes = [];
    } else {
        const paletteObject = JSON.parse(localStorage.getItem("palettes"));
        paletteObject.forEach((paletteObj) => {
            //generate the palette for library
            const palette = document.createElement("div");
            palette.classList.add("custom-palette");
            const title = document.createElement("h4");
            title.innerText = paletteObj.name;
            const preview = document.createElement("div");
            preview.classList.add("small-preview");

            paletteObj.colors.forEach((color) => {
                const smallDiv = document.createElement("div");
                preview.appendChild(smallDiv);
                smallDiv.style.backgroundColor = color;
            });
            const paletteBtn = document.createElement("button");
            paletteBtn.classList.add("pick-palette-btn");
            paletteBtn.classList.add(paletteObj.nr);
            paletteBtn.innerText = "Select";

            //attach events to btn
            paletteBtn.addEventListener("click", (e) => {
                closeLibrary();
                const paletteIndex = e.target.classList[1];
                initialColors = [];
                savedPalettes[paletteIndex].colors.forEach((color, index) => {
                    initialColors.push(color);
                    colorDivs[index].style.backgroundColor = color;
                    const text = colorDivs[index].children[0];
                    checkTextContrast(color, text);
                    updateTextUi(index);
                });
                resetInputs();
            });

            //append to library
            palette.appendChild(title);
            palette.appendChild(preview);
            palette.appendChild(paletteBtn);
            libraryContainer.children[0].appendChild(palette);
        });
    }
}
getLocal();
randomColors();
