# Project Plan

_Group 1 : GameChangers – DHI2V.So_ - Project Server and Client

---

## User Stories

### 1. As a player I want to be able to visually identify the different objects in the game world

### 2. As the publisher I want to know what themes the world will have

### 3. As the publisher I want to know what perks will be granted to players

### 4. As a player I want to be able to connect to the server

### 5. As a player I want to be able to create a lobby

### 6. As a player I want to be able to join a lobby

### 7. As a player I want to start the game

### 8. As a player I want to be in the same map as everyone in the lobby

### 9. As a player I want to be able to walk around on the map

### 10. As a player I want to see the UI reflect when I interact with the map

### 11. As a player I want to choose perk after completing a map

    a. Players have to choose the same perk;
    b. The max time they are given is 20 sec;
    c. If they don’t select the same perk in 20 sec, they get random from the choices they have;
    d. If no one selected, the random of 3 perks is chosen
    e. If only one person selected, after 20 sec that perk is chosen
    f. The time for choice of perks is included in game run time.

### 12. As a player I want to play the next map after I choose a perk

### 13. As a player I want to have enemies (also traps) that have certain behavior

### 14. As a player I want to have 5 maps

    a. Each map has a number of diamonds player has to collect to get to another map (place more diamonds than needed);

### 15. As a player I want to spectate others playing

### 16. As a player I want to be able to send a message to the room

### 17. As a player I want to see my global run ranking (we rank based on collected diamonds team run, run finishes when you die)

    a. The ranking screen can display all of the stats sent by the server using either pagination or scrolling

### 18. As an admin I want to be able to influence the game

### 19. As a developer I want to have developer console (you can skip some)

### 20.  As a user I would like to have attractive scenes

### 21. As a user I want the HUD to clearly display the current game state

### 23. As a user I want the game to have sounds effects

### 24. As a user I want the game to have visual effects

### 25. As a developer I want to have a dedicated room for testing

### 26. As a developer I want a playable version of the game to be uploaded to the VPS every week

### 27. As a user I want to be able to play in all 3 worlds of the game

## Backlog Items

### US 01

Backlog item | Definition | Priority | Weight |Depends on |
| -| -| -| -| -|
| BI-01 | Find/Create sprites for the players | M | 2 | - |
| BI-02 | Find/Create sprites for the different map tiles | M | 4 | - |
| BI-03 | Find/Create sprites for diamonds | M | 2 | - |
| BI-04 | Find/Create sprites for the rocks | M | 2 | - |

### US 02

Backlog item | Definition | Priority | Weight |Depends on |
| -| -| -| -| -|
| BI-01 | Find/create world/map themes | M | 6 | - |

### US 03

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Implement healing perk | M | 5 | - |
| BI-02 | Implement movement speed perk | M | 5 | - |
| BI-03 | Create perk scene | M | 6 | - |

### US 04

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Create an Node.JS Express project | M | 1 | - |
| BI-02 | Implement socket.io on the server | M | 2 | US04-BI01 |
| BI-03 | Implement connection logic on server | M | 3 | US04-BI01 |
| BI-04 | Implement socket.io on the client | M | 3 | US09-BI01 |
| BI-05 | Implement connection logic on the client | M | 3 | US09-BI01 |

### US 05

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Implement lobby creation and one-time passkey generation on the server | M | 4 | - |
| BI-02 | Implement lobby creation logic to the client | M | 4 | US09-BI01 |
| BI-03 | Create lobby menu | M | 2 | US09-BI01 |

### US 06

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Implement lobby join logic on the server | M | 4 | US05-BI01 |
| BI-02 | Implement lobby join logic on the client | M | 3 | US09-BI01 |
| BI-03 | Create lobby menu join feature | M | 2 | US09-BI01 |

### US 07

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Server should sent a ready to start game event to the client | M | 3 | - |
| BI-02 | Client should  display the players in the lobby and a button to start the game | M | 4 | - |
| BI-03 | Server should generate the game state once the client start button has been pressed | M | 5 | US07-BI04 |
| BI-04 | Define a communication format for the game state | M | 5 | - |
| BI-05 | Decode the game state on the client side and render the game | M | 6 | US07-BI03 |
| BI-06 | Send player position between from client to server | M | 5 | - |
| BI-07 | Send collectable state (i.e. gems) between from client to server | M | 5 | - |

### US 08

### US 09

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Set up Phaser | M | 5 | - |
| BI-02 | Define the map as a grid | M | 9 | US09-BI01 |
| BI-03 | Assign tile sprites to the map grid | M | 4 | US09-BI01 |
| BI-04 | Player sprite orientation | M | 5 | US09-BI01 |
| BI-05 | The player can move using keyboard inputs | M | 5 | US09-BI01 |
| BI-06 | The camera follows the player | M | 7 | US09-BI01 |
| BI-07 | Add collision for objects on the map | M | 5 | US09-BI01 |
| BI-08 | Determine spawn and exit locations | M | 6 | US09-BI03 |

### US 10

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Display the team's life total in the HUD | M | 7 | - |
| BI-02 | Display a gem counter to the team | M | 9 | - |
| BI-03 | Display the team's level progression | M | 4 | - |
| BI-04 | Display the team's run time | M | 4 | - |
| BI-05 | Display player's names in the HUD | M | 6 | - |
| BI-06 | Display when the players can move to next map | M | 4 | - |

### US 11

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | There are at least 4 perks implemented | M | 6 | - |
| BI-02 | Perks are displayed after completing a map | M | 6 | - |
| BI-03 | Perk picking logic is implemented | M | 8 | - |

### US 12

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | The players are placed in a random map layout after completing current map | M | 5 | - |
| BI-02 | After completing a world, the players move to the next one | M | 6 | - |

### US 13

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Traps are visible and they deal damage | M | 6 | - |
| BI-02 | Enemies can move around the map in a predetermined pattern | M | 7 | - |
| BI-03 | Find/Create enemy sprites | M | 4 | - |
| BI-04 | Create a spike trap | M | 6 | - |
| BI-05 | Create a laser trap | M | 7 | - |
| BI-06 | Create a pressure pad trap | M | 7 | - |

### US 14

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | World 1 maps are fully implemented | M | 6 | - |
| BI-02 | Design 2 puzzles that can be added to maps | M | 3 | - |
| BI-03 | Puzzles are implemented in maps | M | 5 | - |

### US 15

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Send a list of active games to client and display it in a separate scene | M | 5 | - |
| BI-02 | Define the spectator model and enable spectators to join lobbies | M | 4 | - |
| BI-03 | Create a spectator game scene that only receives game data and have a player scene extend it with player functionality | M | 7 | - |
| BI-04 | Enable spectators to move the camera and show number of spectators to everyone | M | 4 | US15-BI04 |
| BI-05 | Display the game scene for spectators | M | 3 | - |

### US 16

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Implement server functionality for players to broadcast messages to everyone and for spectators to chat with each other | M | 4 | - |
| BI-02 | Create chat user interface and bind it to the protocol | M | 5 | - |

### US 17

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Transmit run stats to server on game over and rank them on the server | M | 5 | - |
| BI-02 | Create the ranking display scene and have the server transmit data to a client | M | 6 | - |

### US 18

### US 19

### US 20

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Reposition the game to the middle of the screen and change the page background to black | M | 3 | - |
| BI-02 | Update the input scenes in the menu to use input objects styled to the game and remove status text | M | 4 | - |
| BI-03 | Create a scrollable table component to display running games for spectators | M | 5 | - |
| BI-04 | Convert the perk scene into a popup over the game scene and improve visual style | M | 6 | - |
| BI-05 | Convert the chat box into an always-visible sidebar and style it to the game | M | 7 | - |
| BI-06 | Improve HUD style to fit the game | M | 4 | - |

### US 21

### US 22

### US 23

### US 24

### US 25

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Create a menu scene to go to developers room | M | 6 | - |
| BI-02 | Create a room with certain lobbyID for developers (the code cannot be taken by usual rooms) | M | 6 | - |
| BI-03 | Create functionality to spawn on the developer map | M | 8 | - |

### US 26

### US 27

---

## Known problems

Problem ID | Description | Priority (High/Normal) | Weight | Status |
| - | - | - | - | - |
| PB-01 | The name of the current player doesn't follow character, not seen by other player | N | 3 | In progress |
| PB-02 | The server does not record the game state, which allows arbitrary data to be sent by clients without any integrity verification | H | 8 | Done |
| PB-03 | Colliding with a trap causes the damage event to fire repeatedly | N | 4 | In progress |
| PB-04 | The game can be started with one player, causing a server crash | H | 4 | Done |
| PB-05 | WASD cannot by typed in chat | H | 5 | In progress |
| PB-06 | Spectator list can overflow, obscuring entries | H | 5 | In progress |
| PB-07 | The client uses a hard-coded tilemap, instead of the server one. Caused by a merge error | H | 3 | Done |
| PB-08 | Player's timers aren't synchronized | N | 6 | Not started |
