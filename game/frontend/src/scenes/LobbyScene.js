import Phaser from 'phaser';
import { CST } from "../CST";

let SERVER_URL = "localhost:3000";
const addressForm = '<input type="text" name="address" value="'+SERVER_URL+'" />';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOBBY
        })
    }

    preload() {
            
    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, "logo").setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0)
        

        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 400, "Disconnected", {
            color: "#FFFFFF",
            fontSize: 48
        }).setOrigin(0.5);
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 325, "Players", {
            color: "#FFFFFF",
            fontSize: 40
        }).setOrigin(0.5);
        this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - 100, "start").setDepth(1).setInteractive();

        this.createRoom();

    }

    createRoom(){
        let ip = "http://"+SERVER_URL;
        this.message.setText("Connecting to:"+ip);
        SERVER_URL = ip;
        this.socket = io(SERVER_URL, {reconnection: false});

        this.socket.on('connect', ()=>{this.createLobby()});

        this.socket.on('roomCreated', (roomId, creatorId)=>{this.initRoom(roomId, creatorId)});

        this.socket.on('roomJoined', (roomId, playerId)=>{this.addPlayer(playerId)});

        this.socket.on('connect_error', ()=>{this.displayError()});
    }

    createLobby(){
        this.socket.emit('createRoom');
    }

    initRoom(roomId, creatorId){
        this.message.setText("Lobby Code:" + roomId);
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 275, "Player: " + creatorId, {
            color: "#FFFFFF",
            fontSize: 32
        }).setOrigin(0.5);
    }

    addPlayer(roomId, playerId) {
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 200, "Player: " + playerId, {
            color: "#FFFFFF",
            fontSize: 32
        }).setOrigin(0.5);
    }

    displayError(){
        this.message.setText("Could not connect!");
    }

    sendDisconnect(){
        //TODO: Currently we just spawn infinite live sockets, a disconnect option should be implemented
    }
}
