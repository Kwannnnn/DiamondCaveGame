import { withinBeam } from '../helpers/LaserTrap';
import Trap from './Trap';

/**
 * Directions:
 * 
 * 0: UP
 * 1: RIGHT
 * 2: DOWN
 * 3: LEFT
 * 
 */
export default class LaserTrap extends Trap {
    constructor(id, x, y, direction, range, socket) {
        super(id, x, y, socket);

        this.direction = direction;
        this.range = range;

        this.fireCycle = null;
        this.laserSprites = [];

        this.startLaserCycle();
    }

    startLaserCycle() {
        this.fireCycle = setInterval(this.swapState.bind(this), 1000);
    }

    swapState() {
        this.active = !this.active;
        this.updateStatus();
    }

    steppedInLaser(player, lobbyID) {
        // Check that the laser is firing.

        if (!this.active) {
            return;
        }

        // Check that we are not immune for this trap
        if (this.immunePlayers.includes(player)) {
            return;
        }

        // Check that we are within the trap's beam
        if (!withinBeam(player, this)) {
            return;
        }

        this.makePlayerInvulnerable(player);
        this.socket.emit('hitByEnemy', {
            lobbyID: lobbyID,
            damage: 10,
        });
    }

    updateStatus() {
        for (const beam of this.laserSprites) {
            beam.visible = this.active;
        }
    }

    disableTrap() {
        clearInterval(this.fireCycle);
    }

    generateBeamSprites(scene) {
        switch (this.direction) {
            case 0:
                for (let i = 1; i <= this.range; i++) {
                    const laserbeam = scene.physics.add.sprite(this.x, this.y - i * 32, 'beam');
                    this.laserSprites.push(laserbeam);
                }
                break;
            case 1:
                for (let i = 1; i <= this.range; i++) {
                    const laserbeam = scene.physics.add.sprite(this.x + i * 32, this.y, 'beam');
                    this.laserSprites.push(laserbeam);
                }
                break;
            case 2:
                for (let i = 1; i <= this.range; i++) {
                    const laserbeam = scene.physics.add.sprite(this.x, this.y + i * 32, 'beam');
                    this.laserSprites.push(laserbeam);
                }
                break;
            case 3:
                for (let i = 1; i <= this.range; i++) {
                    const laserbeam = scene.physics.add.sprite(this.x - i * 32, this.y, 'beam');
                    this.laserSprites.push(laserbeam);
                }
                break;
        }
    }
}
