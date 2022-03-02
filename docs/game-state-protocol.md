# Game State Communication Protocol

The portocol described below contains a list of events clients should be able
to intercept (server events), and emit (client events) in order to communicate
the game state in the correct manner.

## Server Events
<table>
    <tr>
        <th>Event</th>
        <th>Payload</th>
        <th>Descriotion</th>
    </tr>
    <tr>
        <td>gameStart</td>
<td>
<p>

```javascript
{
    "tileMap": [
        [2,2,2,2],
        [2,1,1,2],
        [2,1,1,2],
        [2,2,2,2]
    ],
    "players": [
        {
            "playerId": ..., // the id of the player (sockedid, perhaps)
            "x": ..., // player spawn x position
            "y": ..., // player spawn y position
            "orientation": ... /* The direction the player is facing
                                * 0 - right, 90 - up, 180 - left, 270 - down
                                */
        }, ...
    ],
    "gems": [
        {
            "gemId": ..., // a unique identifier for a gem
            "x": ..., // gem spawn x position
            "y": ... // gem spawn y position
        }, ...
    ]
}
```
</p>
</td>
        <td>
            With this event the server indicates the beginning of a new game.
            <br>The <i>map</i> is represented by a matrix of integers, where
            '1' represents an empty spot, and '2' represents a wall.<br>
            <i>Players</i> are sent as an array of player objects, containing
            the spawn coordinates and facing directions of each player.<br>
            Lastly, <i>gems</i> are in the format of an array of gem objects,
            containing the spawn coordinates of each gem.
        </td>
    </tr>
    <tr>
        <td>gameOver</td>
<td>
<p>

```javascript
{
    "score": ..., // the total score for the team
    "players": [
        {   
            "playerId": ..., // the id of the player (sockedid, perhaps)
            "diamonds": ..., // the amount of diamonds collected by a player
        }, ...
    ]
}
```
</p>
</td>
        <td>
            With this event the server indicates the  end of a new game.
        </td>
    </tr>
    <tr>
        <td>playerMoved</td>
<td>
<p>

```javascript
{
    "playerId": ..., // the id of the player (sockedid, perhaps)
    "x": ..., // the new x position of the player
    "y": ..., // the new y position of the player
    
    // The new direction the player is facing
    // 0 - right, 90 - up, 180 - left, 270 - down
    "orientation": ...
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
{
    "gemId": ... // the id of the collected gem
}
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
{
    "roomId": ... // the invalid roomId
}
```
</p>
</td>
        <td>
            With this response the server indicates that there is no room with the
            specified roomId of a previous client message.
        </td>
    </tr>
    <tr>
        <td>gemNotFound</td>
<td>
<p>

```javascript
{
    "gemId": ... // the invalid gemId
}
```
</p>
</td>
        <td>
            This response indicates that there is no gem with the specified gemId
            of a previous client message.
        </td>
    </tr>
    <tr>
        <td>illegalPlayerState</td>
<td>
<p>

```javascript
{
    "playerId": ..., // the id of the player
    "x": ..., // the (possibly) illegal x position
    "y": ..., // the (possibly) illegal y position
    "orientation": ... // the (possibly) illegal orientation
}
```
</p>
</td>
        <td>
            This response indicates that a previous message tried to modify the
            state of the player (position, orientation) in an illegal state,
            e.g. outside of the map boundires, and/or orientation facing 
            south-west.
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
        <td>playerMove</td>
<td>
<p>

```javascript
{
    "roomId": ...,
    "x": ..., // the new x position of the player
    "y": ..., // the new y position of the player
    
    // The new direction the player is facing
    // 0 - right, 90 - up, 180 - left, 270 - down
    "orientation": ..., 
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
    "roomId": ..., // the id of the game room
    "gemId": ..., // the id of the collected gem
}
```
</p>
</td>
        <td>
            With this event the client indicates that a gem has been collected.
        </td>
    </tr>
</table>
