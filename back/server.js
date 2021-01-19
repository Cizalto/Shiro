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
    let index = roomList.findIndex(i => i.name === room)
    console.log("Getting", room, 'history:', roomList[index].history);
    return roomList[index]
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
        roomList.forEach(function (element, index) {
            if (element.name === room) {
                roomList[index].history = [...roomList[index].history, content]
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
        client.on('join', (name, room) => {
            client.join(room)
            client.emit("success")
            if (!userList[client.token]){userList[client.token] = name}
            console.log(userList[client.token], "joined the Chat !");
            let roomObj = getHistory(room)
            send("update-userList", userList, null, 'server', 'data');
            client.emit("room-history", { content: roomObj, sender: 'server', timeStamp: getTimestamp(), type: "data" });
            client.emit("update", { content: `You're connected to ${room}`, sender: 'server', timeStamp: getTimestamp() });
            send("update", name + " joined the server.", room, 'server', 'join');

            // io.to(room).emit("update-userList", userList);
            console.log('User', client.id, 'with the name', name, 'just joined the server', room);
        });

        client.on("post", (msg, room, timeStamp) => {
            // msgObj.userName = userList[client.token];
            console.log("Here's what the message looks like on the server:", msg);

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
                        client.emit('update', { content: "You changed your name from " + lastNick + " to " + userList[client.token], sender: 'server', timeStamp: getTimestamp() })
                        break;
                    case 'list':
                        if (cmdArr.length > 1) {
                            let roomList_filtered = []
                            roomList.forEach(element => {
                                if (element.name.includes(cmdArr[1])) {
                                    roomList_filtered = [...roomList_filtered, element.name]
                                }
                            })
                            client.emit('getroomlist',)
                            client.emit('update', { content: 'Channel containing' + cmdArr[1] + ' availables: ' + roomList_filtered, sender: 'server', timeStamp: getTimestamp() })
                        } else {
                            let roomList_string = []
                            roomList.forEach(element => {
                                roomList_string = [...roomList_string, element.name]
                            })
                            client.emit('update', { content: 'Channel availables: ' + roomList_string, sender: 'server', timeStamp: getTimestamp() })
                        }
                        break;
                    case 'create':
                        roomList = [...roomList, { name: cmdArr[1], history: [] }]
                        client.emit('update', { content: 'The channel ' + cmdArr[1] + ' has been created succesfully', sender: 'server', timeStamp: getTimestamp() })
                        break;
                    case 'delete':
                        let index = roomList.findIndex(i => i.name === cmdArr[1])
                        if (index > 0) {
                            roomList.splice(index, 1)
                            client.emit('update', { content: 'The channel ' + cmdArr[1] + ' has been deleted succesfully', sender: 'server', timeStamp: getTimestamp() })
                        } else if (index < 0) {
                            client.emit('update', { content: 'The channel you tried to remove doesn\'t exist', sender: 'server', timeStamp: getTimestamp() })
                        } else {
                            client.emit('update', { content: 'You can\'t remove the main channel from the server', sender: 'server', timeStamp: getTimestamp() })
                        }
                        break;
                    case 'join':
                        if (roomList.findIndex(i => i.name === cmdArr[1]) >= 0) {
                            client.join(cmdArr[1])
                            client.emit('update', { content: 'You joined ' + cmdArr[1], sender: 'server', timeStamp: getTimestamp() })
                            client.emit("room-history", { content: getHistory(cmdArr[1]), sender: 'server', timeStamp: getTimestamp(), type: "data" });
                        } else {
                            client.emit('update', { content: 'The channel you tried to join doesn\'t exist', sender: 'server', timeStamp: getTimestamp() })
                        }
                        break;
                    case 'quit':
                        console.log(client.rooms);
                        if (cmdArr[1] === 'general') {
                            client.emit('update', { content: 'You can\'t leave the main channel', sender: 'server', timeStamp: getTimestamp() })
                        } else if (client.rooms.has(cmdArr[1])) {
                            client.leave(cmdArr[1])
                            client.emit('update', { content: 'You left ' + cmdArr[1], sender: 'server', timeStamp: getTimestamp() })
                        } else {
                            client.emit('update', { content: 'You can\'t leave a channel you never joined', sender: 'server', timeStamp: getTimestamp() })
                        }
                        break;
                    case 'users':
                        console.log(io.sockets.adapter.rooms.get('general'));
                        let userListInClientRoom = [];
                        io.sockets.adapter.rooms.get(room).forEach(user => userListInClientRoom.push(userList[user]));
                        client.emit('update', { content: 'List of users connected to ' + room + ': ' + userListInClientRoom.join(', '), sender: 'server', timeStamp: getTimestamp() })
                        break;
                    case 'token':
                        console.log(client.token);
                        break;
                        case 'admin':
                            io.emit('rick')
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
                        send("update", userList[client.token] + " has left the server", null, 'server', 'leave')
                        delete userList[client.token]
                        send("update-userList", userList, null, 'server', 'data');
        })

})

const port = 8000;
io.listen(port);
console.log("Listening on port", port);
