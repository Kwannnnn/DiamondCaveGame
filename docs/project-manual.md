# _Project manual_

_Group 1: GameChangers – DHI2V.So_ - Project Server and Client

---

## Introduction

This game project consists of two parts: the game server, which enables the communication between game clients, and the game client itself. Both are located in their respectively named folders. This manual will walk you through the necessary software and steps to get both project parts up and running.

___Important_: To work with and start this project, your machine will need to have at least version 17.5.0 of Node.js and NPM installed.__

## Server

Before running the server, you will need to install several Node packages it is dependent on. To do this, run the `npm i` command from a terminal while in the `server` directory.

Once the installation completes, you can run the server with the `npm start` command. The server will be accessible on your local machine under port `3000` by default. You can modify the corresponding value in the `server/.env` file to change the port.

## Client (development)

_Note: These steps apply to the development version of the game client and may be changed in the future._

Before running the server, you will need to install several Node packages dependent on. To do this, run the `npm i` command from a terminal while in the `game/frontend` directory.

Once the installation completes, you can run the client with the `npm start` command. The server will be accessible on your local machine under port `8080` by default.

If you changed the server port, you would also need to adjust it on the client by changing the `SERVER_URL` variable in the `MenuJoinScene.js`, `MenuLobbyScene.js`, & `SpectatorJoinScene.js` files located in the `src` subdirectory.