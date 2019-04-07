var heldItem = {
    EMPTY: 0,
    MUSHROOM: 1
}

function boost() {
    if (players[mainGameProperties.currentPlayer].heldItem == heldItem.MUSHROOM) {
        players[mainGameProperties.currentPlayer].boostFrames = players[mainGameProperties.currentPlayer].kart.miniTurboFrames;
        players[mainGameProperties.currentPlayer].heldItem = heldItem.EMPTY;
        players[mainGameProperties.currentPlayer].currentSpeed = players[mainGameProperties.currentPlayer].currentSpeed * 
                                                                players[mainGameProperties.currentPlayer].kart.miniTurboBoost;
        var sfx = document.getElementById(players[mainGameProperties.currentPlayer].name + "-cry");
        sfx.play();
        sfx.volume = 0.5;
        var boost = document.getElementById("boost-sfx");
        boost.play();
        boost.volume = 0.5;
    }
}