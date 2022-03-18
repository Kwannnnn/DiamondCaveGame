import ControlledUnit from "./ControlledUnit";

export default class Spectator extends ControlledUnit {
    constructor(scene, x, y) {
        // TODO: figure out how to display an invisible sprite
        super(scene, x, y, 'gem');
        this.setScale(0);

        this.scene = scene;
        this.setupSpectatorMovement();
    }

    update() {
        this.handleSpectatorMovement();
    }

    /**
     * Initializes the allowed input keys that a client can use to
     * control the spectator object.
     */
    setupSpectatorMovement() {
        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }, true, true);
    }

    /**
     * Updates the spectator positioning based on the keystrokes registered
     * from the client keyboard.
     */
    handleSpectatorMovement() {
        let movementX = 0;
        let movementY = 0;

        if (this.keys.left.isDown) {     
            movementX = -8;
        } else if (this.keys.right.isDown) {
            movementX = 8;
        } else if (this.keys.down.isDown) {
            movementY = 8;
        } else if (this.keys.up.isDown) {
            movementY = -8;
        }

        // Check tile we are attempting to move to
        let tile = this.scene.layer.getTileAtWorldXY(this.x + movementX, this.y + movementY, true);

        if (tile && tile.index !== 2) {
            this.x += movementX;
            this.y += movementY;
        }
    }
}