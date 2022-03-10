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
        <th>Descriotion</th>
    </tr>
    <tr>
        <td>roomCreated</td>
<td>
<p>

```javascript
// The id of the created room as a string
roomId
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
roomId
```

</p>
</td>
        <td>Sent whenever a user has been successfully joined a room.</td>
    </tr>
    <tr>
        <td>newPlayerJoined</td>
<td>
<p>

```javascript
// The username of the player that joined the room
playerId
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
        <td>-</td>
        <td>
            Indicates that the room has the required amount of players to begin
            the game.
        </td>
    </tr>
    <tr>
        <td>initialGameState</td>
<td>
<p>

```javascript
{
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
            
            // The path the enenmy will travel
            path: [{
                x: 496,
                y: 336,
            }, ...
            ]
        }, ...
    ]
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
            containing the spawn coordinates of each gem.<br> <i>enemies</i> contain enemy objects that define a start position and a path they will traverse.
        </td>
    </tr>
    <tr>
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
    </tr>
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
gemId
```

</p>
</td>
        <td>
            With this event the server informs all clients in a game room that
            a gem has been collected.
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
roomId
```

</p>
</td>
        <td>
            With this response the server indicates that there is no room with the
            specified roomId of a previous client message.
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
gemId
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
</table>

## Client Events

<table>
    <tr>
        <th>Event</th>
        <th>Payload</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>createRoom</td>
        <td>-</td>
        <td>
            A message sent whenever a client wants to create a new game room.
        </td>
    </tr>
    <tr>
        <td>joinRoom</td>
<td>
<p>

```javascript
// The id of the room as a string
roomId
```

</p>
</td>
        <td>
            Sent whenever a client tries to join a game room. Payload contains
            a string representing the id of the room.
        </td>
    </tr>
    <tr>
        <td>gameStart</td>
<td>
<p>

```javascript
// The id of the room as a string
roomId
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
        <td>collectDiamond</td>
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
</table>
