import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import GameScreen from './scenes/Game';

const config = {
    width: 1280,
    height: 720,
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
game.scene.add('titlescreen', TitleScreen);
game.scene.add('game', GameScreen);

game.scene.start('game');

