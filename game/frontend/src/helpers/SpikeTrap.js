
// A SpikeTrap object will be spawned at every location that there is a 3 in the tileMap

let immunePlayers = []; // array of Player objects
//let scene, x, y, lobbyId, trapId, socket;

export default class SpikeTrap {
    constructor(scene, x, y, lobbyId, trapId, socket) {
        // constructor variables
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.lobbyId = lobbyId;
        this.trapId = trapId;
        this.socket = socket;

        console.log(trapId);
        console.log(this.trapId);

        setTimeout(this.disableTrap, 3000);

        // initialize logic variables
        this.spikesOn = true;
        this.enabled = true;

        // start spikes up&down
        this.startSpikeCycle();

        console.log(this);
    }

    // handle what happens when a player steps on the trap
    steppedOnSpikeTrap(player) {
        console.log(immunePlayers.length);

        // make sure trap is on and player can even be hit
        if (this.spikesOn && !immunePlayers.includes(player) && this.enabled) {
            this.damageCooldown(player);

            // emit so that damage taken is registered in the server
            this.socket.emit('hitByEnemy', {
                lobbyId: this.lobbyId,
                damage: 10
            });
            console.log('spike dealt damage to player');
        }
    }

    // every x amount of time that spikes switch from dealing damage to not and vice versa
    startSpikeCycle() {
        if (this.enabled) {
            console.log('spike cycle enabled')

            this.spikeCycle = setInterval(this.swapState, 2000, this.trapId);

        } else {
            console.log('trap cycle cant be enabled');
        }
    }

    // call this when getting hit to disable taking damage from this trap for the provided amount of time
    damageCooldown(player) {
        this.makePlayerImmune(player);

        // this makes the player vulnerable again after the given time
        setTimeout(this.removeImmunity, 1000, player);
    }

    getLocation() {
        return {
            x: this.x,
            y: this.y
        }
    }

    // invert the spikesOn variable
    swapState(trapId) {
        this.spikesOn = !this.spikesOn;
        console.log('spike with id '+ trapId + ' is now ' + this.spikesOn);
    }

    enableTrap() {
        this.enabled = true;
        this.startSpikeCycle();
    }

    // disable trap and stop spike rotation
    disableTrap() {
        console.log('disable called');
        clearInterval(this.spikeCycle);
        this.enabled = false;
        this.spikesOn = false;
    }

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
                    console.log(`player ${player} made vulnerable again to spike trap ${this.trapId}`);
                }
            }
        }
    }

    getState() {
        return this.spikesOn;
    }
}