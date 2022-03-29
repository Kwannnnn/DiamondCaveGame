
// A SpikeTrap object will be spawned at every location that there is a 3 in the tileMap

export default class SpikeTrap {
    constructor(scene, x, y, lobbyId, players) {
        // constructor variables
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.lobbyId = lobbyId;
        this.players = players;

        // initialize logic variables
        this.immunePlayers = [];
        this.spikesOn = true;
        this.enabled = false;

        // start spikes up&down
        //this.startSpikeCycle();
    }

    // handle what happens when a player steps on the trap
    steppedOnSpikeTrap(player) {
        // make sure trap is on and player can even be hit
        if (this.spikesOn && !this.isPlayerImmune(player) && this.enabled) {
            console.log(this.invulnerableToSpikes);

            this.damageCooldown(player);

            // emit so that damage taken is registered in the server
            this.socket.emit('hitByEnemy', {
                lobbyId: this.lobbyId,
                damage: 10
            });
        }
    }

    // every x amount of time that spikes switch from dealing damage to not and vice versa
    startSpikeCycle() {
        if (this.enabled) {
            console.log('spike cycle enabled')
            // this.spikeCycle = this.scene.time.addEvent({
            //     delay: 2000,
            //     callback: this.swapState,
            //     callbackScope: this,
            //     loop: false
            // });
        }
    }

    // call this when getting hit to disable taking damage from this trap for the provided amount of time
    damageCooldown(player) {
        this.makePlayerImmune(player);

        // this makes it so that you cannot be hit by this trap again for the provided time period
        this.spikeDamage = this.scene.time.addEvent({
            delay: 5000,
            callback: this.removeImmunity(player),
            callbackScope: this,
            loop: false
        });
    }

    getLocation() {
        return {
            x: this.x,
            y: this.y
        }
    }

    // invert the spikesOn variable
    swapState() {
        this.spikesOn = !this.spikesOn;
        console.log('state swapped, spike trap: ' + this.spikesOn);
    }

    enableTrap() {
        this.enabled = true;
        this.startSpikeCycle();
    }

    disableTrap() {
        this.spikeCycle.destroy();
        this.enabled = false
    }

    makePlayerImmune(player) {
        this.immunePlayers.add(player);
    }

    removeImmunity(player) {
        this.immunePlayers.remove(player);
    }

    isPlayerImmune(player) {
        return !!this.immunePlayers.includes(player);
    }
}