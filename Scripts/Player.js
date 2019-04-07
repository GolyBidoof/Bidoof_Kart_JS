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
    var bidoofKart = new KartClass(0.4, 1/1000, 1/120, 1/12);
    var wobbuffetKart = new KartClass(0.45, 1/2000, 1/120, 1/20);
    var ludicoloKart = new KartClass(0.34, 1/50, 1/10, 1/8);
    var corpishKart = new KartClass(0.36, 1/100, 1/20, 1/10);
    var probopassKart = new KartClass(0.5, 1/3000, 1/120, 1/30);
    var stunfiskKart = new KartClass(0.32, 1/5, 1/10, 1/5);
    karts.push(bidoofKart);
    karts.push(wobbuffetKart);
    karts.push(ludicoloKart);
    karts.push(corpishKart);
    karts.push(probopassKart);
    karts.push(stunfiskKart);

    //Player 1:
    var tempPlayer = new PlayerClass(imagesToLoad[1].image, 0, karts[0]);
    players.push(tempPlayer);
    for (let i=0; i<5; i++) {
        var tempPlayer = new PlayerClass(imagesToLoad[9+i].image, i+1, karts[i+1]);

        players.push(tempPlayer);
    }

    //Figure 8:
    var tempTrack = new TrackClass(imagesToLoad[0], "F8", createCollisionContext(), [2352,1467], 90, 1, [6, 16]);
    tracks.push(tempTrack);
    initCheckpoints();

    for (let i=0; i<players.length; i++) {
        players[i].x = tracks[0].startingPosition[0];
        players[i].y = tracks[0].startingPosition[1];
        players[i].currentDirection = tracks[0].startingDirection;
    }
    
    //Temp map:
    //var tempTrack = new TrackClass(imagesToLoad[0], "Temp", createCollisionContext(), [330,230],135, 0, null);
    //tracks.push(tempTrack);
}