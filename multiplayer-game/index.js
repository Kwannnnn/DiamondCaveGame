const express = require("express")
const io=require('socket.io')(3000) //might occur cors problem

var app = express()

app.get("/",function(request,response){
    response.send("Hello World!")
})
app.listen(3000, function () {
console.log("Started application on port %d", 3000)
});

io.on('connection',socket=>{
    console.log(socket.id);
}) //whenever there is a new client who tries to connect to server, creates a new socket for him with unique id