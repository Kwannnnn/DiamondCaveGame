class Room {
    constructor(id) {
        this.id = id;
        this.players = [],
        this.health = 100,
        this.spectators = [],
        this.gameState = {}
    }
}

module.exports = Room;