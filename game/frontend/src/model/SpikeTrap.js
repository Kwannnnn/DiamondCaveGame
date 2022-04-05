// A SpikeTrap object will be spawned at every location that there is a 3 in the tileMap

let immunePlayers = []; // array of Player objects

export default class SpikeTrap {
    constructor(scene, x, y, lobbyId, trapId, socket) {
        // constructor variables
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.lobbyId = lobbyId;
        this.trapId = trapId;
        this.socket = socket;

        // initialize logic variables
        this.spikesOn = true;
        this.enabled = true;

        // start spikes up&down
        this.startSpikeCycle();
    }

    // handle what happens when a player steps on the trap
    steppedOnSpikeTrap(player, lobbyId) {
        // make sure trap is on and player can even be hit
        if (this.spikesOn && !immunePlayers.includes(player) && this.enabled) {
            this.damageCooldown(player);

            const spikeDamage = 10;

            // emit so that damage taken is registered in the server
            this.socket.emit('hitByEnemy', {
                lobbyID: lobbyId,
                damage: spikeDamage
            });
            console.log('spike dealt damage to player');
        }
    }

    // every x amount of time that spikes switch from dealing damage to not and vice versa
    startSpikeCycle() {
        if (this.enabled) {
            this.spikeCycle = setInterval(this.swapState.bind(this), 1000);
        }
    }

    // call this when getting hit to disable taking damage from this trap for the provided amount of time
    damageCooldown(player) {
        this.makePlayerImmune(player);

        // this makes the player vulnerable again after the given time
        setTimeout(this.removeImmunity, 100, player);
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
    }

    enableTrap() {
        this.enabled = true;
        this.startSpikeCycle();
    }

    // disable trap and stop spike rotation
    disableTrap() {
        clearInterval(this.spikeCycle);
        this.enabled = false;
        this.spikesOn = false;
        // update sprite method
    }

    // add Player object to array of immune players
    makePlayerImmune(player) {
        if (!immunePlayers.includes(player)) {
            immunePlayers.push(player);
        }
    }

    // if the given player is in the array of immune players, remove them
    removeImmunity(player) {
        // find player if they exist and remove them
        if (immunePlayers.includes(player)) {
            for (let i = 0; i < immunePlayers.length; i++) {
                if (immunePlayers[i] === player) {
                    immunePlayers.splice(i, 1);
                    console.log(`player ${player.username} made vulnerable again to spike trap ${this.trapId}`);
                }
            }
        }
    }
}