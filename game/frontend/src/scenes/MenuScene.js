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
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, "logo").setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0);
        this.createNewRoomButton = new MenuButton(this, this.game.renderer.width / 2, this.game.renderer.height - 350, "play_button", CST.SCENES.LOBBY);
        this.joinRoomButton = new MenuButton(this, this.game.renderer.width / 2, this.game.renderer.height - 250, "join_button", CST.SCENES.JOIN);
        this.rankingButton = new MenuButton(this, this.game.renderer.width / 2, this.game.renderer.height - 150, "scoreboard_button", CST.SCENES.RANKING);
        this.spectateButton = new MenuButton(this, this.game.renderer.width / 2, this.game.renderer.height - 50, "activeGames_button", CST.SCENES.SPECTATORJOIN);
    }
}