# DHI2V.So1 Group 1

VPS Link: <http://vps1056.directvps.nl>

## 1. Team plan

[1.1. Timesheet](https://saxion-my.sharepoint.com/:f:/g/personal/491270_student_saxion_nl/EnFVT9blIbJOvj55ODvOkEIBSNvSJg4CJN2HHhxTNvUkDQ?e=B7u19m)

[1.2. Code of Conduct](docs/code-of-conduct.md)

[1.3. Git Guidelines](docs/git-guidelines.md)

[1.4. Project plan](docs/project-plan.md)

[1.5. Standup Reports](docs/standups/)

[1.6. Sprint Retorspectives](docs/sprint-retrospectives.md)

[1.7. Sprint 1 Publisher Agreement](docs/sprint-1-agreement.md)

[1.8. Sprint 2 Publisher Agreement](docs/sprint2-agreement.md)

1.9. Sprint 3 Publisher Agreement

## 2. Game Design

[2.1. Game Design Document](docs/game-design.md)

## 3. System documentation

[3.1. Technical design](docs/technical-design.md)

[3.2. Game State Protocol](docs/game-state-protocol.md)

## 4. Instruction Manual

This game project consists of two parts: the game server (backend), which enables the communication between game clients, and the game client itself (frontend). Both are located in their respectively named folders under the `game` directory. This manual will walk you through the necessary software and steps to get both project parts up and running.

___Important_: To work with and start this project, your machine will need to have at least version 17.5.0 of Node.js and NPM installed.__

### 4.1. Server

Navigate to the `game/backend` directory and run the following command to install the necessary node modules:

```cmd
npm i
```

Once the installation completes, run the following command in your terminal:

```cmd
npm start
```

The server will be listening for connections on your local machine under port `3000` by default. You can modify the corresponding value in the `game/backend/.env` file to change the port.

### 4.2. Client (development)

_Note: These steps apply to the development version of the game client and may be changed in the future._

1. Navigate to the `game/frontend` directory and run the following command to install the necessary node modules:

```cmd
npm i
```

2. Once the installation completes, run the following command in your terminal:

```cmd
npm start
```

The client will be accessible on your local machine under port `8080` by default.
