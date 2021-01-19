import React, { useState,useEffect } from 'react';
import './App.css';
import Channels from './components/Channels';
import Body from './components/Body';
import JoinModal from './components/JoinModal';
import { socket,join,joinWithAuth} from './API/Api';


// class Main extends React.Component {
//   constructor(props){
//     super(props)
//     this.state = {name: null};
//   }

function Main (props){
  const [name, setName] = useState(null);
  const [loggedIn, setLog] = useState(false);
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([{content: "Start of the history.",sender: 'server', timeStamp: getTimestamp()}]);
  const [userInput, setInput] = useState();
  const [userList, setUserList] = useState();
  const [firstLaunch, setFirst] = useState(false);

  function updateScroll(){
    var element = document.getElementsByClassName("content");
    element.scrollTop = element.scrollHeight;
  }

  function getTimestamp() {
    const options = {
        timeZone:"Etc/GMT-1",
        hour12 : false,
        hour:  "numeric",
        minute: "numeric",seconds:"numeric"
    }
    return new Date().toLocaleTimeString("fr-FR",options)
}

  // ---------------------------------------------------------------|| Functions to display messages and get Infos ||
  useEffect(() => {
    console.log("useEffect triggered");
    if (!firstLaunch && loggedIn) {
        socket.on("room-history", (dataObj) =>{
            console.log("here's", dataObj.content.name,"history:",dataObj.content.history);
            setHistory(historyCpy => ([...historyCpy, ...dataObj.content.history]))
        })

        socket.on("update-userList", (userList) => {
            console.log("Here's the userList:",userList);
            setUserList(userList)

            updateScroll();
        })

        socket.on('getroomlist', (roomList) =>{
            console.log(roomList);
        })

        socket.on("update", (msgObj) =>{
            displayUpdate(msgObj)
        })

        socket.on("chat", (msgObj) => {
            console.log("Here's the message Obj:",msgObj);
            setHistory(historyCpy => ([...historyCpy, msgObj]))

            updateScroll();
        })

        socket.on("rick", () => {
          var audio = new Audio('http://epitech.justmeandi.net/music/music.mp3');
          audio.play();
      })

        setFirst(true)
    }
    function displayUpdate(msgObj){
        setHistory(historyCpy => ([...historyCpy, msgObj]))
    }


}, [history, loggedIn])
  // ---------------------------------------------------------------|| End ||


  // ---------------------------------------------------------------|| Functions to join the server ||
  function joinServer (userName, room){
    console.info("Attempting to Join the chat as", userName);
    setName(userName)
    join(userName, room)
    setLog(true);
  }
  
  function joinServerWithAuth(userName, password, room){
    console.info("Attempting to Join the chat as", userName);
    setName(userName)
    joinWithAuth(userName,password, room)
    socket.once("success", () => {
            console.log("-- Connection successful --");
            setLog(true);
    })
    socket.once("noaccount", () => {
            console.log("-- No account found --")
            socket.disconnect()
    })
    console.log(userName);
    socket.emit('join',userName, room)
  }

  // ---------------------------------------------------------------|| End ||


      if (loggedIn){
        return (
          <div className="main">
            <Channels soc={socket} history={history} userList={userList}/>
          </div>
        )
      }else {
        return (
          <div className="main">
            <JoinModal joinAs={joinServer} joinWithAuth={joinServerWithAuth}/>
          </div>
        )
      }
}

export default Main;