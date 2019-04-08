var collisionEnum = {
    ROAD: 0,
    GRASS: 1,
    WALL: 2
}

function collision() {
    var pixelData = tracks[0].collisionContext[tracks[0].currentCollisionContext].getImageData(Math.round(players[mainGameProperties.currentPlayer].x), Math.round(players[mainGameProperties.currentPlayer].y), 1, 1).data;
    if (pixelData[1] > 200) {
        //grass
        players[mainGameProperties.currentPlayer].currentMaxSpeed = players[mainGameProperties.currentPlayer].kart.maxSpeed * 0.3;
        tracks[0].currentCollision = collisionEnum.GRASS;
    } else if (pixelData[0] > 200) {
        //wall 
        var gettingHit = document.getElementById("getting-hit");
        if (gettingHit.paused) {
            gettingHit.play();
        } else {
            gettingHit.currentTime = 0
        }
        players[mainGameProperties.currentPlayer].currentMaxSpeed = players[mainGameProperties.currentPlayer].currentSpeed * -0.5;
        tracks[0].currentCollision = collisionEnum.WALL;
    } else {
        //road 
        players[mainGameProperties.currentPlayer].currentMaxSpeed = players[mainGameProperties.currentPlayer].kart.maxSpeed;
        tracks[0].currentCollision = collisionEnum.ROAD;
    }
}

function createCollisionContext() {
    var contexts = new Array();
    if (imagesToLoad.length>=3) {
        var collisionCanvas = document.createElement('canvas');
        collisionCanvas.width = imagesToLoad[2].image.width;
        collisionCanvas.height = imagesToLoad[2].image.height;
        var collisionContext = collisionCanvas.getContext('2d');
        collisionContext.drawImage(imagesToLoad[2].image, 0, 0)
        collisionContext.getImageData(Math.round(players[mainGameProperties.currentPlayer].x), Math.round(players[mainGameProperties.currentPlayer].y), 1, 1).data;
        contexts.push(collisionContext);
    } if (imagesToLoad.length>=4) {
        collisionCanvas = document.createElement('canvas');
        collisionCanvas.width = imagesToLoad[3].image.width;
        collisionCanvas.height = imagesToLoad[3].image.height;
        var collisionContext2 = collisionCanvas.getContext('2d');
        collisionContext2.drawImage(imagesToLoad[3].image, 0, 0);
        collisionContext2.getImageData(Math.round(players[mainGameProperties.currentPlayer].x), Math.round(players[mainGameProperties.currentPlayer].y), 1, 1).data;
        contexts.push(collisionContext2);
    }
    return contexts;
}