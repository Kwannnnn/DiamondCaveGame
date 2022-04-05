import Phaser from 'phaser';

import {
    LobbyScene,
    GameScene,
    LoadScene,
    JoinScene,
    MenuScene,
    PerksScene,
    //ActiveGamesScene,
    SpectatorJoinScene,
    RankingScene,
    ChatScene,
    DeveloperScene,
    HUD,
    GameOverScene
} from './scenes';

let WIDTH = window.screen.availWidth;
let HEIGHT = window.screen.availHeight;

const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WIDTH,
        height: HEIGHT
    },
    scene: [
        LoadScene,
        MenuScene,
        GameScene,
        PerksScene,
        LobbyScene,
        JoinScene,
        //ActiveGamesScene,
        SpectatorJoinScene,
        RankingScene,
        DeveloperScene,
        GameOverScene
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

game.events.on('hidden', function () {
    console.log('hidden');
}, this);

game.events.on('visible', function () {
    console.log('visible');
}, this);
