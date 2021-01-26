import React from 'react';
import slicer from '../Methods/Slicer';


function Content(props) {
    let socket = props.soc

    function msgStacker() {
        let blockArr= [[]];
        let indexBlock = 0;
        props.messages.map(function(msg,index) {
            if ((index > 0 && msg.sender !== props.messages[index-1].sender)){
                blockArr = [...blockArr, [msg]];
                indexBlock++
            } else{
                blockArr[indexBlock] = [...blockArr[indexBlock], msg];
            }
        })

        return blockArr;
    }

    function msgUserBuilder(msg,index,length) {
        let tagName;
        if (props.users[msg.sender]) {
            tagName = props.users[msg.sender];
            console.log("user connected", props.users[msg.sender])
        } else if (props.users[socket.token]) {
            tagName = props.users[socket.token];
        } else {
            tagName = msg.userName;
        }

        let user = slicer(tagName);
        let name = user[0];
        let tag = user[1];

        if (index === 0) {
            if (length === 1) {
               return (
                    <div>
                        <div className="d-flex flex-row msg-header">
                            <div className="msg-user">{name}</div>
                            <div className="msg-tag">{tag}</div>
                        </div>
                        <div className="msg-body">{msg.content}</div>
                        <div className="msg-footer">Posted at {msg.timeStamp}</div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="d-flex flex-row msg-header">
                            <div className="msg-user">{name}</div>
                            <div className="msg-tag">{tag}</div>
                        </div>
                        <div className="msg-body">{msg.content}</div>
                    </div>
                )
            }
        } else if (index === length-1) {
            return (
                <div>
                    <div className="msg-body">{msg.content}</div>
                    <div className="msg-footer">Posted at {msg.timeStamp}</div>
                </div>
            )
        } else {
            return (
                <div className="msg-body">{msg.content}</div>
            )
        }
    }

    function msgServerBuilder(msg,index,length, char) {
        if (index === 0) {
            if (length === 1) {
                return (
                    <div className="d-flex flex-row">
                        <div className="symbol">{String.fromCharCode(char)}</div>
                        <div className="body content">{msg.content}</div>
                    </div>
                )
            } else {
                return (
                    <div className="d-flex flex-row">
                        <div className="symbol">{String.fromCharCode(char)}</div>
                        <div className="body content">{msg.content}</div>
                    </div>
                )
            }
        } else if (index === length-1) {
            return (
                <div className="d-flex flex-row">
                    <div className="symbol">{String.fromCharCode(char)}</div>
                    <div className="body content">{msg.content}</div>
                </div>
            )
        } else {
            return (
                <div className="d-flex flex-row">
                    <div className="symbol">{String.fromCharCode(char)}</div>
                    <div className="body content">{msg.content}</div>
                </div>
            )
        }
    }

    function msgTypeChecker(block, msgOrigin) {
        return block.map(function(msg, index) {
            if (msgOrigin !== 'info') {
                return (
                    <div>
                        {msgUserBuilder(msg, index, block.length)}
                    </div>
                )
            } else {
                let char = null;
                if (msg.type === "join") {
                    char = "8594";
                } else if (msg.type === "leave") {
                    char = "8592";
                }

                return (
                    <div className={msg.type}>
                        {msgServerBuilder(msg, index, block.length, char)}
                    </div>
                )
            }
        })
    }

    return msgStacker().map(function(block) {
        let msgOrigin;
        let sender = block[0].sender;
        console.log("msg sender",sender);
        if (sender !== 'server') {
            if (sender === socket.id) {
                msgOrigin = "message self";
            } else {
                msgOrigin = "message other";
            }
        } else {
            msgOrigin = "info";
        }
        return (
        <div className={msgOrigin}>
            <div className="msg">
                {msgTypeChecker(block, msgOrigin)}
            </div>
        </div>
        )
    })
}

export default Content;