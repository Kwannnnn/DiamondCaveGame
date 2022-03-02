import Phaser from 'phaser';
import JoinScene from './scenes/MenuJoinScene';
import GameScreen from './scenes/Game';
import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import LobbyScene from './scenes/LobbyScene';

const config = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    scene: [LoadScene, MenuScene, JoinScene, GameScreen, LobbyScene],
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

