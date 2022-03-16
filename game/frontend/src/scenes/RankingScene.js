import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { Header } from '../components';

export default class RankingScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.RANKING
        });
    }

    init(data) {
        this.dataToDisplay = [];
        // this.dataToDisplay = data.ranklist;
    }

    preload() {
        // Retrieved from: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/gridtable/
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rankingScene'
        });
    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(0,0, 'title_bg').setOrigin(0).setDepth(0);

        var header = new Header(this, this.game.renderer.width / 2, this.game.renderer.height / 2, 'Top 10 runs');
        
        var gridTable = this.rankingScene.add.gridTable({
            x: this.game.renderer.width / 2,
            y: this.game.renderer.height / 2 + 190,
            width: this.game.renderer.width / 2.25,
            height: this.game.renderer.width / 5,
            scrollMode: 0, // 0 - vertical, 1 - horizontal
            background: this.setupBackground(),
            table: this.setupTable(),
            slider: this.setupSlider(),
            items: this.dataToDisplay // the array of data objects
        })
        .layout()
    }

    setupBackground() {
        return this.rankingScene.add.roundRectangle(0, 0, 20, 10, 10, CST.COLORS.RANKLIST_PRIMARY);
    }

    setupSlider() {
        return {
            track: this.rankingScene.add.roundRectangle(0, 0, 10, 10, 10, CST.COLORS.RANKLIST_SECONDARY),
            thumb: this.rankingScene.add.roundRectangle(0, 0, 0, 0, 13, CST.COLORS.RANKLIST_TERNARY),
        }
    }

    setupTable() {
        return {
            cellWidth: undefined, // if undefined, cell will take remaining 
            cellHeight: 30,
            columns: 1,
            mask: {
                padding: 2,
            }
        }
    }
}