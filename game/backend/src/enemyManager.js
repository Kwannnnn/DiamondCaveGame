const collisionDamage = 10;

class EnemyManager {
    constructor(enemies, room) {
        this.room = room;
        this.enemies = enemies;
        //this.enemyTimer = setInterval(this.updateEnemyPositions(), 100);
        //TODO: Fix the refresh
    }

    updateEnemyPositions() {
        this.checkCollision()
    }

    checkCollision() {
        for (let player of this.room.players) {
            for (let enemy of this.enemies) {
                let xDiff = Math.abs(enemy.x - player.x);
                let yDiff = Math.abs(enemy.y - player.y);
                if (xDiff <= 1 && yDiff <= 1) {
                    player.socket.to(this.room.id).emit('reduceHealth', collisionDamage);
                }
            }
        }
    }

    /**
     * This method handles reducing the health for team
     */
    handleCollision(socket) {
        this.room.health -= damage;

        // Message is sent to all players in room to indicate health loss
        socket.to(this.room.id).emit('reduceHealth', collisionDamage);

        if (this.room.health <= 0) {
            socket.to(room.id).emit('gameOver');
            //this.handleGameOver(room);
            //TODO: Move the function from above into this class
        }
    }

    disableUpdate() {
        this.enemyTimer.clearTimeout();
    }
}

module.exports = EnemyManager;