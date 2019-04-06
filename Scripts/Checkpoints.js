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

var track0Checkpoints = [[[427, 308],[277, 74]],
[[426, 307],[279, 77]],
[[606, 239],[445, 18]],
[[723, 175],[805, 5]],
[[808, 204],[1035, 43]],
[[830, 213],[1092, 151]],
[[797, 219],[1008, 263]],
[[697, 317],[911, 315]],
[[776, 418],[992, 382]],
[[798, 481],[1086, 482]],
[[788, 508],[1128, 583]],
[[782, 525],[928, 673]],
[[711, 530],[718, 670]],
[[598, 538],[554, 681]],
[[481, 543],[287, 679]],
[[364, 526],[159, 608]],
[[314, 485],[63, 498]],
[[303, 450],[28, 365]],
[[311, 387],[123, 258]],
[[355, 355],[211, 150]]
];

function initCheckpoints() {
    var checkpoints = new Array();
    var keyCheckpoints = new Array();
    for (let i=0; i<track0Checkpoints.length; i++) {
        var tempCPOI = new CheckpointsPointsClass(track0Checkpoints[i][0][0], track0Checkpoints[i][0][1]);
        var tempCPOI2 = new CheckpointsPointsClass(track0Checkpoints[i][1][0], track0Checkpoints[i][1][1]);
        var tempCheckpoint = new CheckpointsClass(tempCPOI, tempCPOI2);
        if (i%5==1) {
            tempCheckpoint.key = true; 
            keyCheckpoints.push(i);
        }
        checkpoints.push(tempCheckpoint);
    }
    tracks[0].checkpoints = checkpoints;
    tracks[0].keyCheckpoints = keyCheckpoints;
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
        ctx.moveTo(poly[0], poly[1]);
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
            if (players[0].currentCheckpoint > i) {
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

