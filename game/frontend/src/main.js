import Phaser from 'phaser';
import {
    LobbyScene,
    GameScene,
    LoadScene,
    JoinScene,
    MenuScene,
    ActiveGamesScene,
    SpectatorJoinScene,
    RankingScene
} from './scenes';

const config = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    scene: [
        LoadScene,
        MenuScene,
        GameScene,
        LobbyScene,
        JoinScene,
        ActiveGamesScene,
        SpectatorJoinScene,
        RankingScene
    ],
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

