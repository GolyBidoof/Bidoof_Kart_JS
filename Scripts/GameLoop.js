class MainGameProperties {
    constructor() {
        this.maxFPS = 60;
        this.timestep = 1000/60;
        this.delta = 0;
        this.lastFrameTimeMs = 0;
        this.currentLapTime = 0;
        this.currentLap = 1;
        this.currentBestLapTime = 59999;
        this.newLapTextFrame = 0;
    }
}

var mainGameProperties;

function printingTextOnScreen() {
    ctx.font = "20px Bungee";
    ctx.fillText(Math.floor(mainGameProperties.currentLapTime/1000 % 60)  + ":" + ("000" + Math.round(mainGameProperties.currentLapTime % 1000)).slice(-3), canvas.width*0.02, canvas.height*0.05);
    ctx.fillText("Lap " + mainGameProperties.currentLap, canvas.width*0.92, canvas.height*0.05);
    ctx.fillText("PB: " + Math.floor(mainGameProperties.currentBestLapTime/1000 % 60) + ":" + ("000" + Math.round(mainGameProperties.currentBestLapTime % 1000)).slice(-3), canvas.width*0.02, canvas.height*0.97);
    
    if (mainGameProperties.newLapTextFrame>0) {
        ctx.font = 20+mainGameProperties.newLapTextFrame/2 + "px Bungee";
        ctx.fillText("Next Lap!", canvas.width*0.45-mainGameProperties.newLapTextFrame, canvas.height*0.45+mainGameProperties.newLapTextFrame/2);
        mainGameProperties.newLapTextFrame++;
        if (mainGameProperties.newLapTextFrame>50) 
            mainGameProperties.newLapTextFrame=0;
    }
    
}

function gameLoop(timestamp) {
    if (timestamp < mainGameProperties.lastFrameTimeMs + (1000 / mainGameProperties.maxFPS)) {
        requestAnimationFrame(gameLoop);
        return;
    }
    mainGameProperties.delta += timestamp - mainGameProperties.lastFrameTimeMs;
    mainGameProperties.lastFrameTimeMs = timestamp;
    console.log(mainGameProperties.delta);

    var numUpdateSteps = 0;
    while (mainGameProperties.delta >= mainGameProperties.timestep) {
        movement(mainGameProperties.timestep);
        mainGameProperties.currentLapTime += mainGameProperties.timestep;
        mainGameProperties.delta -= mainGameProperties.timestep;
        if (++numUpdateSteps >= 240) {
            break;
        }
    }
    drawEverything();
    //debugDrawCheckpoints();
    printingTextOnScreen();
    requestAnimationFrame(gameLoop);
}

function targetAngleSet(timestep) {
    switch(players[0].keyPress) {
        case directionEnum.RIGHT:
        case directionEnum.UPRIGHT:
        case directionEnum.DOWNRIGHT:
            players[0].currentDirection -= players[0].kart.handling * timestep;
            break;
        case directionEnum.LEFT:
        case directionEnum.UPLEFT:
        case directionEnum.DOWNLEFT:
            players[0].currentDirection += players[0].kart.handling * timestep;
            break;
    }
}

function movement(timestep) {
    collision();
    targetAngleSet(timestep);

    if (tracks[0].currentCollision != 2) {
        if (players[0].currentDirection>360) players[0].currentDirection -= 360;
        else if (players[0].currentDirection<0) players[0].currentDirection += 360;

        if (players[0].keyPress==0 && players[0].currentSpeed<0) {
            //Bumping against a wall
            players[0].currentSpeed -= (players[0].currentSpeed - 0)*0.05;
        } else if (
            (players[0].keyPress==directionEnum.UP || players[0].keyPress==directionEnum.UPLEFT || players[0].keyPress==directionEnum.UPRIGHT) 
                && players[0].currentSpeed < players[0].currentMaxSpeed) {
            //Accelerating
            players[0].currentSpeed += timestep * players[0].kart.acc * Math.abs(players[0].currentSpeed - players[0].currentMaxSpeed);
        } else {
            //Decelerating
            players[0].currentSpeed -= timestep * players[0].kart.dec * Math.max(players[0].currentSpeed - 0, 0);
        }
    }
    else {
        players[0].currentSpeed = players[0].currentMaxSpeed;
    }
        
    players[0].x += players[0].currentSpeed * Math.sin(players[0].currentDirection * Math.PI / 180) * timestep;
    players[0].y += players[0].currentSpeed * Math.cos(players[0].currentDirection * Math.PI / 180) * timestep;
    
    checkIllegalMoves();
    checkIfInsideCheckpoints();
}

function checkIllegalMoves() {
    if (players[0].x<0) players[0].x=0;
    if (players[0].y<0) players[0].y=0;
    if (players[0].x>canvas.width) players[0].x=canvas.width;
    if (players[0].y>canvas.height) players[0].y=canvas.height;
}

function resetKey(e) {
    if (e.keyCode in map) {
        map[e.keyCode] = false;
    }
    CheckWhichOnesAreClicked();
}

function CheckWhichOnesAreClicked() {
    var amntOfClicked = 0;
    if (map[37]) amntOfClicked++;
    if (map[38]) amntOfClicked++;
    if (map[39]) amntOfClicked++;
    if (map[40]) amntOfClicked++;
    if (amntOfClicked>2) {
        players[0].keyPress = 0;
        return;
    }

    if (map[37] && map[38] ) {
        players[0].keyPress = directionEnum.UPLEFT;
    }
    else if (map[38] && map[39]) {
        players[0].keyPress = directionEnum.UPRIGHT;
    }
    else if (map[40] && map[37]) {
        players[0].keyPress = directionEnum.DOWNLEFT;
    }
    else if (map[40] && map[39]) {
        players[0].keyPress = directionEnum.DOWNRIGHT;
    }
    else if (map[38]) {
        players[0].keyPress = directionEnum.UP;
    }
    else if (map[37]) {
        players[0].keyPress = directionEnum.LEFT;
    }
    else if (map[39]) {
        players[0].keyPress = directionEnum.RIGHT;
    }
    else if (map[40]) {
        players[0].keyPress = directionEnum.DOWN;
    } 
    else {
        players[0].keyPress = 0;
    }
}

var map = {37: false, 38: false, 39: false, 40: false};

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode in map) {
        map[e.keyCode] = true;
    }   
    CheckWhichOnesAreClicked();
}