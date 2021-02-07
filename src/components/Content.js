import React from 'react';
import slicer from '../Methods/Slicer';


function Content(props) {
    let socket = props.soc

    function msgStacker() {
        let blockArr= [[]];
        let indexBlock = 0;
        props.messages.map(function(msg,index) {
            if (((index > 0 && msg.sender !== props.messages[index-1].sender)
            || (index > 0 && msg.type !== props.messages[index-1].type && msg.sender !== "server")
            || (index > 0 && msg.sender === props.messages[index-1].sender && msg.type === props.messages[index-1].type && msg.sender !== "server" && msg.to !== props.messages[index-1].to))) {
                blockArr = [...blockArr, [msg]];
                indexBlock++
            } else{
                blockArr[indexBlock] = [...blockArr[indexBlock], msg];
            }
        })

        return blockArr;
    }

    function msgUserBuilder(msg,index,length) {
        //selecet TagName
        let tagName = "SlicerUnchanged";
        if (props.users[msg.sender]) {
            tagName = props.users[msg.sender];
        } else if (props.users[socket.token]) {
            tagName = props.users[socket.token];
        } else {
            tagName = msg.userName;
        }

        //Slice TagName
        let user = slicer(tagName);
        let name = user[0];
        let tag = user[1];

        //check whisper
        let footer = "";
        if (msg.type === "whisper") {

            if (msg.to === props.users[socket.id]) {
                footer = tagName + " whispered to you at " + msg.timeStamp;
            } else {
                footer = "Whispered at " + msg.timeStamp + " to " + msg.to;
            }
        } else {
            footer = "Posted at " + msg.timeStamp;
        }

        if (index === 0) {
            if (length === 1) {
               return (
                    <div>
                        <div className="d-flex flex-row msg-header">
                            <div className="msg-user" onClick={event => props.auto("/msg " + tagName + " ")}>{name}</div>
                            <div className="msg-tag">{tag}</div>
                        </div>
                        <div className="msg-body">{msg.content}</div>
                        <div className="msg-footer">
                            {footer}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="d-flex flex-row msg-header">
                            <div className="msg-user" onClick={event => props.auto("/msg " + tagName + " ")}>{name}</div>
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
                    <div className="msg-footer">{footer}</div>
                </div>
            )
        } else {
            return (
                <div className="msg-body">{msg.content}</div>
            )
        }
    }

    function msgServerBuilder(msg,index,length, charDisplay) {
        if (index === 0) {
            if (length === 1) {
                return (
                    <div className="d-flex flex-row">
                        <i class="fas fa-arrow-left"></i>
                        {charDisplay}
                        <div className="body content">{msg.content}</div>
                    </div>
                )
            } else {
                return (
                    <div className="d-flex flex-row">
                        <i class="fas fa-arrow-left"></i>
                        {charDisplay}
                        <div className="body content">{msg.content}</div>
                    </div>
                )
            }
        } else if (index === length-1) {
            return (
                <div className="d-flex flex-row">
                    {charDisplay}
                    <div className="body content">{msg.content}</div>
                </div>
            )
        } else {
            return (
                <div className="d-flex flex-row">
                    {charDisplay}
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
                let charDisplay = null;
                if (msg.type === "join") {
                    charDisplay = (
                        <div className="symbol">{String.fromCharCode(8594)}</div>
                    )
                } else if (msg.type === "leave") {
                    charDisplay = (
                        <div className="symbol">{String.fromCharCode(8592)}</div>
                    )
                }

                return (
                    <div className={msg.type}>
                        {msgServerBuilder(msg, index, block.length, charDisplay)}
                    </div>
                )
            }
        })
    }

    return msgStacker().map(function(block) {
        let msgOrigin;
        let sender = block[0].sender;
        if (sender !== 'server') {
            if (sender === socket.id) {
                msgOrigin = "message self";
            } else {
                msgOrigin = "message other";
            }

            if (block[0].type === "whisper") {
                msgOrigin = "whisper";
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