class Player {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
        this.username = undefined;
    }

    setUsername(username) {
        this.username = username;
    }
}

module.exports = Player;