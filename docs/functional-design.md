# _Functional design_

_Group 1 : GameChangers – DHI2V.So_ - Project Server and Client

---

## Introduction

This project is about creating a multi-player online game based on the game released in 1987 called Emerald Mine.
In our game players form two-man teams and connect to their own room where they can play on different maps collaborating with each other to complete an objective.
The idea of the game is to collect all diamonds on the map and avoid losing all their health.
During the game certain perks, traps and cooperative puzzles are present, the descriptions of which can be found in the Game Design document.

## Non-Functional Requirements

| ID  | Requirement                                                                          | MoSCoW |
|-----|--------------------------------------------------------------------------------------|--------|
| 1   | The system can handle at least 10 client connections to the server at the same time. | Must   |
| 2   | The game responds to user input within 100ms.                                        | Must   |
| 3   | The backend server is written in Nodejs or Java.                                     | Must   |
| 4   | The system is web based using HTML, CSS, and JavaScript.                             | Must   |
| 5   | The gamestate is transferred using websockets.                                       | Must   |
| 6   | The backend server runs on the provided VPS.                                         | Must   |
| 7   | The game is playable on Chrome, Safari and Firefox browsers.                         | Should |
| 8   | The system validates client input.                                                   | Could  |

## Functional Requirements

| ID  | Requirement                                                                                   | MoSCoW |
|-----|-----------------------------------------------------------------------------------------------|--------|
| 1   |  The system allows users to connect to a lobby as spectators.                                 | Should |
| 2   | The system allows users to connect to a lobby as players.                                     | Must   |
| 3   | The system allows users to view the run performance rankings.                                 | Must   |
| 4   | The system allows users to create and leave lobbies whenever they wish to do so.              | Should |
| 5   | The system allows specific users to connect to a lobby as admins.                             | Should |
| 6   | The system allows users in the same lobby to send messages to each other using a chat system. | Should |
| 7   | The system records a team’s performance when the game ends for the rankings.                  | Must   |
| 8   | The game has traps that deal damage to players when they are triggered.                       | Could  |
| 9   | The game has pressure plates that can disable traps.                                          | Could  |
| 10  | The game has at least 3 maps that the players can play on.                                    | Must   |
| 11  | The game has moving enemies that deal damage when the player collides with them.              | Should |
| 12  | The game offers perks to players after a map is completed.                                    | Must   |
| 13  | The game contains diamonds that players must collect to progress through maps.                | Should |
