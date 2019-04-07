var heldItem = {
    EMPTY: 0,
    MUSHROOM: 1
}

function boost() {
    if (players[0].heldItem == heldItem.MUSHROOM) {
        players[0].boostFrames = 90;
        players[0].heldItem = heldItem.EMPTY;
        players[0].currentSpeed = players[0].currentSpeed * 1.5;
        var bidoof = document.getElementById("bidoof-cry");
        bidoof.play();
        bidoof.volume = 0.5;
        var boost = document.getElementById("boost-sfx");
        boost.play();
        boost.volume = 0.5;
    }
}