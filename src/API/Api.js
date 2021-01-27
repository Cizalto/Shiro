import io from 'socket.io-client';
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid';
let token;
let socket;
const uuid = uuidv4();
let host = "https://shi-ro-server.herokuapp.com/";

//local host
// console.log(socket.id);

function join(username, room){
        console.info("-- Joining --");
        token = 'anon'
        socket = io(host, { query: { token: token, uuid: uuid, username:username }, autoConnect: false});
        socket.once("success", () => {console.log("-- Connection successful --")})
        socket.open()
        socket.emit('first-join',username, room)

}

function joinWithAuth(username, password){
        if (username === "" || password === "") {
                window.alert("You can't try to connect with an empty name or password")
        }else{
                console.info("-- Joining --");
                token = CryptoJS.SHA256(username+password)
                socket = io(host, { query: { token: token, uuid: uuid, username:username }, autoConnect: false  });
                socket.open()
                socket.token = token
        }
}



export { socket,join,joinWithAuth};
