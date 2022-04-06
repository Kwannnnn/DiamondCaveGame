import Trap from './Trap';

/**
 * SpikeTrap class in charge of managing individual spike traps.
 * 
 * A spike trap is created for every 3 in the tilemap indexes.
 */
export default class SpikeTrap  extends Trap {
    constructor(id, x, y, socket, sprite) {
        super(id, x, y, socket);

        this.sprite = sprite;
        this.startSpikeCycle();
    }

    // handle what happens when a player steps on the trap
    steppedOnSpikeTrap(player, lobbyId) {
        // make sure trap is on and player can even be hit
        if (this.active && !this.immunePlayers.includes(player) && this.enabled) {
            this.makePlayerInvulnerable(player);

            // emit so that damage taken is registered in the server
            this.socket.emit('hitByEnemy', {
                lobbyID: lobbyId,
                damage: 10,
            });
        }
    }

    // every x amount of time that spikes switch from dealing damage to not and vice versa
    startSpikeCycle() {
        if (this.enabled) {
            this.spikeCycle = setInterval(this.swapState.bind(this), 1000);
        }
    }

    swapState() {
        this.active = !this.active;
        this.updateStatus();
    }

    updateStatus() {
        if (this.active) {
            this.sprite.setTexture('spikeOn');
        } else {
            this.sprite.setTexture('spikeOff');
        }
    }

    enableTrap() {
        this.enabled = true;
        this.startSpikeCycle();
    }

    // disable trap and stop spike rotation
    disableTrap() {
        clearInterval(this.spikeCycle);
        this.enabled = false;
        this.active = false;
        this.updateStatus();
    }
}