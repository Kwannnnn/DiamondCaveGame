import Phaser from 'phaser';
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
        this.lobby = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - 350, "play_button").setDepth(1).setInteractive();
        this.join = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - 250, "join_button").setDepth(1).setInteractive();
        this.options = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - 150, "options_button").setDepth(1).setInteractive();

        this.join.on('pointerdown', () => {this.scene.start(CST.SCENES.JOIN)});
        this.join.on('pointerover', () => {this.join.setTint(0x30839f)});
        this.join.on('pointerout', () => {this.join.clearTint()});

        this.lobby.on('pointerdown', () => {this.scene.start(CST.SCENES.LOBBY)});
        this.lobby.on('pointerover', () => {this.lobby.setTint(0x30839f)});
        this.lobby.on('pointerout', () => {this.lobby.clearTint()});
    }
}