class Player {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
        this.username = undefined;
    }
}

module.exports = Player;