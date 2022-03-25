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
    ChatScene,
    DeveloperScene,
} from './scenes';

const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = 720 // any height you want
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT

const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
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
        ChatScene,
        DeveloperScene,
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
