export default class Header extends Phaser.GameObjects.Text {
    /**
     * @param {Phaser.Scene} parentScene The Scene to which this Header belongs
     * @param {number} x The horizontal position of this Header on the canvas
     * @param {number} y The vertical position of this Header on the canvas
     * @param {string} text The text this Header will display
     */
    constructor(parentScene, x, y, text) {
        super(parentScene, x, y, text, {
            color: '#FFFFFF',
            fontSize: 50
        });
            
        parentScene.add.existing(this);
            
        this.setOrigin(0.5);
    }
}