class Room {
    constructor(id) {
        this.id = id;
        this.level = 1;
        this.players = [],
        this.health = 100,
        this.spectators = [],
        this.gameState = {}
    }
}

module.exports = Room;