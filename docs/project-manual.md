# _Project manual_

_Group 1: GameChangers – DHI2V.So_ - Project Server and Client

---

## Introduction

This game project consists of two parts: the game server, which enables the communication between game clients, and the game client itself. Both are located in their respectively named folders. This manual will walk you through the necessary software and steps to get both project parts up and running.

___Important_: To work with and start this project, your machine will need to have at least version 17.5.0 of Node.js and NPM installed.__

## Server

Before running the server, you will need to install several Node packages it is dependent on. To do this, run the `npm i` command from a terminal while in the `server` directory.

Once the installation completes, you can run the server with the `npm start` command. By default, the server will be accessible on your local machine under port `3000`. However, you can modify the corresponding value in the `server.env` file to change the port.

## Client (production)

Before running the server, you will need to install several Node packages it is dependent on. To do this, run the `npm i` command from a terminal while in the `game/frontend` directory. Additionally, you will need to configure a web server application of your choosing.

Once the installation completes, you can build the client with the `npm run build` command. This command will create a `dist` directory with the packed code.

You will need to transfer the data from the `dist` directory to the HTML directory of your chosen wen server application.

## Client (development)

>_Note: These steps apply to hosting a game client's development version.
The development server is not suited for handling large amounts of concurrent connections._

Before running the server, you will need to install several Node packages it is dependent on. To do this, run the `npm i` command from a terminal while in the `game/frontend` directory.

Once the installation completes, you can run the client with the `npm start` command. By default, the server will be accessible on your local machine under port `8080`.

If you changed the server port, you would also need to adjust it on the client by changing the `SERVER_URL` variable in the `MenuScene.js` file located in the `src` subdirectory.
