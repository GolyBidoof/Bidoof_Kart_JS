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

var collisionEnum = {
    ROAD: 0,
    GRASS: 1,
    WALL: 2
}

var players;
var karts;
var tracks;

class PlayerClass {
    constructor(image, id, kart) {
        this.image = image;
        this.id = id;
        this.x = 0;
        this.y = 0;   
        this.currentSpeed = 0;
        this.currentDirection = 0;
        this.currentBoost = 0;
        this.keyPress = 0;
        this.kart = kart;
        this.currentMaxSpeed = kart.maxSpeed;
        this.currentCheckpoint = 0;
        this.traversedKeyCheckpoints = [];
        this.countedThisKeyCheckpoint = false;
    }
}

class KartClass {
    constructor(maxSpeed, acc, dec, handling) {
        this.maxSpeed = maxSpeed;
        this.acc = acc;
        this.dec = dec;
        this.handling = handling;
    }
}

class TrackClass {
    constructor(map, collision) {
        this.map = map;
        this.collisionContext = collision;
        this.currentCollision = collisionEnum.ROAD;
        this.checkpoints = [];
        this.keyCheckpoints = [];
    }
}

function initializePlayersAndKarts() {
    players = new Array();
    karts = new Array();
    tracks = new Array();

    //Kart 1:
    var tempKart = new KartClass(0.25, 1/70, 1/120, 1/8);
    karts.push(tempKart);

    //Player 1:
    var tempPlayer = new PlayerClass(imagesToLoad[1].image, 0, karts[0]);
    tempPlayer.x = 330;
    tempPlayer.y = 230;
    tempPlayer.currentDirection = 135;
    players.push(tempPlayer);

    //Track 1:
    var tempTrack = new TrackClass(imagesToLoad[0], createCollisionContext());
    tracks.push(tempTrack);
}

function createCollisionContext() {
    var collisionCanvas = document.createElement('canvas');
    collisionCanvas.width = imagesToLoad[2].image.width;
    collisionCanvas.height = imagesToLoad[2].image.height;
    var collisionContext = collisionCanvas.getContext('2d');
    collisionContext.drawImage(imagesToLoad[2].image, 0, 0);
    return collisionContext
}