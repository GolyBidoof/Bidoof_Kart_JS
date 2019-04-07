var heldItem = {
    EMPTY: 0,
    MUSHROOM: 1
}

function boost() {
    if (players[mainGameProperties.currentPlayer].heldItem == heldItem.MUSHROOM) {
        players[mainGameProperties.currentPlayer].boostFrames = 90;
        players[mainGameProperties.currentPlayer].heldItem = heldItem.EMPTY;
        players[mainGameProperties.currentPlayer].currentSpeed = players[mainGameProperties.currentPlayer].currentSpeed * 1.5;
        var bidoof = document.getElementById("bidoof-cry");
        bidoof.play();
        bidoof.volume = 0.5;
        var boost = document.getElementById("boost-sfx");
        boost.play();
        boost.volume = 0.5;
    }
}