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
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '40px white';
    ctx.fillText("Loading...",canvas.width/2-64, canvas.height/2);

    imagesToLoad = new Array();
    mainGameProperties = new MainGameProperties();

    document.onkeydown = checkKey;
    document.onkeyup = resetKey;
    //document.onmousedown = debugCoords;
}

function debugCoords(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left + players[mainGameProperties.currentPlayer].x - canvas.width/2;
    var y = e.clientY - rect.top + players[mainGameProperties.currentPlayer].y - canvas.height/2;
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
    initMenu();
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
    drawImages(imagesToLoad[0].image, 0, 0-players[mainGameProperties.currentPlayer].x, 0-players[mainGameProperties.currentPlayer].y, 0);

    //drawing players
    //for (let i = 0; i < players.length; i++){
        drawImages(players[mainGameProperties.currentPlayer].image, players[mainGameProperties.currentPlayer].currentDirection*Math.PI/180, /*players[i].x, players[i].y,*/canvas.width/2, canvas.height/2, 16);
    //}

    drawHUD();
    //debugDrawCheckpoints();
}

function drawHUD() {
    if (players[mainGameProperties.currentPlayer].heldItem == heldItem.MUSHROOM) {
        ctx.drawImage(imagesToLoad[5].image, canvas.width*0.9, canvas.height*0.82);
    } else {
        ctx.drawImage(imagesToLoad[4].image, canvas.width*0.9, canvas.height*0.82);
    }
}

function drawImages(image, angleInRad, positionX, positionY, offset) {
    ctx.save();
    if (offset!=0) {
        ctx.translate(positionX-offset + image.width / 2, positionY-offset + image.height / 2);
        ctx.rotate(-angleInRad);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
    } else {
        ctx.drawImage(image, positionX+canvas.width/2, positionY+canvas.height/2);
    }
    ctx.restore();
}

window.onload = function() {
    initializeCanvas();
    //var track = prompt("Select Track", "Figure-8");
    //if (track == null || track == "") {
        //txt = "Cancelled";
    //} else {
        //if (track=="Figure-8") {
            loadImages(['Tracks/figure8.png', 'Characters/399.png', 
            'Tracks/Collisions/figure81.png', 'Tracks/Collisions/figure82.png', 
            'HUD/EmptyRoulette.png', 'HUD/MushroomExists.png', 
            'HUD/Menu/CharacterUnclickedButton.png','HUD/Menu/CharacterClickedButton.png', 
            'HUD/Menu/CharacterCheckedButton.png', 'Characters/202.png', 
            'Characters/272.png', 'Characters/341.png', 
            'Characters/476.png', 'Characters/618.png',
            'HUD/Menu/Background.png', 'HUD/Menu/ButtonUnclicked.png',
            'HUD/Menu/ButtonClicked.png', 'HUD/Menu/ButtonChecked.png'], loadImgsToArray);
        //} else {
            //loadImages(['Tracks/track1.png', 'Characters/399.png', 'Collisions/track1.png'], loadImgsToArray);
        //}
    //}
    
    //loadImages(['Tracks/track1.png', 'Characters/399.png', 'Collisions/track1.png'], loadImgsToArray);
}