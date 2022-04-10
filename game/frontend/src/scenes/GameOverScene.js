import Phaser from 'phaser';
import { CST } from '../utils/CST';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAMEOVER
        });
    }

    preload() {
        this.load.image('game-over', 'assets/menu_images/game_over.png');
        this.load.image('go-menu', 'assets/menu_images/go_to_menu.png');
    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'game-over');
        const goBackBtn = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'go-menu').setInteractive();

        goBackBtn.on('pointerdown', () => {
            this.scene.pause();
            this.scene.start(CST.SCENES.MENU);
        });

        goBackBtn.on('pointerover', () => {
            goBackBtn.setTint(0x30839f);
        });

        goBackBtn.on('pointerout', () => {
            goBackBtn.clearTint();
        });
    }
}