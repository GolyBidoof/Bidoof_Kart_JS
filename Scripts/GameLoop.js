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
        this.countdownClock = 351;
        this.goClock = 100;
        this.initiated = false;
        this.previousLapTime = 0;
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

    var numUpdateSteps = 0;
    while (mainGameProperties.delta >= mainGameProperties.timestep) {
        mainGameProperties.delta -= mainGameProperties.timestep;
        if (++numUpdateSteps >= 240) {
            break;
        }
        drawEverything();

        if(mainGameProperties.countdownClock>0 || mainGameProperties.goClock>0) {
            countdownClock();
        } 
        if (mainGameProperties.countdownClock<=0) {
            mainGameProperties.currentLapTime += mainGameProperties.timestep;
            movement(mainGameProperties.timestep);
        }

        printingTextOnScreen();
    }
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
    if (players[0].boostFrames>0) {
        players[0].boostFrames--;
        players[0].currentMaxSpeed = players[0].currentMaxSpeed * 1.5;
        if (players[0].boostFrames==0) {
            var boost = document.getElementById("boost-sfx");
            boost.pause();
        }
    }
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
        players[0].currentSpeed = -players[0].currentSpeed;
    }
        
    players[0].x += players[0].currentSpeed * Math.sin(players[0].currentDirection * Math.PI / 180) * timestep;
    players[0].y += players[0].currentSpeed * Math.cos(players[0].currentDirection * Math.PI / 180) * timestep;
    
    checkIllegalMoves();
    checkIfInsideCheckpoints();
}

function checkIllegalMoves() {
    if (players[0].x<0) players[0].x=0;
    if (players[0].y<0) players[0].y=0;
    if (players[0].x>tracks[0].map.width) players[0].x=tracks[0].map.width;
    if (players[0].y>tracks[0].map.height) players[0].y=tracks[0].map.height;
}