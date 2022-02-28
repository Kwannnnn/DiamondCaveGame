/** @type {import("../typings/phaser")} */
import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import GameScreen from './scenes/Game';

const config = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    scene: [
        LoadScene, MenuScene
    ],
    parent: "game",
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    },
    dom: {
        createContainer: true
    }
}

const game = new Phaser.Game(config);
game.scene.add('titlescreen', TitleScreen);
game.scene.add('game', GameScreen);

game.scene.start('game');

let button = document.getElementById('createTeamButton');
let button2 = document.getElementById('joinTeamButton');

button.addEventListener('click' , () => {
    socket.emit("createRoom");
});

button2.addEventListener('click',()=>{
    socket.emit('joinRoom')
})
