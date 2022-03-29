class Room {
    constructor(id, io) {
        this.io = io;
        this.id = id;
        this.level = 1;
        this.players = [];
        this.health = 100;
        this.spectators = [];
        this.gameState = {};
        this.totalScore = 0;
        this.time = 0;
    }

    startTime(onUpdate) {
        this.timer = setInterval((() => {
            this.time++;
            onUpdate(this.id, this.time);
        }).bind(this), 1000);
    }

    stopTime() {
        clearInterval(this.timer);
    }

    movePlayer(playerId, newX, newY, newOrientation) {
        // TODO: validate position
        const player = this.players.get(playerId);
        player.x = newX;
        player.y = newY;
    }
}

module.exports = Room;