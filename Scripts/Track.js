var tracks;

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