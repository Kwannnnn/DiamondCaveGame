import Phaser from 'phaser';
import LobbyScene from './scenes/MenuLobbyScene';
import GameScene from './scenes/Game';
import LoadScene from './scenes/LoadScene';
import JoinScene from './scenes/MenuJoinScene';
import MenuScene from './scenes/MenuScene';
import ActiveGamesScene from './scenes/ActiveGames'
import SpectatorJoinScene from './scenes/SpectatorJoinScene'

const config = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    scene: [LoadScene, MenuScene, GameScene, LobbyScene, JoinScene, ActiveGamesScene, SpectatorJoinScene],
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

