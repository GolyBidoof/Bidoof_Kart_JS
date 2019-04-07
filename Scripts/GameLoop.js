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
        this.currentScreen = 0;
        this.currentPlayer = 0;
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
        if (mainGameProperties.currentScreen==0) drawMenu();
        else if (mainGameProperties.currentScreen==1) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0,canvas.width, canvas.height);
            var sfx = document.getElementById("go-to-race");
                sfx.volume = 0.5;
                if (sfx.paused) mainGameProperties.currentScreen++;
        } else {
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
    }
    requestAnimationFrame(gameLoop);
}

function targetAngleSet(timestep) {
    switch(players[mainGameProperties.currentPlayer].keyPress) {
        case directionEnum.RIGHT:
        case directionEnum.UPRIGHT:
        case directionEnum.DOWNRIGHT:
            players[mainGameProperties.currentPlayer].currentDirection -= players[mainGameProperties.currentPlayer].kart.handling * timestep;
            break;
        case directionEnum.LEFT:
        case directionEnum.UPLEFT:
        case directionEnum.DOWNLEFT:
            players[mainGameProperties.currentPlayer].currentDirection += players[mainGameProperties.currentPlayer].kart.handling * timestep;
            break;
    }
}

function movement(timestep) {
    collision();
    targetAngleSet(timestep);
    if (players[mainGameProperties.currentPlayer].boostFrames>0) {
        players[mainGameProperties.currentPlayer].boostFrames--;
        players[mainGameProperties.currentPlayer].currentMaxSpeed = players[mainGameProperties.currentPlayer].currentMaxSpeed * 1.5;
        if (players[mainGameProperties.currentPlayer].boostFrames==0) {
            var boost = document.getElementById("boost-sfx");
            boost.pause();
        }
    }
    if (tracks[0].currentCollision != 2) {
        if (players[mainGameProperties.currentPlayer].currentDirection>360) players[mainGameProperties.currentPlayer].currentDirection -= 360;
        else if (players[mainGameProperties.currentPlayer].currentDirection<0) players[mainGameProperties.currentPlayer].currentDirection += 360;

        if (players[mainGameProperties.currentPlayer].keyPress==0 && players[mainGameProperties.currentPlayer].currentSpeed<0) {
            //Bumping against a wall
            players[mainGameProperties.currentPlayer].currentSpeed -= (players[mainGameProperties.currentPlayer].currentSpeed - 0)*0.05;
        } else if (
            (players[mainGameProperties.currentPlayer].keyPress==directionEnum.UP || players[mainGameProperties.currentPlayer].keyPress==directionEnum.UPLEFT || players[mainGameProperties.currentPlayer].keyPress==directionEnum.UPRIGHT) 
                && players[mainGameProperties.currentPlayer].currentSpeed < players[mainGameProperties.currentPlayer].currentMaxSpeed) {
            //Accelerating
            players[mainGameProperties.currentPlayer].currentSpeed += timestep * players[mainGameProperties.currentPlayer].kart.acc * Math.abs(players[mainGameProperties.currentPlayer].currentSpeed - players[mainGameProperties.currentPlayer].currentMaxSpeed);
        } else {
            //Decelerating
            players[mainGameProperties.currentPlayer].currentSpeed -= timestep * players[mainGameProperties.currentPlayer].kart.dec * Math.max(players[mainGameProperties.currentPlayer].currentSpeed - 0, 0);
        }
    }
    else {
        players[mainGameProperties.currentPlayer].currentSpeed = -players[mainGameProperties.currentPlayer].currentSpeed;
    }
        
    players[mainGameProperties.currentPlayer].x += players[mainGameProperties.currentPlayer].currentSpeed * Math.sin(players[mainGameProperties.currentPlayer].currentDirection * Math.PI / 180) * timestep;
    players[mainGameProperties.currentPlayer].y += players[mainGameProperties.currentPlayer].currentSpeed * Math.cos(players[mainGameProperties.currentPlayer].currentDirection * Math.PI / 180) * timestep;
    
    checkIllegalMoves();
    checkIfInsideCheckpoints();
}

function checkIllegalMoves() {
    if (players[mainGameProperties.currentPlayer].x<0) players[mainGameProperties.currentPlayer].x=0;
    if (players[mainGameProperties.currentPlayer].y<0) players[mainGameProperties.currentPlayer].y=0;
    if (players[mainGameProperties.currentPlayer].x>tracks[0].map.width) players[mainGameProperties.currentPlayer].x=tracks[0].map.width;
    if (players[mainGameProperties.currentPlayer].y>tracks[0].map.height) players[mainGameProperties.currentPlayer].y=tracks[0].map.height;
}