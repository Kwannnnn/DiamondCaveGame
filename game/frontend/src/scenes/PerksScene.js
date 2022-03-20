import Phaser from "phaser";
import { CST } from "../utils/CST";

/*
    This scene is run after the team finishes the map. Here the perk for the next map is chosen.
*/
export default class PerkMenu extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.PERKS
        })
    }

    init(data){
        this.perksNames = data.perksNames;
        this.username = data.username;
        this.socket = data.socket;
        this.lobbyID = data.lobbyID;

        // Only for testing
        this.gameState = data.gameState;
    }

    preload(){
        
    }

    create(){
        // Set background to black and add title
        this.cameras.main.setBackgroundColor("black");
        this.title = this.add.text(100, 100, "Choose a perk", {
            fontSize: 50,
            fontStyle:"bold",
        })
        
        // Start the timer
        this.timer = 10;
        this.countDown = this.add.text(270, 150, this.timer, {
            fontSize: 50,
            fontStyle:"bold",
        });

        this.countDownTimer = this.time.addEvent({
            callback:()=>{
                if(this.timer > 0) {
                    this.timer--;
                    this.countDown.setText(this.timer) ;
                    if(this.timer < 1){
                        console.log("timer hit 0.");
                        
                        // Sends message indicating that the time
                        this.socket.emit("finishedPerkChoosing", this.lobbyID);
                        this.countDownTimer.remove();
                    }
                }
            },
            callbackScope:this,
            delay:1000,
            loop:true
        })

        // Create perk text objects from the list received from server
        this.perks = [];
        for (let i = 0; i < this.perksNames.length; i++) {
            const perkName = this.perksNames[i];
            this.perks.push(this.add.text(
                100, 300+100*i, perkName, 
                {
                fontSize:40
            }).setDepth(1).setInteractive());

            // Assing event to the click on the corresponding perk text
            this.perks[i].on('pointerdown', () => {
                this.selectPerk(i);
            });
        }

        // Display teammate's choice
        this.add.text(900,300,"Teammate Choice:", {fontSize:30});
        this.teammateChoice = this.add.text(900,340, "None",{fontSize:25});
        this.displayTeammatePerk();

        // Wait for final perk to be sent from server (now it only listens to movement perk)
        this.socket.on("perkForNextGame", (perk) => {

            this.scene.start(CST.SCENES.GAME, {
                username: this.username,
                initialGameState: this.gameState,
                lobbyID: this.lobbyID,
                socket: this.socket,
                perk: perk
            });

            this.scene.stop(this);
        })
    }

    // Even that is getting called by clicking on the perk text
    selectPerk(perkId){
        this.perks.forEach(perk => {
            perk.setColor('white');
        });

        // Send chosenPerk message to server 
        this.socket.emit("chosenPerk", {username: this.username, perkId, lobbyID: this.lobbyID});
        this.perks[perkId].setColor('green');
    }

    displayTeammatePerk() {
        this.socket.on("teammatePerkChoice", (teammatePerk) => {
            this.teammateChoice.destroy();
            this.teammateChoice = this.add.text(900,340, teammatePerk.teammatePerk,{fontSize:25});
        })
    }
}