const { Server, Socket } = require("socket.io");
const io = require('socket.io')({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
var token;
var userList = {};
var roomList = [{ name: 'general', history: [] }]
var rooms ={roomList:['général'],général:{name: 'général',history: []}}

io.use(function(socket, next) {
    token = socket.request._query.token
    if (token === "anon"){
        token = socket.id
    }else{
        if (!userList[token]){
            console.log("Unregistered User Attempted to login");
            // socket.emit("noAccount")
            // return null
        }
    }

    
    next();
  });

const session_handler = require('io-session-handler').from(io)



function getHistory(room) {
    console.log("Getting", room, 'history:', rooms[room].history);
    return rooms[room]
}

function getTimestamp() {
    const options = {
        timeZone: "Etc/GMT-1",
        hour12: false,
        hour: "numeric",
        minute: "numeric", seconds: "numeric"
    }
    return new Date().toLocaleTimeString("fr-FR", options)
}

function send(event, content, room, sender, type, timeStamp) {
    timeStamp = timeStamp || getTimestamp();
    room = room || null;
    type = type || "message";
    sender = sender || "server";
    let userName = userList[sender] || null;
    content = {
        content: content,
        type: type,
        sender: sender,
        room: room,
        timeStamp: timeStamp,
        userName: userName
    };
    if (room != null) {
        io.to(room).emit(event, content);
        rooms.roomList.forEach(function (element, index) {
            if (element === room) {
                rooms[room].history = [...rooms[room].history, content]
                return null;
            }
        })
    } else {
        io.emit(event, content);
    }
}






    io.on('connection', (client) => {
        client.token = token
        console.log('A user connected with id: ' + client.id);
        client.on('first-join', (name, room) => {
            client.join(room)
            client.emit("success")
            if (!userList[client.token]){userList[client.token] = name}
            console.log(userList[client.token], "joined the Chat !");
            let roomObj = getHistory(room)
            send("update-userList", userList, null, 'server', 'data');
            client.emit("room-history", { content: roomObj, sender: 'server', timeStamp: getTimestamp(), type: "data" });
            client.emit("update", { content: `You're connected to ${room}`, sender: 'server',room: room, timeStamp: getTimestamp() });
            send("update", name + " joined the server.", room, 'server', 'join');

            // io.to(room).emit("update-userList", userList);
            console.log('User', client.id, 'with the name', name, 'just joined the server', room);
        });

        client.on("post", (msg, room, timeStamp) => {
            // msgObj.userName = userList[client.token];
            console.log("Here's what the message sending to",room,"looks like on the server:", msg);

            //========================== Cheking if the message is a command ==========================
            if (msg.charAt(0) === "/") {
                var cmdArr = msg.slice(1).split(" ");
                console.log("User typed the command", cmdArr[0], "with the parameter", cmdArr[1]);
                //========================== if it's a command do something ==========================
                switch (cmdArr[0]) {
                    case 'nick':
                        let newNick = cmdArr[1];
                        console.log(newNick);
                        if (cmdArr.length > 2) {
                            newNick += " ";
                            for (let i = 2; i <= cmdArr.length - 1; i++) {
                                if (i === cmdArr.length - 1) {
                                    newNick += cmdArr[i];
                                } else {
                                    newNick += cmdArr[i] + " ";
                                }
                            }
                        }
                        console.log('changing', client.id, 'name to', newNick);
                        let lastNick = userList[client.token]
                        userList[client.token] = newNick;
                        send("update-userList", userList, null, 'server', 'data');
                        client.emit('update', { content: "You changed your name from " + lastNick + " to " + userList[client.token], sender: 'server',room: room, timeStamp: getTimestamp() })
                        break;
                    case 'list':
                        if (cmdArr.length > 1) {
                            let roomList_filtered = []
                            rooms.roomList.forEach(element => {
                                if (element.includes(cmdArr[1])) {
                                    roomList_filtered = [...roomList_filtered, element]
                                }
                            })
                            client.emit('getroomlist',)
                            client.emit('update', { content: 'Channel containing' + cmdArr[1] + ' availables: ' + roomList_filtered, sender: 'server',room: room, timeStamp: getTimestamp() })
                        } else {
                            let roomList_string = []
                            rooms.roomList.forEach(element => {
                                roomList_string = [...roomList_string, element]
                            })
                            client.emit('update', { content: 'Channel availables: ' + roomList_string, sender: 'server',room: room, timeStamp: getTimestamp() })
                        }
                        break;
                    case 'create':
                        if (!rooms.roomList.find(i => i === cmdArr[1])) {
                            rooms.roomList = [...rooms.roomList, cmdArr[1]]
                            rooms[cmdArr[1]] = {}
                            rooms[cmdArr[1]].history = []
                            rooms[cmdArr[1]].name = cmdArr[1]
                            client.join(cmdArr[1])
                            client.emit('update', { content: 'The channel ' + cmdArr[1] + ' has been created succesfully', sender: 'server',room: room, timeStamp: getTimestamp() })
                            // client.emit('update-channel', {room:cmdArr[1],history:[{content: "Welcome to "+cmdArr[1]+".",sender: 'server', timeStamp: getTimestamp()}]})
                            client.emit("room-history", { content: getHistory(cmdArr[1]), sender: 'server',room: room, timeStamp: getTimestamp(), type: "data" });
                        }else{
                            client.emit('update', { content: 'The channel you tried to create already exist, type "/join '+ cmdArr[1] +'" to join this channel.', sender: 'server',room: room, timeStamp: getTimestamp() }) 
                        }
                        
                        break;
                    case 'delete':
                        let index = rooms.roomList.findIndex(i => i === cmdArr[1])
                        if (index > 0) {
                            rooms.roomList.splice(index, 1)
                            client.emit('update', { content: 'The channel ' + cmdArr[1] + ' has been deleted succesfully', sender: 'server',room: room, timeStamp: getTimestamp() })
                        } else if (index < 0) {
                            client.emit('update', { content: 'The channel you tried to remove doesn\'t exist', sender: 'server',room: room, timeStamp: getTimestamp() })
                        } else {
                            client.emit('update', { content: 'You can\'t remove the main channel from the server', sender: 'server',room: room, timeStamp: getTimestamp() })
                        }
                        break;
                    case 'join':
                        if (rooms.roomList.findIndex(i => i === cmdArr[1]) >= 0) {
                            let alreadyIn = false;
                            console.log(io.sockets.adapter.rooms);
                            if(io.sockets.adapter.rooms.get(cmdArr[1])){
                            io.sockets.adapter.rooms.get(cmdArr[1]).forEach(clientId => {if (clientId === client.id) {
                                console.log("Client in the room:",clientId,"||","Client tested:",client.id);
                                alreadyIn = true
                            }})}
                            if(alreadyIn && io.sockets.adapter.rooms.has(cmdArr[1])){
                                client.emit('update', { content: 'You can\'t join a channel you\'re already in.', sender: 'server',room: room, timeStamp: getTimestamp() })
                            }else{
                                client.join(cmdArr[1])
                                client.emit('update', { content: 'You joined ' + cmdArr[1], sender: 'server',room: room, timeStamp: getTimestamp() })
                                client.emit("room-history", { content: getHistory(cmdArr[1]), sender: 'server',room: room, timeStamp: getTimestamp(), type: "data" });
                            }
                        } else {
                            client.emit('update', { content: 'The channel you tried to join doesn\'t exist', sender: 'server',room: room, timeStamp: getTimestamp() })
                        }
                        break;
                    case 'quit':
                        console.log(client.rooms);
                        if (cmdArr[1] === 'general') {
                            client.emit('update', { content: 'You can\'t leave the main channel', sender: 'server', timeStamp: getTimestamp() })
                        } else if (client.rooms.has(cmdArr[1])) {
                            client.emit('quit-channel', { content: cmdArr[1], sender: 'server', timeStamp: getTimestamp() })
                            client.emit('update', { content: 'You left ' + cmdArr[1], sender: 'server', timeStamp: getTimestamp() })
                            client.leave(cmdArr[1])
                        } else {
                            client.emit('update', { content: 'You can\'t leave a channel you never joined', sender: 'server', timeStamp: getTimestamp() })
                        }
                        break;
                    case 'users':
                        console.log(io.sockets.adapter.rooms.get('general'));
                        let userListInClientRoom = [];
                        io.sockets.adapter.rooms.get(room).forEach(user => userListInClientRoom.push(userList[user]));
                        client.emit('update', { content: 'List of users connected to ' + room + ': ' + userListInClientRoom.join(', '), sender: 'server',room: room, timeStamp: getTimestamp() })
                        break;
                    case 'token':
                        console.log(client.token);
                        break;
                        case 'admin':
                            io.emit('rick')
                        break;
                        case 'test':
                            
                        break;
                    default:
                        console.log(`default`);
                        break;

                }
            } else {
                //========================== else send the message normally ==========================
                send("chat", msg, room, client.id, 'message', timeStamp);
                // io.to("general").emit("chat",msg);
            }

        });

        client.on("disconnect", function () {
                        console.log(client.id,"left the server.")
                        send("update", userList[client.token] + " has left the server", 'général', 'server', 'leave')
                        
                        delete userList[client.token]
                        send("update-userList", userList, null, 'server', 'data');
        })

})

const port = 8000;
io.listen(port);
console.log("Listening on port", port);
