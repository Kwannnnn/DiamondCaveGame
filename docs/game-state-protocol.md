# Game Communication Protocol

_Group 1: GameChangers – DHI2V.So_ - Project Server and Client

---

The protocol described below contains a list of events clients should be able
to intercept (server events) and emit (client events) to communicate
the logic of the game in a correct manner.

## Server Events

<table>
    <tr>
        <th>Event</th>
        <th>Payload</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>roomCreated</td>
<td>
<p>

```javascript
{
    // The id of the created room as a string
    roomId: ...,
    // An array of connected players for that room
    players: [
        {
            // the unique id of the player
            id: ..., 
            // the username of the player
            username: ... 
        }
    ]
}
```

</p>
</td>
        <td>Sent whenever a room has been successfully created.</td>
    </tr>
    <tr>
        <td>roomJoined</td>
<td>
<p>

```javascript
// The id of the joined room as a string
roomId;
```

</p>
</td>
        <td>Sent whenever a user has been successfully joined a room.</td>
    </tr>

<tr>
        <td>playerLeft</td>
<td>
<p>

```javascript
{
    // The unique name of the player that left the room
    id: ...,
    // The username of the player that left the room
    username: ...
}
```

</p>
</td>
        <td>
            Notifies all players in the lobby that a new player has left
            the game room.
        </td>
    </tr>


<tr>
        <td>newPlayerJoined</td>
<td>
<p>

```javascript
{
    // The unique name of the player that joined the room
    id: ...,
    // The username of the player that joined the room
    username: ...
}
```

</p>
</td>
        <td>
            Notifies all players in the lobby that a new player has joined
            the game room.
        </td>
    </tr>
    <tr>
        <td>gameReadyToStart</td>
        <td></td>
        <td>
            Indicates that the room has the required amount of players to begin
            the game.
        </td>
    </tr>
    <tr>
        <td>gameNotReadyToStart</td>
        <td></td>
        <td>
            Indicates that the room does not have the required amount of players to begin
            the game.
        </td>
    </tr>

<tr>
        <td>initialGameState</td>
<td>


<p>

```javascript
{
    // The current level of the team in the game
    level: ..., 
    tileMap: [
        [2,2,2,2],
        [2,1,1,2],
        [2,1,1,2],
        [2,2,2,2]
    ],
    players: [
        {
            // the username of the player
            playerId: ...,

            // player spawn x position
            x: ...,

            // player spawn y position
            y: ...,

            // The direction the player is facing
            // 0 - right, 180 - left
            // 90 - up, 270 - down
            orientation: ...
        }, ...
    ],
    
    gemsCollected:...,

    gems: [
        {
            // a unique identifier for a gem
            gemId: ...,

            // gem spawn x position
            x: ...,

            // gem spawn y position
            y: ...
        }, ...
    ],
    enemies: [
        {
            // a unique identifier for an enemy
            enemyId: ...,

            // Enemy starting position
            start: {
                x: 336,
                y: 336,
            },
            
            // The path the enemy will travel
            // path: {
            //     x: 496,
            //     y: 336,
            // }
            path: [] 
        }, ...
    ], 
        laserTraps: 
    [{
        //identifier for the trap
        trapId: 4,
        //spawn location for the trap
        start: {
            x: 200,
            y: 200,
        },
        active: 0,
    }, ...
    ],
}
```

</p>
</td>
        <td>
        <p>
            With this event the server indicates the beginning of a new game.
            <br>The <i>map</i> is represented by a matrix of integers, where
            '1' represents an empty spot, and '2' represents a wall.<br>
            <i>Players</i> are sent as an array of player objects, containing
            the spawn coordinates and facing directions of each player.<br>
            Lastly, <i>gems</i> are in the format of an array of gem objects,
            containing the spawn coordinates of each gem.<br> <i>enemies</i>
            contain enemy objects that define a start position and a path they
            will traverse.
        </td>
    </tr>

<tr>
        <td>runGameScene</td>
<td>
<p>

```javascript
{
    // the id of the room the client is joining
    roomId: ...,
    // the current game state as an object (for structure see "initialGameState")
    gameState: ...,
}
```

</p>
</td>
        <td>
            With this event the server transmits the current game state to a spectating client.
        </td>
    </tr>
<!-- <tr>
        <td>gameOver</td>
<td>
<p>

```javascript
{
    // the total score for the team
    score: ...,

    // the total amount of diamonds collected
    diamonds: ...
}
```

</p>
</td>
        <td>
            With this event the server indicates the  end of a new game.
        </td>
</tr> -->

<tr>
    <td>teammateMoved</td>
<td>
<p>

```javascript
{
    // the username of the player that moved
    playerId: ...,

    // the new x position of the player
    x: ...,

    // the new y position of the player
    y: ...,

    // The new direction the player is facing
    // 0 - right, 180 - left
    // 90 - up, 270 - down
    orientation: ...
}
```

</p>
</td>
        <td>
            With this event the server informs all clients in a game room that
            a player position has been changed.
        </td>
    </tr>
    <tr>
        <td>gemCollected</td>
<td>
<p>

```javascript
// the id of the collected gem as a string
gemId;
```

</p>
</td>
        <td>
            With this event the server informs all clients in a game room that
            a gem has been collected.
        </td>
    </tr>
    <tr>
        <td>choosePerks</td>
<td>
<p>

```javascript
// a list of perks as array
perks:;
```

</p>
</td>
        <td>
            With this event the server transmits a list of available perks to all clients in the room.
        </td>
    </tr>
    <tr>
        <td>playerChoosePerks</td>
<td>
<p>

</p>
</td>
        <td>
            With this event the server emit an event to all spectators that the players are now choosing their perks.
        </td>
    </tr>
    <tr>
        <td>teammatePerkChoice</td>
<td>
<p>

```javascript
// the perk chosen by a teammate
teammatePerk:;
```

</p>
</td>
        <td>
            With this event the server informs all clients in a game room that
            a perk has been chosen by a player.
        </td>
    </tr>
    <tr>
        <td>perkForNextGame</td>
<td>
<p>

```javascript
{
    // the chosen perk as a string
    perk: ...,
    // the game state of the next map
    gameState: ...,
}
```

</p>
</td>
        <td>
            With this event the server informs all clients in a game room about
            the perk chosen for the next game.
        </td>
    </tr>

<tr>
        <td>nextMap</td>
<td>
<p>

```javascript
{
    // the chosen perk as a string
    perk: ...,
    // the game state of the next map
    gameState: ...,
}
```

</p>
</td>
        <td>
            With this event the server informs all clients in a game room about
            the perk chosen for the next game.
        </td>
    </tr>


<tr>
        <td>chatMessage</td>
<td>
<p>

```javascript
{
    // the username of message's sender as a string
    sender: ...,
    // the message body as a string
    message: ...,
}
```

</p>

<td>
    With this event the server forwards a message sent by another player
</td>

<tr>
    <td>
        spectatorJoined
    </td>

<td>

```javascript
// the username of spectator as a string
playerId: ...,
```

</td>

<td>
    With this event the server informs all participants in a game room that
    a new spectator has joined.
</td>

</tr>

<!-- this is one row -->
<tr>
    <td>
        currentGames
    </td>

<td>

```javascript
[
    {
        // the id of the game room
        roomId: ...,

        // the ids of the players in the room as strings
        playerIds: [...]
    },

    // other rooms
    ...
]
```

</td>

<td>
    A response to the <b>getCurrentGames</b> request from the client, which
    contains a list of active game objects
</td>

</tr>
<!-- this is one row -->
<tr>
    <td>
        rankList
    </td>
<td>

```javascript
[
    {
        // the id of run (the lobby code)
        runId: ...,

        // the total score of the team
        totalScore: ...,

        // the time the team spent to complete the run
        totalScore: ...,

        // the time the team spent to complete the run
        playerUsernames: [..., ...]
    },

    // other rooms
    ...
]
```

</td>

<td>
    A response to the <b>getRanking</b> request from the client, which contains
    a sorted by total score array of the completed game runs.
</td>

</tr>
<!-- this is one row -->

<tr>

<td>
    choosePerks
</td>

<td>

```javascript
[
    {
        // strings of perks names
        perks: [..., ...]
    }
]
```

</td>

<td>
    Sends the client the list of all available perks from the server. Client has it's implementation
</td>

</tr>

<tr>

<td>
    teammatePerkChoice
</td>

<td>

```javascript
[
    {
        // strings of perks names
        teammatePerkChoice: perk
    }
]
```

</td>

<td>
    Sends a client the name of the perk that another player has chosen. 
</td>

</tr>

<tr>

<td>
    perkForNextGame
</td>

<td>

```javascript
[
    {
        // strings of perks names
        perkName: perk
    }
]
```

</td>

<td>
    Sends both players the name of the perk that will be used next game. 
</td>

</tr>

<tr>

<td>
    DeveloperGamestate
</td>

<td>

```javascript
[
    {
        // Game state object with tilemap, players location and gems
        ititialGameState: ...
    }
]
```

</td>

<td>
    Sends the game state of the map a developer has chosen 
</td>

</tr>

</table>

### Possible errors

<table>
    <tr>
        <th>Event</th>
        <th>Payload</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>roomNotFound</td>
<td>
<p>

```javascript
// the invalid roomId as string
roomId;
```

</p>
</td>
        <td>
            With this response the server indicates that there is no room with
            the specified roomId of a previous client message.
        </td>
    </tr>
    <tr>
        <td>roomNotReady</td>
        <td>-</td>
        <td>
            With this response the server indicates that the room the client is attempting to start does not have enough players.
        </td>
    </tr>
    <tr>
        <td>roomFull</td>
        <td>-</td>
        <td>
            The room a client is trying to join already contains the maximum
            amount of players.
        </td>
    </tr>
    <tr>
        <td>alreadyInRoom</td>
        <td>-</td>
        <td>
            Triggered whenever the client already belongs to the room they are
            trying to join.
        </td>
    </tr>
    <tr>
        <td>gemNotFound</td>
<td>
<p>

```javascript
// the invalid gemId
gemId;
```

</p>
</td>
        <td>
            There is no gem with the specified gemId of a previous client
            message.
        </td>
    </tr>
    <tr>
        <td>illegalPlayerState</td>
<td>
<p>

```javascript
{
    // the id of the player
    playerId: ...,

    // the (possibly) illegal x position
    x: ...,

    // the (possibly) illegal y position
    y: ...,

    // the (possibly) illegal orientation
    orientation: ...
}
```

</p>
</td>
        <td>
            A previous message tried to modify the state of a player (position,
            orientation) in an illegal state, e.g. outside of the map
            boundires, and/or orientation facing south-west.
        </td>
    </tr>




<tr>
    <td>nameAlreadyExistForAPlayer</td>
    <td>-</td>
    <td>The name that the player is trying to use for joining the lobby is already in use by another user </td>
</tr>


<tr>
    <td>nameAlreadyExistForASpectator</td>
    <td>-</td>
    <td>The name that the player is trying to use for joining the lobby is already in use by a spectator </td>
</tr>



</table>

## Client Events

<table>
    <tr>
        <th>Event</th>
        <th>Payload</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>setUsername</td>
        <td>
<p>

```javascript
// The username of the player as a string
username;
```

</p>
</td>
        <td>
            A message sent whenever a client chooses their username whenever
            creating a room/joining a room/is going to spectate.
        </td>
    </tr>
    <tr>
        <td>createRoom</td>
        <td>-</td>
        <td>
            A message sent whenever a client wants to create a new game room.
        </td>
    </tr>
<!-- this is one row -->
    <tr>
        <td>joinRoom</td>
<td>
<p>

```javascript
// The id of the room as a string
roomId;
```

</p>
</td>
        <td>
            Sent whenever a client tries to join a game room. Payload contains
            a string representing the id of the room.
        </td>
    </tr>

<!-- this is one row -->
<tr>
        <td>checkGameReady</td>    
        <td>
            <p>
                
```javascript
// The room id of the room to check
roomId;
```

</p>
        </td>

<td>
    Sent to check if the game is ready to start.
</td>

</tr>
<!-- this is one row -->
<tr>
        <td>leaveRoom</td>
<td>
<p>

```javascript
// The id of the room as a string
roomId;
```

</p>
</td>
        <td>
            Sent when a client leaves a game room.
        </td>
    </tr>

<!-- this is one row -->
<tr>
    <td>
        joinRoomAsSpectator
    </td>

<td>

```javascript
// the id of the room as a string
roomId:;
```

</td>

<td>
    Sent whenever there is a spectator wanting to join a room.
</td>

</tr>
<!-- this is one row -->

<tr>
        <td>gameStart</td>
<td>
<p>

```javascript
// The id of the room as a string
roomId;
```

</p>
</td>
        <td>
            A message sent from the client indicating the team is ready to
            begin the game.
        </td>
    </tr>
    <tr>
        <td>playerMove</td>
<td>
<p>

```javascript
{
    roomId: ...,

    // the new x position of the player
    x: ...,

    // the new y position of the player
    y: ...,

    // The new direction the player is facing
    // 0 - right, 180 - left
    // 90 - up, 270 - down
    orientation: ...,
}
```

</p>
</td>
        <td>
            With this event the client indicates that a player has moved to a
            different tile.
        </td>
    </tr>
    <tr>
        <td>collectGem</td>
<td>
<p>

```javascript
{
    // the id of the game room
    roomId: ...,

    // the id of the collected gem
    gemId: ...,
}
```

</p>
</td>
        <td>
            With this event the client indicates that a gem has been collected.
        </td>
    </tr>
    <tr>
        <td>reachedEnd</td>
<td>
<p>

```javascript
// The id of the game room
roomId:;
```

</p>
</td>
        <td>
            With this event the client indicates that they have completed the map.
        </td>
    </tr>
    <tr>
        <td>finishedPerkChoosing</td>
<td>
<p>

```javascript
// The id of the game room
lobbyID:;
```

</p>
</td>
        <td>
            With this event the client indicates that the perk choice timer has run out.
        </td>
    </tr>
    <tr>
        <td>chosenPerk</td>
<td>
<p>

```javascript
{
    // Username of the current player as a string 
    username: ...,
    // The id of the perk chosen
    perkId: ...,
    // The id of the game room
    roomId: ...,
}
```

</p>
</td>
        <td>
            With this event the client indicates that they have completed the map.
        </td>
    </tr>
    <tr>
        <td>chatMessage</td>
<td>
<p>

```javascript
// the message body as a string
message:
```

</p>
</td>
        <td>
            With this event the client sends a broadcast chat message
        </td>
    </tr>

<!-- this is one row -->
<tr>
    <td>
        getCurrentGames
    </td>

<td>-</td>

<td>
    With this event the client requests a list of active game rooms
</td>

</tr>


<tr>

<td>
    reachedEnd
</td>

<td>

```javascript
[
    {
        // room id
        roomID: ...
    }
]
```

</td>

<td>
    Indicates that one of the players has reached the end of the map 
</td>

</tr>

<tr>

<td>
    chosenPerk
</td>

<td>

```javascript
[
    {
        // strings of chosen perk names
        chosenPerk: ...
    }
]
```

</td>

<td>
    Sends the perk choice of the player to the server. Every time player chooses a perk from the list, this even is triggered, and message is sent  
</td>

</tr>

<tr>

<td>
    finishedPerkChoosing
</td>

<td>

```javascript
[
    {
        // room id
        roomID: ...
    }
]
```

</td>

<td>
    Indicates that the time for choosing the perks is up  
</td>

</tr>

<tr>

<td>
    hitByEnemy
</td>

<td>

```javascript
[
    {
        // room id
        roomID: ...,

        // integer of damage
        damage: ...
    }
]
```

</td>

<td>
    Indicates that player hit the enemy and sends all information to reduce health of the team 
</td>

</tr>

<tr>

<td>
    developerSpawn
</td>

<td>

```javascript
[
    {
        // map id developer wants to spawn
        mapID: ...,

    }
]
```

</td>

<td>
    Sends the chosen id of the map developer wants to spawn on 
</td>

</tr>
</table>
