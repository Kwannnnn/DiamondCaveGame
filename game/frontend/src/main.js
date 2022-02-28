/** @type {import("../typings/phaser")} */
import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import { LoadScene } from './scenes/LoadScene';
import { MenuScene } from './scenes/MenuScene' 

const config = {
    width: 1280,
    height: 720,
    scene: [
        LoadScene, MenuScene
    ],
    parent: "game",
    type: Phaser.AUTO,
    dom: {
        createContainer: true
    }
}

const game = new Phaser.Game(config);
// game.scene.add('titlescreen', TitleScreen);

// game.scene.start('titlescreen');

