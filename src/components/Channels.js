import React, { useState } from 'react';
import Body from './Body';

function Channels(props) {
    let socket = props.soc;

    const [currentChannel, setCurrentChannel] = useState('Général');
    const [activeChannel, setActiveChannel] = useState([false,true]);
    // const [userList, setUserList] = useState(props.userList);
    console.log("Props Userlist",props.userList);

    var channelList = [
        {
            label: 'Général',
            content: (
                <div className="channel-content">
                    <Body soc={socket} active={activeChannel[0]} history={props.history} userList={props.userList}/>
                </div>
            )
        },
        {
            label: 'Channel 2',
            content: (
                <div className="channel-content">
                    <Body soc={socket} active={activeChannel[1]} history={props.history} userList={props.userList}/>
                </div>
            )
        }
    ];

    function addChannel(label) {
        var newChannel = {
            label: label,
            content: (
                <div className="channel-content">
                    <p>{label}</p>
                </div>
            )
        };

        channelList = [...channelList, newChannel];
    }

    function updateChannel(label) {
        setCurrentChannel(label);

        channelList.map((channel, index) => {
            let activeChannel_cpy = activeChannel;
            if (channel.label === label) {
                activeChannel_cpy[index] = false;
            } else {
                activeChannel_cpy[index] = true;
            }
            setActiveChannel(activeChannel_cpy);
            return null
        })
    }

    function removeChannel() {

    }

    function displayConnectedUsers() {
        console.log("Displaying", props.userList);
        if (props.userList != undefined) {
            console.log("Entries before",Object.entries(props.userList.content))
            var content = [];
            for(const [key,value] of Object.entries(props.userList.content)) {
                console.log("Entries",props.userList.content);
                console.log("Value", value);
                console.log("Content",content);
                content[key] = (
                    <div className="username">
                        {value}
                    </div>
                )
                console.log("Content",content);
                // return content
            }
            // return content
            content.forEach(element => {
                console.log("Element",element);
                // return element;
            });
        } else {
            console.log("No user to display");
            return null;
        }
    }

    return(
        <div className="d-flex flex-column flex-grow-1">
            <div className="channels">
                {
                    channelList.map((channel, i) => (
                        <button
                            key={i}
                            onClick={() => updateChannel(channel.label)}
                            className={(channel.label === currentChannel) ? 'btn channel active' : 'btn channel'}>
                                {channel.label}
                        </button>
                    ))
                }
                <button className="btn add channel" onClick={addChannel("Chan oni")}>
                    +
                </button>
            </div>

            {
                channelList.map((channel, i) => {

                    if (channel.label === currentChannel) {
                        console.log("activeChannel[0]: ",activeChannel[0]);
                        console.log("activeChannel[1]: ",activeChannel[1]);
                        return (
                            <div className="frame">
                                <div className="d-flex flex-column flex-grow-1" key={i}>
                                    {channel.content}
                                </div>
                                <div className="menu">
                                    <div className="title">
                                        Connected Users
                                    </div>
                                    <div className="userlist">
                                        {displayConnectedUsers()}
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return null;
                    }
                })
            }
        </div>
    );
}

export default Channels;