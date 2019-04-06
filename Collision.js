function collision() {
    var pixelData = tracks[0].collisionContext.getImageData(Math.round(players[0].x), Math.round(players[0].y), 1, 1).data;

    if (pixelData[0] == 0 && pixelData[1] == 255 && pixelData[2] == 55) {
        //grass
        players[0].currentMaxSpeed = players[0].kart.maxSpeed * 0.3;
        tracks[0].currentCollision = collisionEnum.GRASS;
    } else if (pixelData[0] == 255 && pixelData[1] == 0 && pixelData[2] == 42) {
        //wall 
        players[0].currentMaxSpeed = players[0].kart.maxSpeed * -0.10;
        tracks[0].currentCollision = collisionEnum.WALL;
    } else {
        //road 
        players[0].currentMaxSpeed = players[0].kart.maxSpeed;
        tracks[0].currentCollision = collisionEnum.ROAD;
    }
}