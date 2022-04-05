const collisionDamage = 10; // How much health to remove on collision
const movementDistance = 1; // How far to move every update
const updateFrequency = 100; // How often to update enemy positions and check for collision (ms)

class EnemyManager {
    constructor(enemies, room, io, manager) {
        this.room = room;
        this.enemies = enemies;
        this.io = io;
        this.manager = manager;
        this.enemyTimer = setInterval(this.updateEnemyPositions.bind(this), updateFrequency);
    }

    updateEnemyPositions() {
        this.enemies.forEach(e => this.moveEnemy(e));
        this.checkCollision();
    }

    moveEnemy(enemy) {
        if (enemy.targetIndex === undefined || enemy.targetIndex === enemy.path.length) enemy.targetIndex = 0;
        if (enemy.x === undefined) enemy.x = enemy.start.x;
        if (enemy.y === undefined) enemy.y = enemy.start.y;
        
        if  (enemy.x === enemy.path[enemy.targetIndex].x && enemy.y === enemy.path[enemy.targetIndex].y) enemy.targetIndex++;
        else {
            if (enemy.x > enemy.path[enemy.targetIndex].x) enemy.x -= movementDistance;
            else if (enemy.x < enemy.path[enemy.targetIndex].x) enemy.x += movementDistance;
            if (enemy.y > enemy.path[enemy.targetIndex].y) enemy.y -= movementDistance;
            else if (enemy.y < enemy.path[enemy.targetIndex].y) enemy.y += movementDistance;
            
            const updateData = {
                enemyId: enemy.enemyId,
                x: enemy.x,
                y: enemy.y
            }
            
            this.io.to(this.room.id).emit('enemyMoved', updateData);
        }
    }

    checkCollision() {
        for (let player of this.room.players) {
            for (let enemy of this.enemies) {
                let xDiff = Math.abs(enemy.x - player.x);
                let yDiff = Math.abs(enemy.y - player.y);
                if (xDiff <= 25 && yDiff <= 25) { //TODO: Figure out collision distance
                    this.io.to(this.room.id).emit('reduceHealth', collisionDamage);
                }
            }
        }

        if (this.room.health <= 0) {
            socket.to(room.id).emit('gameOver');
            this.manager.handleGameOver(room);
        }
    }

    disableUpdate() {
        clearInterval(this.enemyTimer); //FIXME: Doesn't work after switching maps, causing a crash on leave
    }
}

module.exports = EnemyManager;