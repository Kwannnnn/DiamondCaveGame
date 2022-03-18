// This class manages all chat functionality
const rooms = require('./model/rooms.js');

class ChatManager{
    constructor(io){
        this.io = io;
    }

    handleChatMessage(player, message){
        let spectator = false;

        if (rooms.get(player.roomId) === undefined) return;

        // Are we a spectator?
        for (let roomSpectator of rooms.get(player.roomId).spectators){
            if (roomSpectator.id === player.id){
                spectator = true;
                break;
            }
        }
        const data = {
            sender: player.id,
            message: message
        };

        if (!spectator) this.io.to(player.roomId).emit('chatMessage', data); // Not a spectator
        else {
            for (let roomSpectator of rooms.get(player.roomId).spectators) roomSpectator.socket.emit('chatMessage', data); // Is a spectator
        }
        console.log('Sent message from "' + player.id + '": ' + message);
    }
}
    
module.exports = ChatManager;