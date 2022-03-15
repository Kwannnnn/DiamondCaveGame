import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { Header } from '../components';

export default class RankingScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.RANKING
        })
    }

    preload() {

    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(0,0, 'title_bg').setOrigin(0).setDepth(0);

        var header = new Header(this, this.game.renderer.width / 2, this.game.renderer.height / 2, 'Top 10 runs');
    }
}