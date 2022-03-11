class Room {
    constructor(id) {
        this.id = id;
        this.players = [],
        this.spectators = []
    }
}

module.exports = Room;