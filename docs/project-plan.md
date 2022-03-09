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

### 18. As a admin I want to be able to influence the game

### 19. As a developer I want to have developer console (you can skip some)

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
| BI-07 | Send collectable state (i.e gems) between from client to server | M | 5 | - |

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

### US 15

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Send a list of active games to client and display it in a separate scene | M | 5 | - |
| BI-02 | Define the spectator model and enable spectators to join lobbies | M | 4 | - |
| BI-03 | Create a spectator game scene that only receives game data and have a player scene extend it with player functionality | M | 7 | - |
| BI-04 | Enable spectators to move the camera and show number of spectators to everyone | M | 4 | - |

### US 16

Backlog item | Definition | Priority | Weight | Depends on |
| -| -| -| -| -|
| BI-01 | Implement server functionality for players to broadcast messages to everyone and for spectators to chat with each other | M | 4 | - |
| BI-02 | Create chat user interface and bind it to the protocol | M | 5 | - |
