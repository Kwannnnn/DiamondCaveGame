import { CST } from "../CST";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }

    init(data) {
        
    }

    preload() {
    

    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, "logo").setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0)
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height - 350, "play_button").setDepth(1);
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height - 250, "join_button").setDepth(1);
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height - 150, "options_button").setDepth(1);
    }
}