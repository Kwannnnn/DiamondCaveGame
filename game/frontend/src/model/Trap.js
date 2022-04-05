export default class Trap {
    constructor(id, x, y, socket) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.socket = socket;

        this.immunePlayers = [];

        this.enabled = true;
        this.active = true;
    }

    makePlayerInvulnerable(player) {
        this.makePlayerImmune(player);

        setTimeout(this.removeImmunity.bind(this), 100, player);
    }

    // Add immunity to trap for player
    makePlayerImmune(player) {
        if (!this.immunePlayers.includes(player)) {
            this.immunePlayers.push(player);
        }
    }

    // Remove immunity to trap for player
    removeImmunity(player) {
        const index = this.immunePlayers.indexOf(player);

        if (index > -1) {
            this.immunePlayers.splice(index, 1);
        }
    }
}
