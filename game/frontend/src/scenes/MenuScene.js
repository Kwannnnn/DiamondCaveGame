import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { MenuButton } from '../components';

const SERVER_URL = 'http://localhost:3000';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }

    create() {
        if (this.socket === undefined) {
            this.connect();
        }
        
        const MARGIN_Y = 70;
        const START_Y = this.game.renderer.height - 320;

        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(this.game.renderer.width / 2, 0, 'title_bg').setOrigin(0.5, 0).setDepth(0);

        // This was meant to be for the dev tool
        // this.developerRoomButton = new MenuButton(this, this.game.renderer.width - 50, 50, 'developer_button', CST.SCENES.DEV, this.onSceneChange.bind(this));
        
        this.createNewRoomButton = new MenuButton(this, this.game.renderer.width / 2, START_Y, 'play_button', CST.SCENES.LOBBY, this.onSceneChange.bind(this));
        this.joinRoomButton = new MenuButton(this, this.game.renderer.width / 2, START_Y + MARGIN_Y, 'join_button', CST.SCENES.JOIN, this.onSceneChange.bind(this));
        this.rankingButton = new MenuButton(this, this.game.renderer.width / 2, START_Y + 2 * MARGIN_Y, 'scoreboard_button', CST.SCENES.RANKING, this.onGetRanking.bind(this));
        this.spectateButton = new MenuButton(this, this.game.renderer.width / 2, START_Y + 3 * MARGIN_Y, 'activeGames_button', CST.SCENES.SPECTATE, this.onSceneChange.bind(this));
    
        this.socket.on('rankList', (rankList) => {
            this.scene.pause();
            this.scene.start(CST.SCENES.RANKING, { socket: this.socket, rankList: rankList });
        });
    }

    /**
     * Connects the client to the server socket.
     */
    connect() {
        this.socket = io(SERVER_URL, { reconnection: false });
    }

    /**
     * Callback function passed to the menu buttons. Triggered on click of the
     * button.
     * @param {string} targetSceneKey the key of the target scene
     */
    onSceneChange(targetSceneKey) {
        this.scene.pause();
        this.scene.start(targetSceneKey, { socket: this.socket });
    }

    onGetRanking(targetSceneKey) {
        this.socket.emit('getRanking');
    }
}