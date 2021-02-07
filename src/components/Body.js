import React, { useState,useEffect } from 'react';
import Content from './Content';
import ScrollableFeed from 'react-scrollable-feed';
import $ from 'jquery';

function Body(props) {
    const [msg, setMsg] = useState("");
    // const [history, setHistory] = useState([{content: "Start of the history.",sender: 'server', timeStamp: getTimestamp()}]);
    const [userInput, setInput] = useState();
    // const [userList, setUserList] = useState();
    // const [firstLaunch, setFirst] = useState(false);
    const socket = props.soc

    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     if (!firstLaunch) {
    //         socket.on("room-history", (dataObj) =>{
    //             console.log("here's", dataObj.content.name,"history:",dataObj.content.history);
    //             // let messageObj = {
    //             //     userId: null,
    //             //     content: message
    //             // }
    //             setHistory(historyCpy => ([...historyCpy, ...dataObj.content.history]))
    //         })

    //         socket.on("update-userList", (userList) => {
    //             console.log("Here's the userList:",userList);
    //             setUserList(userList)

    //             updateScroll();
    //         })

    //         socket.on('getroomlist', (roomList) =>{
    //             console.log(roomList);
    //         })

    //         socket.on("update", (msgObj) =>{

    //             // let messageObj = {
    //             //     userId: null,
    //             //     content: message
    //             // }
    //             displayUpdate(msgObj)
    //         })

    //         socket.on("chat", (msgObj) => {
    //             console.log("Here's the message Obj:",msgObj);
    //             setHistory(historyCpy => ([...historyCpy, msgObj]))

    //             updateScroll();
    //         })

    //         setFirst(true)
    //     }
    //     function displayUpdate(msgObj){
    //         setHistory(historyCpy => ([...historyCpy, msgObj]))
    //     }


    // }, [history])

    console.log("Body history:",props.history);
    
    function getTimestamp() {
        const options = {
            timeZone:"Etc/GMT-1",
            hour12 : false,
            hour:  "numeric",
            minute: "numeric",seconds:"numeric"
        }
        return new Date().toLocaleTimeString("fr-FR",options)
    }

    function sendMsg() {
        if (msg !== "") {
            console.log("SendMsg:",props.history);
            console.log("SendMsg to room:",props.channel);


            socket.emit("post", msg, props.channel, getTimestamp())
            setMsg("")
            userInput.focus()
        }
    }

    function checkEnter(event) {
        if (event.key === 'Enter') {
            sendMsg();
        } else {

        }
    }

    if (props.autoCompleted !== null){
        if(msg.charAt(msg.length-5) !== "#"){
            setMsg("/msg " + props.autoCompleted);
        }
        userInput.focus();
        props.resetAutoComplete();
    }

    function autoComplete(value) {
        console.log("Valluueeee",value);
        setMsg(value);
        userInput.focus();
    }

    return(
        <div className="chat">
            <div className="content">
                <ScrollableFeed className="feed">
                    <Content messages={props.history} users={props.userList} soc={socket} auto={autoComplete}/>
                </ScrollableFeed>
            </div>
            <div className="textBar">
                <input type="text" ref={(input) => {setInput(input)}} className="inputText" placeholder="Write your text here !" value={msg} onKeyPress={event => checkEnter(event)} onChange={event => setMsg(event.target.value)}></input>
                <button className="send btn" onClick={event => sendMsg(msg)}>Send</button>
            </div>
        </div>
    );
}

export default Body;