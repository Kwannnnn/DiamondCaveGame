class Room {
    constructor(id) {
        this.id = id;
        this.players = [],
        this.health = 100,
        this.spectators = [],
        this.gameState = {},
        this.gemsCollected=0;
    }
}

module.exports = Room;