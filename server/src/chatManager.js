// This class manages all chat functionality
const rooms = require('./model/rooms.js');

class ChatManager{
    constructor(io){
        this.io = io;
    }

    handleChatMessage(player, message){
        let roomID;
        for (let room of player.socket.rooms){
            if (rooms[room] !== undefined) roomID = room;
        }
        //TODO: Implement check for spectators
        const data = {
            sender: player.id,
            message: message
        };
        this.io.to(roomID).emit('chatMessage', data);
        console.log('Sent message from "' + player.id + '": ' + message);
    }
}
    
module.exports = ChatManager;