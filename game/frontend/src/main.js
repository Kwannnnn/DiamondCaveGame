import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';

const config = {
    width: 1280,
    height: 720,
    parent: "game",
    type: Phaser.AUTO,
    dom: {
        createContainer: true
    }
}

const game = new Phaser.Game(config);
game.scene.add('titlescreen', TitleScreen);

game.scene.start('titlescreen');

