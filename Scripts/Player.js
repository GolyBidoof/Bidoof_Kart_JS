var players;

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