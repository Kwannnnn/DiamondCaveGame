class Room {
    constructor(id, io) {
        this.io = io;
        this.id = id;
        this.level = 1;
        this.players = [],
        this.health = 100,
        this.spectators = [],
        this.gameState = {},
        this.gemsCollected = 0;
        this.time = 0;
    }

    startTime() {
        var timer = setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        // this.io.to(this.id).emit('current-time', this.time);
        this.time++;
    }
}

module.exports = Room;