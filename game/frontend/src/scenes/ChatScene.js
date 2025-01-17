import { CST } from '../utils/CST';
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';

export default class ChatScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.CHAT
        })
    }

    init(data) {
        this.chatMessages = [];
        this.socket = data.socket;
    }

    preload() {
        this.load.audio('message', ['assets/sound_effects/message-sent-or-received.mp3']);
    }

    create() {
        this.messageSound = this.sound.add('message');

        this.chatInput = this.add.existing(new InputText(this, 150, 620, 270, 30, {
            id: 'chat',
            type: 'text',
            color: '#000000',
            backgroundColor: '#ffffff', 
            fontFamily: 'cursive'
        }))
        // TODO: add line wrapping
    
        let chatTextArea = {
            width: 270,
            height: 450
        }
        // chatbox area
        let chatArea = this.make.graphics();
        this.chatBox = this.add.graphics(chatArea);
        this.chatBox.setDefaultStyles({
            lineStyle: {
                width: 3,
                color: 0x159622,
            },
            fillStyle: {
                color: 0x070707,
            }
        });
        let rect = {
            x: 15,
            y: 150,
            width: chatTextArea.width,
            height: chatTextArea.height
        }
        this.chatBox.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.chatBox.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // create geometry mask to hide pixels
        let mask = new Phaser.Display.Masks.GeometryMask(this, this.chatBox);
        this.chat = this.add.text(15, 150, this.chatMessages, { color: '#1ed631', padding: 10, wordWrap: { width: 240, useAdvancedWrap: true } }).setOrigin(0);
        this.chat.setMask(mask); 

        //  The rectangle they can 'drag' within
        this.chatZone = this.add.zone(15, 150, 270, 450).setOrigin(0).setInteractive();

        this.chatZone.on('pointermove', (pointer) => {

            if (pointer.isDown) {
                this.chat.y += (pointer.velocity.y / 10);

                this.chat.y = Phaser.Math.Clamp(this.chat.y, -400, 99999);
            }

        });

        // Disabled keyboard event from player when chat input is focused
        this.chatInput.on('focus', () => {
            this.scene.get(CST.SCENES.GAME).input.keyboard.enabled = false;
        });

        // De-focused the input text by clicking on the Game scene
        this.scene.get(CST.SCENES.GAME).input.on('pointerdown', () => {
            this.chatInput.setBlur();
        })

        // set enter key for sending message
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // send message to server on enter key
        this.enterKey.on('down', (event) => {
            if (this.chatInput.text != '') {
                this.socket.emit('chatMessage', this.chatInput.text);
                this.messageSound.play();
                this.chatInput.text = '';
            }
        });

        // display the messages in chat box
        this.socket.on('chatMessage', (data) => {
            this.messageSound.play();
            const { sender, message } = data;     
            let chatMessage = sender + ': ' + message;
            this.chatMessages.push(chatMessage);
            this.chatMessages.push('\n');
            this.chat.setText(this.chatMessages);
        });
    }

    update() {
        // enabled player keyboard input when chat input is not focused
        if (this.chatInput.isFocused === false) {
            this.scene.get(CST.SCENES.GAME).input.keyboard.enabled = true;
        }     
    }
}   