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
    mainGameProperties = new MainGameProperties();
    document.onkeydown = checkKey;
    document.onkeyup = resetKey;
    //document.onmousedown = debugCoords;
}

function debugCoords(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    console.log("[" + x  +", " + y + "],");
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
    initializePlayersAndKarts();
    initCheckpoints();
    setStartingLocations();
}

function setStartingLocations() {
    requestAnimationFrame(gameLoop);
}

function drawEverything() {

    //drawing background
    ctx.fillStyle = "rgba(34, 177, 76, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //drawing background
    drawImages(imagesToLoad[0].image, 0, 0-players[0].x+canvas.width/2, 0-players[0].y+canvas.height/2, 0);

    //drawing players
    for (let i = 0; i < players.length; i++){
        drawImages(players[i].image, players[i].currentDirection*Math.PI/180, /*players[i].x, players[i].y,*/canvas.width/2, canvas.height/2, 16);
    }
}
function drawImages(image, angleInRad, positionX, positionY, offset) {
    ctx.save();
    ctx.translate(positionX-offset + image.width / 2, positionY-offset + image.height / 2);
    ctx.rotate(-angleInRad);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}

window.onload = function() {
    initializeCanvas();
    loadImages(['Tracks/track1.png', 'Characters/399.png', 'Collisions/track1.png'], loadImgsToArray);
}