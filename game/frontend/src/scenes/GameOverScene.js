import Phaser from 'phaser';
import { CST } from '../utils/CST';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAMEOVER
        });
    }

    preload() {

    }

    create() {
        this.add.text(300, 300, 'Game Over');

        this.add.text(500, 300).setInteractive().on('pointerdown', () => {
            this.scene.pause();
            this.scene.start(CST.SCENES.MENU);
        })
    }
}