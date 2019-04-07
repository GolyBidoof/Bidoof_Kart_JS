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

var heldItem = {
    EMPTY: 0,
    MUSHROOM: 1
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
        this.heldItem = heldItem.MUSHROOM;
        this.boostFrames = 0;
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
    constructor(map, name, collision, startingPosition, startingDirection, currentCollisionContext, switchingCollisions) {
        this.map = map;
        this.name = name;
        this.collisionContext = collision;
        this.currentCollisionContext = currentCollisionContext;
        this.currentCollision = collisionEnum.ROAD;
        this.checkpoints = [];
        this.keyCheckpoints = [];
        this.startingPosition = startingPosition;
        this.startingDirection = startingDirection;
        this.switchingCollisions = switchingCollisions;
        this.switched = false;
    }
}

function initializePlayersAndKarts() {
    players = new Array();
    karts = new Array();
    tracks = new Array();

    //Kart 1:
    var tempKart = new KartClass(0.4, 1/1000, 1/120, 1/12);
    karts.push(tempKart);

    //Player 1:
    var tempPlayer = new PlayerClass(imagesToLoad[1].image, 0, karts[0]);
    players.push(tempPlayer);

    //Figure 8:
    var tempTrack = new TrackClass(imagesToLoad[0], "F8", createCollisionContext(), [2352,1467], 90, 1, [6, 16]);
    tracks.push(tempTrack);
    initCheckpoints();

    tempPlayer.x = tracks[0].startingPosition[0];
    tempPlayer.y = tracks[0].startingPosition[1];
    tempPlayer.currentDirection = tracks[0].startingDirection;
    //Temp map:
    //var tempTrack = new TrackClass(imagesToLoad[0], "Temp", createCollisionContext(), [330,230],135, 0, null);
    //tracks.push(tempTrack);
}