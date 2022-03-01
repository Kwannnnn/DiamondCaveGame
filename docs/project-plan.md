# Project Plan

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

## Backlog Items

### US 01

Backlog item | Definition | Priority | Weight | Time spent | Depends on |
| -| -| -| -| -| -|
| BI-01 | Find/Create sprites for the players | M | 2 | - | - |
| BI-02 | Find/Create sprites for the different map tiles | M | 4 | - | - |
| BI-03 | Find/Create sprites for diamonds | M | 2 | - | - |
| BI-04 | Find/Create sprites for the rocks | M | 2 | - | - |

### US 04

Backlog item | Definition | Priority | Weight | Time spent | Depends on |
| -| -| -| -| -| -|
| BI-01 | Create an Node.JS Express project | M | 1 | - | -
| BI-02 | Implement socket.io on the server | M | 2 | - | US04-BI01
| BI-03 | Implement connection logic on server | M | 3 | - | US04-BI01
| BI-04 | Implement socket.io on the client | M | 3 | - | - | US09-BI01
| BI-05 | Implement connection logic on the client | M | 3 | - | - | US09-BI01

### US 05

Backlog item | Definition | Priority | Weight | Time spent | Depends on |
| -| -| -| -| -| -|
| BI-01 | Implement lobby creation and one-time passkey generation on the server | M | 4 | - | - |
| BI-02 | Implement lobby creation logic to the client | M | 4 | - | US09-BI01 |
| BI-03 | Create lobby menu | M | 2 | - | US09-BI01 |

### US 06

Backlog item | Definition | Priority | Weight | Time spent | Depends on |
| -| -| -| -| -| -|
| BI-01 | Implement lobby join logic on the server | M | 4 | US05-BI01
| BI-02 | Implement lobby join logic on the client | M | 3 | - | US09-BI01 |
| BI-03 | Create lobby menu join feature | M | 2 | - | US09-BI01 |

### US 09

Backlog item | Definition | Priority | Weight | Time spent | Depends on |
| -| -| -| -| -| -|
| BI-01 | Set up Phaser | M | 5 | - | - |
| BI-02 | Define the map as a grid | M | 9 | - | US09-BI01 |
| BI-03 | Assign tile sprites to the map grid | M | 4 | - | US09-BI01 |
| BI-04 | Player sprite orientation | M | 5 | - | US09-BI01 |
| BI-05 | The player can move using keyboard inputs | M | 5 | - | US09-BI01 |
| BI-06 | The camera follows the player | M | 7 | - | US09-BI01 |
| BI-07 | Add collision for objects on the map | M | 5 | - | US09-BI01 |
| BI-08 | Determine spawn and exit locations | M | 6 | - | US09-BI03 |

### US 10

Backlog item | Definition | Priority | Weight | Time spent | Depends on |
| -| -| -| -| -| -|
| BI-01 | Display the team's life total in the HUD | M | 7 | - | - |
| BI-02 | Display a gem counter to the team | M | 9 | - |  |
| BI-03 | Display the team's level progression | M | 4 | - |  |
| BI-04 | Display the team's run time | M | 4 | - |  |
| BI-05 | Display player's names in the HUD | M | 6 | - |  |
| BI-06 | Display when the players can move to next map | M | 4 | - |  |
