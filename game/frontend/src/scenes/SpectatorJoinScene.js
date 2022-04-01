import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { usernameForm } from '../components/UsernameTextField'

// const usernameForm = '<label class="custom-field one">\n' +
//     '  <input type="text" name="username" placeholder="Enter your username"/>';
let listingEntries = [];
let listingButtons = [];
export default class SpectatorJoinScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.SPECTATE
        });
    }

    init(data) {
        this.events.on('shutdown', () => {
            if (this.socket !== undefined) this.socket.removeAllListeners();
        });

        // dummy data. Uncomment and copy/paste to test scrolling
        // also comment line 95
        // this.dataToDisplay = [{
        //     roomId: 1,
        //     playerIds: ['123', '234'],
        //     gameActive: true
        // }]

        this.cellId = 0;
        this.socket = data.socket;
    }

    preload() {
        // Retrieved from: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/gridtable/
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'spectatorJoinScene'
        });
    }

    create() {
        // set background image and logo
        this.logo = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(this.game.renderer.width / 2, 0, 'title_bg').setOrigin(0.5, 0).setDepth(0);

        // create back button
        this.backButton = this.add.sprite(50, 50, 'back').setDepth(1).setScale(2).setInteractive();

        this.backButton.on('pointerdown', () => this.goBack());
        this.backButton.on('pointerover', () => {
            this.backButton.setTint(0x30839f);
        });
        this.backButton.on('pointerout', () => {
            this.backButton.clearTint();
        });

        // username form and connect button
        this.usernameForm = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 350).createFromHTML(usernameForm);
        this.actionButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 100, 'Connect', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();

        this.actionButton.on('pointerdown', () => this.connect());
        this.actionButton.on('pointerover', () => {
            this.actionButton.setTint(0x30839f);
        });
        this.actionButton.on('pointerout', () => {
            this.actionButton.clearTint();
        });

        this.events.on('shutdown', () => {
            if (this.socket !== undefined) this.socket.removeAllListeners();
        });
    }

    connect() {
        this.username = this.usernameForm.getChildByName('username').value;
        this.socket.emit('setUsername', this.username);
        this.socket.emit('getCurrentGames');
        this.listenToEvents();
    }

    listenToEvents() {
        this.socket.on('connect_error', () => {
            this.message.setText('Could not connect to server');
        });
        this.socket.on('connect', () => {
            console.log('Connection was successful');
        });
        this.socket.emit('getCurrentGames');

        this.socket.on('currentGames', (payload) => {
            console.log(payload);

            let games = [];
            for (let game of payload) if (game.gameActive) games.push(game);

            this.dataToDisplay = games;

            this.showCurrentGames();

            // this.showCurrentGames(games);
        });

        this.socket.on('runGameScene', (roomId, gameState) => {
            console.log(roomId);
            console.log(gameState);
            this.scene.start(CST.SCENES.GAME, {
                world: 1,
                stage: 1,
                socket: this.socket,
                username: this.username,
                lobbyID: roomId,
                initialGameState: gameState
            });
        });
    }

    showCurrentGames() {
        this.logo.destroy();
        this.usernameForm.destroy();
        this.actionButton.destroy();
        this.header = this.add.text(this.game.renderer.width / 2, 100, 'Active games', {
            color: '#FFFFFF',
            fontSize: 50
        }).setOrigin(0.5);

        this.renderGridTable();
    }

    renderGridTable() {
        // create active games table
        var gridTable = this.spectatorJoinScene.add.gridTable({
            x: this.game.renderer.width / 2,
            y: this.game.renderer.height / 2,
            width: this.game.renderer.width * 0.75,
            height: this.game.renderer.width / 3,
            scrollMode: 0, // 0 - vertical, 1 - horizontal
            background: this.setupBackground(),
            table: this.setupTable(),
            header: this.createTableItem(CST.COLORS.ACTIVEGAMES_LIST_SECONDARY),
            slider: this.setupSlider(),
            space: this.setupSpacing(),

            // A callback function that renders each table cell
            createCellContainerCallback: (cell, cellContainer) => this.populateCellContainer(cell, cellContainer),
            items: this.dataToDisplay // the array of data objects
        })
            .layout()
    }

    // helper method for renderGridTable()
    setupBackground() {
        return this.spectatorJoinScene.add.roundRectangle(0, 0, 20, 10, 10, CST.COLORS.ACTIVEGAMES_LIST_PRIMARY);
    }

    // helper method for renderGridTable()
    setupSlider() {
        return {
            track: this.spectatorJoinScene.add.roundRectangle(0, 0, 10, 10, 10, CST.COLORS.ACTIVEGAMES_LIST_SECONDARY),
            thumb: this.spectatorJoinScene.add.roundRectangle(0, 0, 0, 0, 13, CST.COLORS.ACTIVEGAMES_LIST_TERNARY),
        }
    }

    // helper method for renderGridTable()
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

    // helper method for renderGridTable()
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
        var background = this.spectatorJoinScene.add.roundRectangle(0, 0, 20, 20, 0, backgroundColor);
        var id = this.spectatorJoinScene.add.BBCodeText(0, 0, 'ID', { fixedWidth: 40, halign: 'left', valign: 'center' });
        var team = this.spectatorJoinScene.add.BBCodeText(0, 0, 'Team', { fixedWidth: 70, halign: 'left', valign: 'center' });
        var player1 = this.spectatorJoinScene.add.BBCodeText(0, 0, 'Player 1', { fixedWidth: 140, halign: 'left', valign: 'center' });
        var player2 = this.spectatorJoinScene.add.BBCodeText(0, 0, 'Player 2', { fixedWidth: 140, halign: 'left', valign: 'center' });
        var spectate = this.spectatorJoinScene.add.BBCodeText(0, 0, 'Spectate', { fixedWidth: 100, halign: 'right', valign: 'center' });

        return this.spectatorJoinScene.add.sizer({
            width: undefined,
            height: 30,
            orientation: 0,
            align: 'right'
        })
            .addBackground(background)
            .add(id, 0, 'center', { left: 10, right: 20 }, false, 'id')
            .add(team, 0, 'center', { right: 20 }, false, 'team')
            .add(player1, 0, 'center', { right: 20 }, false, 'player1')
            .add(player2, 0, 'center', { right: 20 }, false, 'player2')
            .add(spectate, 0, 'center', { right: 20 }, false, 'spectate');
    }

    // helper method for renderGridTable()
    populateCellContainer(cell, cellContainer) {
        var item = cell.item;

        if (cellContainer === null) {
            cellContainer = this.createTableItem(CST.COLORS.ACTIVEGAMES_LIST_PRIMARY)
        }

        // Feed the container with the actual data
        cellContainer.getElement('id').setText(this.cellId++);
        cellContainer.getElement('team').setText(item.roomId);
        cellContainer.getElement('player1').setText(item.playerIds[0]);
        cellContainer.getElement('player2').setText(item.playerIds[1] ? item.playerIds[1] : '');

        // spectate button creation
        let spectateCellButton = cellContainer.getElement('spectate').setText('spectate').setInteractive();
        spectateCellButton.on('pointerdown', () => this.socket.emit('joinRoomAsSpectator', item.roomId));
        spectateCellButton.on('pointerover', () => {
            spectateCellButton.setTint(0x30839f);
        });
        spectateCellButton.on('pointerout', () => {
            spectateCellButton.clearTint();
        });

        return cellContainer;
    }

    // showCurrentGames(payload) {
    //     this.logo.destroy();
    //     this.usernameForm.destroy();
    //     this.actionButton.destroy();
    //     this.header = this.add.text(this.game.renderer.width / 2, 100, 'All active games (page 1): ', {
    //         color: '#FFFFFF',
    //         fontSize: 50
    //     }).setOrigin(0.5);

    //     this.renderGameList(payload.slice(0, 8));

    //     let pageCount = payload.length / 8; //Each page can hold 8 entries with current text settings
    //     if (pageCount > 18) pageCount = 18; //TODO: Currently limiting the pages to 18 because anything more overflows the screen. Need a better solution
    //     let segments = this.game.renderer.width / pageCount;

    //     // Display a page selector
    //     for (let i = 0; i <= pageCount; i++) {
    //         /*
    //             TODO: The start position is a constant that should instead be positioning about center.
    //             Currently this only looks good for 4-10 pages
    //         */
    //         const pageButton = this.add.text(20 + (i * segments), this.game.renderer.height - 75, i + 1, { 
    //             color: '#FFFFFF',
    //             fontSize: 40
    //         }).setOrigin(0.5).setInteractive();

    //         pageButton.on('pointerdown', () => {
    //             this.header.setText('All active games (page ' + (i + 1) + '): ');
    //             this.renderGameList(payload.slice(i * 8, i * 8 + 8));
    //         });
    //         pageButton.on('pointerover', () => {
    //             pageButton.setTint(0x30839f);
    //         });
    //         pageButton.on('pointerout', () => {
    //             pageButton.clearTint();
    //         });
    //     }
    // }

    // renderGameList(payload) {
    //     let yPosition = 180;

    //     //Clear the listing
    //     if (listingEntries.length !== 0) {
    //         for (let entry of listingEntries) entry.destroy();
    //         listingEntries = [];
    //         for (let entry of listingButtons) entry.destroy();
    //         listingButtons = [];
    //     }

    //     for (let room of payload) {
    //         // create a new row
    //         listingEntries.push(this.add.text(300, yPosition, room.roomId + '(' + room.playerIds.join(', ') + ')', {
    //             color: '#FFFFFF',
    //             fontSize: 40
    //         }).setOrigin(0.5));

    //         const spectateButton = this.add.text(1000, yPosition, 'Spectate', {
    //             color: '#FFFFFF',
    //             fontSize: 40
    //         }).setOrigin(0.5).setInteractive();

    //         spectateButton.on('pointerdown', () => this.socket.emit('joinRoomAsSpectator', room.roomId));
    //         spectateButton.on('pointerover', () => {
    //             spectateButton.setTint(0x30839f);
    //         });
    //         spectateButton.on('pointerout', () => {
    //             spectateButton.clearTint();
    //         });

    //         listingButtons.push(spectateButton);

    //         yPosition += 55;
    //     }
    // }

    goBack() {
        if (this.socket !== undefined) this.socket.removeAllListeners();
        this.scene.stop();
        this.scene.run(CST.SCENES.MENU);
    }

}