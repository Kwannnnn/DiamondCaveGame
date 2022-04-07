const map3 = require('../maps/map3.js');
const map2 = require('../maps/map2.js');
const map1 = require('../maps/map1.js');

class Room {
    constructor(id, io) {
        this.io = io;
        this.id = id;
        this.level = 1;
        this.players = [];
        this.health = 100;
        this.spectators = [];
        this.gameState = {};
        this.gemsCollected = 0;
        this.time = 0;
        this.currentMap = 0;
        this.maps = [map1, map2, map3];
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

    nextMap() {
        if (this.currentMap == this.maps.length - 1) {
            this.currentMap = 0;
        } else {
            this.currentMap ++;
        }
    }
}

module.exports = Room;