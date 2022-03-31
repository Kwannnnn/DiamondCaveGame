class Room {
    constructor(id) {
        this.id = id;
        this.level = 1;
        this.players = [],
        this.health = 100,
        this.spectators = [],
        this.gameState = {},
        this.gemsCollected = 0,
        this.gameActive = false;
    }
}

module.exports = Room;