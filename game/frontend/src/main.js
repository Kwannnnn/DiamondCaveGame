import Phaser from 'phaser';

import {
    LobbyScene,
    GameScene,
    LoadScene,
    JoinScene,
    MenuScene,
    PerksScene,
    ActiveGamesScene,
    SpectatorJoinScene,
    RankingScene,
    ChatScene
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
        PerksScene,
        LobbyScene,
        JoinScene,
        ActiveGamesScene,
        SpectatorJoinScene,
        RankingScene,
        ChatScene
    ],
    parent: 'game',
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    dom: {
        createContainer: true
    }
}

const game = new Phaser.Game(config);

