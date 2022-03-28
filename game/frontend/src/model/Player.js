import ControlledUnit from './ControlledUnit';

export default class Player extends ControlledUnit {
    constructor(scene, x, y, username, perk) {
        super(scene, x, y, 'player');
        this.setScale(0.14);

        this.scene = scene;
        this.username = username;
        this.setupPlayerMovement();
        this.setupAnimations();
        this.nameLabel = this.scene.add.text(x - 5, y - 10, this.username).setDepth(1);
        this.setNamePosition();

        // Change spike trap variable
        this.invulnerableToSpikes = false;
        this.spikeTrapsOn = false;
        this.trapUpdate = this.scene.time.addEvent({
            delay: 2000,
            callback: this.updateSpikeTraps,
            callbackScope: this,
            loop: true
        });

        // the ideal delay for the normal speed to begin with is 200
        this.delay = 200;

        // Check if perk is applied to the room
        if (perk) {
            console.log(perk + ' IS USED')
            // Check which perk is applied
            switch (perk) {
                case 'MovementSpeed':
                    this.increaseSpeed();
                    break;

                default:
                    console.log('no perks for player ' + username);

            }
        }
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
        }, false, true);
    }

    setupAnimations() {
        const animationKeys = ['up', 'down', 'right', 'left'];
        for (const [index, key] of animationKeys.entries()) {
            this.scene.anims.create({
                key: key,
                frames: [ { key: 'player', frame: index } ],
                frameRate: 20
            });
        }
    }

    setNamePosition() {
        this.nameLabel.x = this.x - 20;
        this.nameLabel.y = this.y - 40;
    }

    move(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.setNamePosition();

        switch (this.orientation) {
            case 0: 
                this.anims.play('right', true);
                break;
            case 90:
                this.anims.play('up', true);
                break;
            case 180:
                this.anims.play('left', true);
                break;
            default:
                this.anims.play('down', true);
                break;
        }
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
            this.setNamePosition();
        }

        // LASER TRAP
        if (tile && tile.index == 3) {
            // Call damage player method
            // Or call trap object
            console.log('You walked on a laser trap');
        }

        // SPIKE TRAP
        if (tile && tile.index == 4) {
            console.log('You walked on a spike trap');
            if (this.spikeTrapsOn && !invulnerableToSpikes) {
                //take damage
                this.takeSpikeDamage;
                console.log('spike trap active, take damage');
                this.invulnerableToSpikeDamage = this.scene.time.addEvent({
                    delay: 1000,
                    callback: this.updateInvulnerableToSpikes,
                    callbackScope: this,
                    loop: false
                });
            }
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

    /**
    * this is a perk for increasing the movement speed
    */
    increaseSpeed() {
        this.delay = this.delay * 7 / 10;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    takeSpikeDamage() {
        HUD.changeHealth(-10);
    }

    updateSpikeTraps() {
        this.spikeTrapsOn = !this.spikeTrapsOn;
    }

    updateInvulnerableToSpikes() {
        this.invulnerableToSpikes = !this.invulnerableToSpikes;
    }
}