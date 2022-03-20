export default class MenuButton extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} parentScene The Scene to which this MenuButton belongs
     * @param {number} x The horizontal position of this MenuButton in the world
     * @param {number} y The vertical position of this MenuButton in the world
     * @param {string | Phaser.Textures.Texture} texture The key, or instance of the Texture/Sprite this Button will use to render with
     * @param {string} targetScene The key of the target scene, this button forwards to, as stored in the CST.
     */
    constructor(parentScene, x, y, texture, targetScene) {
        super(parentScene, x, y, texture);
        
        parentScene.add.existing(this);
        
        this.setDepth(1)
            .setInteractive()
            .on('pointerdown', () => parentScene.scene.start(targetScene, {undefined}))
            .on('pointerover', () => this.setTint(0x30839f))
            .on('pointerout', () => this.clearTint());
    }
}