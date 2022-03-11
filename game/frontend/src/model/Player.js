import ControlledUnit from "./ControlledUnit";

export default class Player extends ControlledUnit {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.setScale(0.14);

        this.scene = scene;

        // the ideal delay for the normal speed to begin with is 200
        this.delay = 200;
    }

    update() {
        this.handlePlayerMovement();
    }

    handlePlayerMovement() {
        
    }

    setSocket(socket) {
        this.socket = socket;
    }
}