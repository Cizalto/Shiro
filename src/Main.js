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
  const [history, setHistory] = useState([{content: "Welcome to Général.",sender: 'server', timeStamp: getTimestamp()}]);
  const [channels, setChannels] = useState({channelList:['général'],général:{room: 'général',history:[{content: "Welcome to Général.",sender: 'server', timeStamp: getTimestamp()}]}});
  const [userInput, setInput] = useState();
  const [userList, setUserList] = useState();
  const [firstLaunch, setFirst] = useState(false);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

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
            let channels_cpy = channels
            if (dataObj.content.name == 'général') {
              channels_cpy.channelList = [dataObj.content.name]
            }else if (channels_cpy.channelList.find(element => element = dataObj.content.name) !== dataObj.content.name ){
              channels_cpy.channelList = [...channels_cpy.channelList,dataObj.content.name]
            }
            channels_cpy[dataObj.content.name] = {}
            channels_cpy[dataObj.content.name].room = dataObj.content.name 
            channels_cpy[dataObj.content.name].history = [{content: "Welcome to "+dataObj.content.name,sender: 'server', timeStamp: getTimestamp()},...dataObj.content.history]
            channels_cpy[dataObj.content.name].userList = {...dataObj.content.userList}
            setChannels(channels_cpy)
            setHistory(historyCpy => ([...historyCpy, ...dataObj.content.history]))
            console.log('====================================');
            console.log("Channel object at start:",channels);
            console.log('====================================');
        })

        // socket.on("update-channel", (channel) => {
        //     let channels_cpy = channels
        //     channels_cpy.channelList = [...channels_cpy.channelList, channel.room]
        //     channels_cpy[channel.room] = {}
        //     channels_cpy[channel.room].room = channel.room 
        //     channels_cpy[channel.room].history = channel.history
        //     channels_cpy[channel.room].userList = channel.userList
        //     setChannels(channels_cpy)
        //     console.log("Here's the",channel.room+" history:",channel.history);
        //     console.log('====================================');
        //     console.log("Channels:", channels);
        //     console.log('====================================');
        // })

        socket.on("update-channel-users", (channel) => {
          console.log("This is the channel wich got a userList update:",channel);
            let channels_cpy = channels
            channels_cpy[channel.name].userList = channel.userList
            setChannels(channels_cpy)
            console.log("Here's the",channel.name+" userList:",channel.userList);
            console.log('====================================');
            console.log("Channels:", channels);
            console.log('====================================');
        })

        socket.on('quit-channel', (channelObj) => {
          let channels_cpy = channels
          channels_cpy.channelList.splice(channels_cpy.channelList.findIndex((element) => element === channelObj.content), 1)
          delete channels_cpy[channelObj.content]
          forceUpdate();
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
            let channels_cpy = channels
            channels_cpy[msgObj.room].history = [...channels_cpy[msgObj.room].history, msgObj]
            setChannels(channels_cpy)
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
        console.log("Here's the message Obj:",msgObj);
        let room
        if (msgObj.room !== null && msgObj.room !== undefined) {
          room = msgObj.room
        } else {
          room = 'général'
        }
        console.log("The room i'm gonna display the message is", room);
        let channels_cpy = channels
        channels_cpy[room].history = [...channels_cpy[room].history, msgObj]
        setChannels(channels_cpy)
        console.log("Here's the channels:",channels);
        setHistory(historyCpy => ([...historyCpy, msgObj]))
    }


}, [channels, firstLaunch, history, loggedIn])
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
    joinWithAuth(userName,password)
    socket.once("success", () => {
            console.log("-- Connection successful --");
            setLog(true);
    })
    socket.once("noaccount", () => {
            console.log("-- No account found --")
            socket.disconnect()
    })
    console.log(userName);
    socket.emit('first-join',userName, room)
  }

  // ---------------------------------------------------------------|| End ||


      if (loggedIn){
        return (
          <div className="main">
            <Channels soc={socket} history={history} userList={userList} channels={channels} loggedIn={loggedIn}/>
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