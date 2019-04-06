
class MainGameProperties {
    constructor() {
        this.maxFPS = 60;
        this.timestep = 1000/60;
        this.delta = 0;
        this.lastFrameTimeMs = 0;
        this.currentLapTime = 0;
        this.currentLap = 1;
        this.currentBestLapTime = 59999;
    }
}

var mainGameProperties;

function gameLoop(timestamp) {
    if (timestamp < mainGameProperties.lastFrameTimeMs + (1000 / mainGameProperties.maxFPS)) {
        requestAnimationFrame(gameLoop);
        return;
    }
    mainGameProperties.delta += timestamp - mainGameProperties.lastFrameTimeMs;
    mainGameProperties.lastFrameTimeMs = timestamp;
    mainGameProperties.currentLapTime += mainGameProperties.delta;

    var numUpdateSteps = 0;
    while (mainGameProperties.delta >= mainGameProperties.timestep) {
        movement(mainGameProperties.timestep);
        mainGameProperties.delta -= mainGameProperties.timestep;
        if (++numUpdateSteps >= 240) {
            break;
        }
    }
    drawEverything();
    //debugDrawCheckpoints();

    ctx.font = "15px Arial";
    ctx.fillText(Math.floor(mainGameProperties.currentLapTime/1000 % 60)  + ":" + ("000" + Math.round(mainGameProperties.currentLapTime % 1000)).slice(-3), canvas.width*0.02, canvas.height*0.05);

    ctx.fillText("Lap " + mainGameProperties.currentLap, canvas.width*0.95, canvas.height*0.05);

    ctx.fillText("PB: " + Math.floor(mainGameProperties.currentBestLapTime/1000 % 60) + ":" + ("000" + Math.round(mainGameProperties.currentBestLapTime % 1000)).slice(-3), canvas.width*0.02, canvas.height*0.95);
    requestAnimationFrame(gameLoop);
}

function movement(timestep) {
    collision();

    if (tracks[0].currentCollision != 2) {
        var targetAngle = players[0].currentDirection;
        switch(players[0].keyPress) {
            case directionEnum.UP:
                targetAngle = 180;
                break;
            case directionEnum.DOWN:
                targetAngle = 0;
                break;
            case directionEnum.RIGHT:
                targetAngle = 90;
                break;
            case directionEnum.LEFT:
                targetAngle = 270;
                break;
            case directionEnum.DOWNLEFT:
                targetAngle = 315;
                break;
            case directionEnum.DOWNRIGHT:
                targetAngle = 45;
                break;
            case directionEnum.UPRIGHT:
                targetAngle = 135;
                break;
            case directionEnum.UPLEFT:
                targetAngle = 225;
                break;
        }
        var anglePlus360 = players[0].currentDirection+360;
        var angleMinus360 = players[0].currentDirection-360;
    
        if (Math.abs(anglePlus360-targetAngle) < Math.abs(players[0].currentDirection-targetAngle)) {
            players[0].currentDirection += mainGameProperties.timestep*(targetAngle - anglePlus360)*players[0].kart.handling;
        } else if (Math.abs(angleMinus360-targetAngle) < Math.abs(players[0].currentDirection-targetAngle)) {
            players[0].currentDirection += mainGameProperties.timestep*(targetAngle - angleMinus360)*players[0].kart.handling;
        } else {
            players[0].currentDirection += mainGameProperties.timestep*(targetAngle - players[0].currentDirection)*players[0].kart.handling;
        }

        if (players[0].currentDirection>360) players[0].currentDirection -= 360;
        else if (players[0].currentDirection<0) players[0].currentDirection += 360;

        if (players[0].keyPress==0 && players[0].currentSpeed<0) {
            //Bumping against a wall
            players[0].currentSpeed -= (players[0].currentSpeed - 0)*0.05;
        } else if (players[0].keyPress!=0 && players[0].currentSpeed < players[0].currentMaxSpeed) {
            //Accelerating
            players[0].currentSpeed += mainGameProperties.timestep * players[0].kart.acc * Math.abs(players[0].currentSpeed - players[0].currentMaxSpeed);
        } else {
            //Decelerating
            players[0].currentSpeed -= mainGameProperties.timestep * players[0].kart.dec * Math.max(players[0].currentSpeed - 0, 0);
        }
    }
    else {
        players[0].currentSpeed = players[0].currentMaxSpeed;
    }
        
    players[0].x += players[0].currentSpeed * Math.sin(players[0].currentDirection * Math.PI / 180) * mainGameProperties.timestep;
    players[0].y += players[0].currentSpeed * Math.cos(players[0].currentDirection * Math.PI / 180) * mainGameProperties.timestep;

    checkIfInsideCheckpoints();

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