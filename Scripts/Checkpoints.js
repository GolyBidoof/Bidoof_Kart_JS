class CheckpointsClass {
    constructor(L, R) {
        this.L = L;
        this.R = R;
        this.key = false;
    }
}

class CheckpointsPointsClass {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

function initCheckpoints() {
    var checkpointsFullyGenerated = new Array();
    var keyCheckpoints = new Array();
    var newScript = document.createElement("script");
    newScript.setAttribute("type", "text/javascript");
    switch (tracks[0].name) {
        case "F8":
            var filename = "Tracks/CheckpointParams/Figure8.js";
            break;
        default:
            var filename = "Tracks/CheckpointParams/SampleTrack.js";
            break;
    }
    newScript.setAttribute("src", filename);
    document.getElementsByTagName("head")[0].appendChild(newScript);
    newScript.onload = () => {
        for (let i=0; i<checkpoints.length; i++) {
            var tempCPOI = new CheckpointsPointsClass(checkpoints[i][0][0], checkpoints[i][0][1]);
            var tempCPOI2 = new CheckpointsPointsClass(checkpoints[i][1][0], checkpoints[i][1][1]);
            var tempCheckpoint = new CheckpointsClass(tempCPOI, tempCPOI2);
            if (i%6==1) {
                tempCheckpoint.key = true; 
                keyCheckpoints.push(i);
            }
            checkpointsFullyGenerated.push(tempCheckpoint);
        }
        tracks[0].checkpoints = checkpointsFullyGenerated;
        tracks[0].keyCheckpoints = keyCheckpoints;
    }
}

function debugDrawCheckpoints() {
    for (let i=0; i<tracks[0].checkpoints.length; i++) {
        if (i!=tracks[0].checkpoints.length-1) {
            var poly = [tracks[0].checkpoints[i].L.x, tracks[0].checkpoints[i].L.y, tracks[0].checkpoints[i+1].L.x, tracks[0].checkpoints[i+1].L.y, tracks[0].checkpoints[i+1].R.x, tracks[0].checkpoints[i+1].R.y, tracks[0].checkpoints[i].R.x, tracks[0].checkpoints[i].R.y,];
        } else {
            var poly = [tracks[0].checkpoints[i].L.x, tracks[0].checkpoints[i].L.y, tracks[0].checkpoints[0].L.x, tracks[0].checkpoints[0].L.y, tracks[0].checkpoints[0].R.x, tracks[0].checkpoints[0].R.y, tracks[0].checkpoints[i].R.x, tracks[0].checkpoints[i].R.y,];
        }
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(poly[0] , poly[1]);
        for(item=2; item < poly.length-1; item+=2){
            ctx.lineTo( poly[item] , poly[item+1] )}
        ctx.closePath();
        ctx.fill();
    }
}

function checkIfInsideCheckpoints() {
    for (let i=0; i<tracks[0].checkpoints.length; i++) {
        if (i!=tracks[0].checkpoints.length-1) {
            var xCoords = [tracks[0].checkpoints[i].L.x, tracks[0].checkpoints[i+1].L.x, tracks[0].checkpoints[i+1].R.x, tracks[0].checkpoints[i].R.x];
            var yCoords = [tracks[0].checkpoints[i].L.y, tracks[0].checkpoints[i+1].L.y, tracks[0].checkpoints[i+1].R.y, tracks[0].checkpoints[i].R.y];
        } else {
            var xCoords = [tracks[0].checkpoints[i].L.x, tracks[0].checkpoints[0].L.x, tracks[0].checkpoints[0].R.x, tracks[0].checkpoints[i].R.x];
            var yCoords = [tracks[0].checkpoints[i].L.y, tracks[0].checkpoints[0].L.y, tracks[0].checkpoints[0].R.y, tracks[0].checkpoints[i].R.y];
        }
        var returnVal = pnpoly(4, xCoords, yCoords, players[0].x, players[0].y);
        if (returnVal==true) {
            if (tracks[0].switchingCollisions.includes(i) && tracks[0].switched==false) {
                tracks[0].switched = true;
                tracks[0].currentCollisionContext = 1 - tracks[0].currentCollisionContext;
            } else if (!tracks[0].switchingCollisions.includes(i) && tracks[0].switched==true) {
                tracks[0].switched = false;
            }
            if (players[0].currentCheckpoint == 0 && players[0].traversedKeyCheckpoints.length>1) {
                lapCount();
            }
            players[0].currentCheckpoint=i;
            if (tracks[0].checkpoints[i].key==true && players[0].countedThisKeyCheckpoint==false) {
                players[0].countedThisKeyCheckpoint = true;
                players[0].traversedKeyCheckpoints.push(i);
            } else if (tracks[0].checkpoints[i].key==false) {
                players[0].countedThisKeyCheckpoint = false;
            }
            break;
        }
    }
}

function lapCount() {
    var count = 0;
    for (let i=0; i<tracks[0].keyCheckpoints.length; i++) {
        var n = players[0].traversedKeyCheckpoints.includes(tracks[0].keyCheckpoints[i]);
        if (n) count++;
    }
    if (count==tracks[0].keyCheckpoints.length) {
        players[0].traversedKeyCheckpoints = [];
        if (mainGameProperties.currentLapTime<mainGameProperties.currentBestLapTime) 
            mainGameProperties.currentBestLapTime = mainGameProperties.currentLapTime;
        mainGameProperties.currentLapTime = 0;
        mainGameProperties.currentLap++;
        mainGameProperties.newLapTextFrame=1;
        var nextLap = document.getElementById("next-lap");
        nextLap.play();
    }
}

function pnpoly(nvert, vertx, verty, testx, testy)
{
  var i, j, c = 0;
  for (i = 0, j = nvert-1; i < nvert; j = i++) {
    if ( ((verty[i]>testy) != (verty[j]>testy)) &&
     (testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
       c = !c;
  }
  return c;
}

