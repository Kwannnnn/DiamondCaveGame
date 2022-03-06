# Game Design - Diamond Cave

_Group 1 : GameChangers – DHI2V.So_ - Project Server and Client

---

This game design document describes the details for a massive multiplayer online, massive spectators, chatting, monitored, moderated, ranking (MMOMSCMMR) game. Diamond Cave is a 2D web browser co-op game, based on the old Emerald Mine game, but taken to a whole new experience with extra features and multiplayer functionality.

## 1. Story

Attracted by the fame and glory, two amateur archeologists Bob and Eve set foot into the infamous "Diamond Cave" in hopes of collecting precious and valuable gems. Unbeknownst to them, blood-thirsty enemies, booby traps and mind-boggling puzzles are lurking behind every corner. Will they make it out alive, or will they succumb to the weakness of their hearts and become yet another victim of this perilous cave?

## 2. Gameplay

The game is playable exclusively in duo co-op mode of two people. A run can only begin once both players have connected and formed a team.

### 2.1. Worlds

The game has 3 worlds, each with a different theme and difficulty. A world contains a set of levels that have to be completed in order to continue to the next world. The difficulty of the world increases incrementally, where world 1 is the easiest and world 3 is the most difficult.

### 2.2. Maps

Maps are categorized based on the world they are in, and therefore adopt the same theme and difficulty level. They are further divided into different objectives that the players have to achieve in order to progress onto the next map. The objectives include collecting all the gems present on the map, solving puzzles or trying to stay alive while avoiding traps.

### 2.3. Level Progression

The 2 players progress through the game by completing the objective of the current map. Everytime a new world is reached, the team gets a checkpoint that allows them to restart from the current world in the unfortunate case of death.
While the worlds are fixed and predetermined, a set number of maps are randomly selected from a larger pool for each run to make the game more interesting and replayable.

### 2.4. Buffs

After each finished map, the team is offered to choice between two bonuses that would give them an advantage for the levels to come. Buff effects are applied immediately. Some of the buffs include:

<table>
    <tr>
        <th>Icon</th>
        <th>Name</th>
        <th>Effect</th>
        <th>Rarity</th>
    </tr>
    <tr>
        <td>TBD</td>
        <td><b>Life Rune</b></td>
        <td>Team gains an extra life</td>
        <td>Common</td>
    </tr>
    <tr>
        <td>TBD</td>
        <td><b>Boots of Speed</b></td>
        <td>Grants 4% extra movement speed</td>
        <td>Common</td>
    </tr>
    <tr>
        <td>TBD</td>
        <td><b>Bloodstone</b></td>
        <td>Transforms itself in 3 Diamonds</td>
        <td>Common</td>
    </tr>
    <tr>
        <td>TBD</td>
        <td><b>Continuum Orb<b></td>
        <td>Reduces total run time with 25 seconds</td>
        <td>Rare</td>
    </tr>
</table>

___Note:_ The buffs are subject to change. More buffs may be added or existing buffs may be removed to maintain the balance of the game.__

### 2.5. Goals

The ultimate objective of the game is to escape a series of caves (maps) by completing the objective of each map while having fun on the way.

### 2.6. Losing

Each team has a shared life pool. Once the team loses its last life, the game ends and the score of the team is recorded.

### 2.7. Ranking System

Teams are ranked based on the time of the run, the diamonds collected and the remaining lives. Each world has its own rank list, and there is a global ranking for teams that have completed the whole run. The formula for determining the final score is:
> TBD

## 3. Objects

<table>
    <tr>
        <th>Name</th>
        <th>Image</th>
        <th>Behavior</th>
    </tr>
    <tr>
        <td>Player 1</td>
        <td>TBD</td>
        <td rowspan="2">
            <ul>
                <li>Can be controlled by the first player in 4 directions</li>
                <li>Can be controlled by the first player in 4 directions</li>
                <li>Can dig Dirt and collect Diamonds</li>
                <li>Can go into Map Exit to complete a level</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Player 2</td>
        <td>TBD</td>
    </tr>
    <tr>
        <td>Map Wall</td>
        <td>TBD</td>
        <td>
            <ul>
                <li>Defines the boundaries of the map</li>
                <li>Can not be destroyed</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Dirt</td>
        <td>TBD</td>
        <td>
            <li>Can be cleared by a <i>Player</i> by mining it</li>
        </td>
    </tr>
    <tr>
        <td>Rock</td>
        <td>TBD</td>
        <td>
            <li>Cannot be cleared by mining</li>
        </td>
    </tr>
    <tr>
        <td>Diamond</td>
        <td>TBD</td>
        <td>
            <ul>
                <li>Can be collected by a <i>Player</i> by moving into it</li>
                <li>Can be spawned by a <i>Game Master</i></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Locked Map Exit</td>
        <td>TBD</td>
        <td>
            <ul>
                <li>Can be unlocked when a <i>Player</i> collects enough diamonds to complete a level</li>
                <li>Cannot be destroyed</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Unlocked Map Exit</td>
        <td>TBD</td>
        <td>
            <ul>
                <li>Allows a <i>Player</i> to proceed to next level by moving into it</li>
                <li>Cannot be destroyed</li>
            </ul>
        </td>
    </tr>
</table>

## 4. Wireframes

To provide a better idea of what our game will encapsulate, several mockup wireframes are included below detailing some main functionalities and how certain components will look/behave.

### 4.1. Menus

### 4.1.1. Main menu

![image](wireframes/game-design/main-menu.png)

This wireframe shows the main menu. In here you have the option to go to Play Game, Leaderboard and exit. Play game will lead to further instructions. The leaderboard button will lead you to a window that shows the score of different teams. Exit will close the game.

### 4.1.2. Leaderboard

![image](wireframes/game-design/leaderboard.png)

This wireframe shows the leaderboard. You will be able to see your (and others) name and what score they achieved.

### 4.1.3. Play Game menu

![image](wireframes/game-design/play-game-menu.png)

This wireframe Shows the menu after you pressed Play Game. You have the choice to either create a Team or join a Team. Both options lead to further instructions. You also have the choice to go back to the main menu.

### 4.1.4. Create Team menu

![image](wireframes/game-design/create-team-menu.png)

This wireframe shows what you see if you pressed “Create Team”. On the top you see the randomly generated Teamcode which is needed for others to join. Under that you can see how much players are in your team currently. And you have the option to press start game which will lead to the actual game. And there is an option to go back to the previous window.

### 4.1.5. Join Team menu

![image](wireframes/game-design/join-team-menu.png)

This wireframe shows the menu after you pressed “Join a Team”. On the top you can enter the teamcode from the team you want to join. Then if you press Join team you will get led to the window of Create Team.

## 4.2. Gameplay

### 4.2.1. Map

![image](wireframes/game-design/map-1.png)

After creating your team you will go to the first level of the first world. This is a simple wireframe that shows a few assets of the game to give you an idea. A level has the brown dirt blocks which the player is able to mine. The grey stones are one of the Objects that the player is not able to mine. The diamonds need to be collected by the player but the rocks can fall down if you mine under them. On the top you can see which level and world you’re in. And on the top right you see the quit button which will bring you back to the main menu.

### 4.2.2. In-game Quit menu

![image](wireframes/game-design/quit-menu.png)

If you press the “Quit” button you get to see your score and it gives you 2 options. You can either play again or go back to the main menu.

### 4.2.3. Game over

![image](wireframes/game-design/death-screen.png)

If you die you get to see a quite similar screen to the quit menu screen but this time there is a text saying that you died.

## 5 Diagrams

### 5.1 Flowchart
![image](diagrams/flowchart.png)

#### 5.1.1 Proccesses

To start playing the game a lobby has to be created as well as a second player has to join afterwards. If player does not have a room created by a friend before, he has to create a new lobby. The generated room code will be displayed to the player, which is required for the second player to connect. The second participant has to receive this code using any type of communication, so he can join the lobby afterwards. On the other hand, the second player does not have to create anything if he knows that a room has already been created. He should wait for the code from his teammate and then he can choose "Join room" option, where the room code and a username has to be provided. After all of these is completed, the second player gets in the room with the one who created it. The only left step is to start a game by pressing a corresponding button.

#### 5.1.2 Scenes

Following the previously described steps, there is a number of scenes the system goes through. The first scene is LoadScene and a player sees it only for a few seconds while game is loading. The next scene is MenuScene where there are several options to choose for a player. If the room has already been created, the player should choose to join the room, which leads him to MenuJoinScene. After entering username and lobby code, it leads the player to lobby which is MenuLobbyScene. On the other hand, if room has to be created, the player should choose to create a new room. It leads him to MenuLobbyScene. When two players are inside lobby, they can start the game, which gets them to Game scene.
