var ctx;
var canvas;
var imagesToLoad;
var loadedImages;

class imagePlusLocation {
    constructor(image) {
        this.image = image;
        this.x = 0;
        this.y = 0;   
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initializeCanvas() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    imagesToLoad = new Array();
    document.onkeydown = checkKey;
    document.onkeyup = resetKey;
}

function loadImages(images, callback) {
    let promises = [];
    images.forEach(img => {
        promises.push(new Promise(resolve => {
            let imgObj = new Image();
            imgObj.onload = () => resolve(imgObj);
            imgObj.src = img;
        }));
    });
    Promise.all(promises).then(imgs => callback(imgs));
}

function loadImgsToArray(imgs) {
    imgs.forEach(img => 
        imagesToLoad.push(
            new imagePlusLocation(img)
            )
    );
    setStartingLocations();
    initializePlayersAndKarts();
}

function setStartingLocations() {

    requestAnimationFrame(gameLoop);
}

function drawEverything() {
    //drawing background
    drawOneImage(imagesToLoad[0], 0);

    //drawing players
    for (var i = 0; i < players.length; i++){
        drawOneImage(players[i], 16);
    }

}

function drawOneImage(element, offset) {
    ctx.drawImage(element.image, element.x - offset, element.y - offset);
}

window.onload = function() {
    initializeCanvas();
    loadImages(['track1.png', '399.png'], loadImgsToArray);
}