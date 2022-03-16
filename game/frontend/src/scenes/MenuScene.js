import Phaser from 'phaser';
import { CST } from "../utils/CST";
import { MenuButton } from '../components';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }

    preload() {
        this.load.image("back", "assets/arrow-left.png");
    }

    create() {
        const MARGIN_Y = 70;
        const START_Y = this.game.renderer.height - 320;
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, "logo").setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);
        this.createNewRoomButton = new MenuButton(this, this.game.renderer.width / 2, START_Y, "play_button", CST.SCENES.LOBBY);
        this.joinRoomButton = new MenuButton(this, this.game.renderer.width / 2, START_Y + MARGIN_Y, "join_button", CST.SCENES.JOIN);
        this.rankingButton = new MenuButton(this, this.game.renderer.width / 2, START_Y + 2 * MARGIN_Y, "scoreboard_button", CST.SCENES.RANKING);
        this.spectateButton = new MenuButton(this, this.game.renderer.width / 2, START_Y + 3 * MARGIN_Y, "activeGames_button", CST.SCENES.SPECTATORJOIN);
    }
}