var directionEnum = {
    UP: 1,
    UPRIGHT: 2,
    RIGHT: 3,
    DOWNRIGHT: 4,
    DOWN: 5,
    DOWNLEFT: 6,
    LEFT: 7,
    UPLEFT: 8
}

var map = {32: false, //spacebar
    37: false, //left
    38: false, //up
    39: false, //right
    40: false //down
};

function resetKey(e) {
    if (e.keyCode in map) {
        map[e.keyCode] = false;
    }
    CheckWhichOnesAreClicked();
}

function CheckWhichOnesAreClicked() {
    var amntOfClicked = 0;
    if (map[32]) if(mainGameProperties.countdownClock < 0) boost();
    if (map[37]) amntOfClicked++;
    if (map[38]) amntOfClicked++;
    if (map[39]) amntOfClicked++;
    if (map[40]) amntOfClicked++;
    if (amntOfClicked>2) {
        players[mainGameProperties.currentPlayer].keyPress = 0;
        return;
    }

    if (map[37] && map[38] ) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.UPLEFT;
    }
    else if (map[38] && map[39]) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.UPRIGHT;
    }
    else if (map[40] && map[37]) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.DOWNLEFT;
    }
    else if (map[40] && map[39]) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.DOWNRIGHT;
    }
    else if (map[38]) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.UP;
    }
    else if (map[37]) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.LEFT;
    }
    else if (map[39]) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.RIGHT;
    }
    else if (map[40]) {
        players[mainGameProperties.currentPlayer].keyPress = directionEnum.DOWN;
    } 
    else {
        players[mainGameProperties.currentPlayer].keyPress = 0;
    }
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode in map) {
        map[e.keyCode] = true;
    }   
    CheckWhichOnesAreClicked();
}