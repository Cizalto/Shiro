import io from 'socket.io-client';
import CryptoJS from 'crypto-js'
let token;
let socket;
let host = "192.168.1.10:8000";

        
//local host
// console.log(socket.id);

function join(username, room){
        console.info("-- Joining --");
        token = 'anon'
        socket = io(host, { query: { token: token }, autoConnect: false  });
        socket.once("success", () => {console.log("-- Connection successful --")})
        socket.open()
        socket.emit('join',username, room)

}

function joinWithAuth(username, password, room){
        if (username === "" || password === "") {
                window.alert("You can't try to connect with an empty name or password")
        }else{
                console.info("-- Joining --");
                token = CryptoJS.SHA256(username+password)
                socket = io(host, { query: { token: token }, autoConnect: false  });
                socket.open()
                socket.token = token
        }
}



export { socket,join,joinWithAuth};
