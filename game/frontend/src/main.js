import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import GameScreen from './scenes/Game';
import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';

const config = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    scene: [LoadScene, MenuScene, GameScreen, TitleScreen],
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


let button = document.getElementById('createTeamButton');
let button2 = document.getElementById('joinTeamButton');

button.addEventListener('click' , () => {
    socket.emit("createRoom");
});

button2.addEventListener('click',()=>{
    socket.emit('joinRoom')
})
