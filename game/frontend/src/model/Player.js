import ControlledUnit from "./ControlledUnit";

export default class Player extends ControlledUnit {
    constructor(scene, x, y, username) {
        super(scene, x, y, 'player');
        this.setScale(0.14);

        this.scene = scene;
        this.username = username;
        this.setupPlayerMovement();

        // the ideal delay for the normal speed to begin with is 200
        this.delay = 200;
        // TODO: ???
        this.depth = 100;
    }

    update() {
        this.handlePlayerMovement();
    }

    /**
     * Initializes the allowed input keys that a client can use to
     * control the player object.
     */
    setupPlayerMovement() {
        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }, true, true);
    }

    /**
     * Updates the player positioning based on the keystrokes registered
     * from the client keyboard.
     */
    handlePlayerMovement() {
        let movementX = 0;
        let movementY = 0;

        if (this.scene.input.keyboard.checkDown(this.keys.left, this.delay)) {     
            this.anims.play('left', true);
            movementX = -32;
            this.orientation = 180;
        } else if (this.scene.input.keyboard.checkDown(this.keys.right, this.delay)) {
            this.anims.play('right', true);
            movementX = 32;
            this.orientation = 0;
        } else if (this.scene.input.keyboard.checkDown(this.keys.down, this.delay)) {
            this.anims.play('down', true);
            movementY = 32;
            this.orientation = 270;
        } else if (this.scene.input.keyboard.checkDown(this.keys.up, this.delay)) {
            this.anims.play('up', true);
            movementY = -32;
            this.orientation = 90;
        }

        // Check tile we are attempting to move to
        let tile = this.scene.layer.getTileAtWorldXY(this.x + movementX, this.y + movementY, true);

        if (tile && tile.index !== 2) {
            this.x += movementX;
            this.y += movementY;
            // this.setNamePosition(this.name, this.player);
        }

        if (movementX !== 0 || movementY !== 0) {
            this.handlePlayerMoved();
        }
    }

    /**
     * Fires an event on the socket for player movement, sending the new player
     * position.
     */
    handlePlayerMoved() {
        if (this.socket) {
            this.socket.emit('playerMove', {
                roomId: this.scene.lobbyID,
                x: this.x,
                y: this.y,
                orientation: this.orientation
            });
        }
    }

    setSocket(socket) {
        this.socket = socket;
    }
}