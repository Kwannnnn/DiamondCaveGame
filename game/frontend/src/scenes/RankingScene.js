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
        // this.dataToDisplay = [{
        //     rank: 1,
        //     team: 'A1B2C3',
        //     player1: 'test1',
        //     player2: 'test2',
        //     score: '32767',
        // }, {
        //     rank: 2,
        //     team: '373737',
        //     player1: 'aaa',
        //     player2: 'bbb',
        //     score: '37',
        // }, {
        //     rank: 3,
        //     team: '000000',
        //     player1: 'Aaaaaaaaaaaaaaaaaaaa',
        //     player2: 'a',
        //     score: '1',
        // }];
        // this.dataToDisplay = data.ranklist;
        this.socket = data.socket;
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
        this.add.image(this.game.renderer.width / 2, 0, 'title_bg').setOrigin(0.5, 0).setDepth(0);

        this.backButton = this.add.sprite(50, 50, 'back').setDepth(1).setScale(2).setInteractive();
        this.backButton.on('pointerdown', () => this.goBack());
        this.backButton.on('pointerover', () => {
            this.backButton.setTint(0x30839f);
        });
        this.backButton.on('pointerout', () => {
            this.backButton.clearTint();
        });

        var header = new Header(this, this.game.renderer.width / 2, this.game.renderer.height / 2, 'Top 10 runs');
        
        this.backButton = this.add.sprite(50, 50, 'back').setDepth(1).setScale(2).setInteractive();
        this.backButton.on('pointerdown', () => this.goBack());
        this.backButton.on('pointerover', () => {
            this.backButton.setTint(0x30839f);
        });
        this.backButton.on('pointerout', () => {
            this.backButton.clearTint();
        });
        
        var gridTable = this.rankingScene.add.gridTable({
            x: this.game.renderer.width / 2,
            y: this.game.renderer.height / 2 + 3 * 90,
            width: this.game.renderer.width / 2.25,
            height: this.game.renderer.width / 5,
            scrollMode: 0, // 0 - vertical, 1 - horizontal
            background: this.setupBackground(),
            table: this.setupTable(),
            header: this.createTableItem(CST.COLORS.RANKLIST_SECONDARY),
            slider: this.setupSlider(),
            space: this.setupSpacing(),

            // A callback function that renders each table cell
            createCellContainerCallback: (cell, cellContainer) => this.populateCellContainer(cell, cellContainer),
            items: this.dataToDisplay // the array of data objects
        })
            .layout()

        this.handleSocketEvents();
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

    setupSpacing() {
        return {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
            table: 10,
            header: 10,
        }
    }

    /**
     * Creates a row in the ranking table with the following table fields:
     * - Rank, Team, Player 1, Player 2, Score
     */
    createTableItem(backgroundColor) {
        var background = this.rankingScene.add.roundRectangle(0, 0, 20, 20, 0, backgroundColor);
        var rank = this.rankingScene.add.BBCodeText(0, 0, 'Rank', { fixedWidth: 40, halign:'right', valign:'center' });
        var team = this.rankingScene.add.BBCodeText(0, 0, 'Team', { fixedWidth: 70, halign:'left', valign:'center' });
        var player1 = this.rankingScene.add.BBCodeText(0, 0, 'Player 1', { fixedWidth: 100, halign:'left', valign:'center' });
        var player2 = this.rankingScene.add.BBCodeText(0, 0, 'Player 2', { fixedWidth: 100, halign:'left', valign:'center' });
        var score = this.rankingScene.add.BBCodeText(0, 0, 'Score', { fixedWidth: 70, halign:'right', valign:'center' });

        return this.rankingScene.add.sizer({
            width: undefined,
            height: 30,
            orientation: 0,
            align: 'right'
        })
            .addBackground(background)
            .add(rank, 0, 'center', { left: 10, right: 20 }, false, 'rank')
            .add(team, 0, 'center', { right: 20 }, false, 'team')
            .add(player1, 0, 'center', { right: 20 }, false, 'player1')
            .add(player2, 0, 'center', { right: 20 }, false, 'player2')
            .add(score, 0, 'center', { right: 20 }, false, 'score');
    }

    populateCellContainer(cell, cellContainer) {
        var scene = cell.scene;
        var item = cell.item;
                    
        if (cellContainer === null) {
            cellContainer = this.createTableItem(CST.COLORS.RANKLIST_PRIMARY)
        }
    
        // Feed the container with the actual data
        cellContainer.getElement('rank').setText(item.rank);
        cellContainer.getElement('team').setText(item.team);
        cellContainer.getElement('player1').setText(item.player1);
        cellContainer.getElement('player2').setText(item.player2);
        cellContainer.getElement('score').setText(item.score);
        return cellContainer;
    }

    handleSocketEvents() {
        this.socket.on('rankList', (rankList) => {
            this.dataToDisplay = rankList;
        });
    }

    goBack() {
        if (this.socket !== undefined) this.socket.removeAllListeners();
        this.scene.stop();
        this.scene.run(CST.SCENES.MENU);
    }
}