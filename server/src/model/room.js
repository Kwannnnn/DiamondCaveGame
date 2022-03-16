class Room {
    constructor(id) {
        this.id = id;
        this.players = [],
        this.spectators = [],
            this.gameState={}
    }
}

module.exports = Room;