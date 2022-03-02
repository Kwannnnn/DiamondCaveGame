import Phaser from 'phaser';
import JoinScene from './scenes/MenuJoinScene';
import GameScreen from './scenes/Game';
import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';

const config = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    scene: [LoadScene, MenuScene, GameScreen, JoinScene],
    parent: "game",
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    },
    dom: {
        createContainer: true
    }
}

const game = new Phaser.Game(config);

game.scene.start();