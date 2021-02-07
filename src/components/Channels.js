import React, { useState, useEffect } from 'react';
import Body from './Body';
import Menu from './Menu';

function Channels(props) {
    let socket = props.soc;

    const [currentChannel, setCurrentChannel] = useState('général');
    const [activeChannel, setActiveChannel] = useState([false, true]);
    const [channels, setChannels] = useState(props.channels)
    const [userToSendAMessage, setuserNameToSendAMessage] = useState(null)

    var channelList = [
        {
            id: 'général',
            label: 'général',
            content: (
                <div className="channel-content">
                    <Body soc={socket} active={activeChannel[0]} history={channels[channels.channelList[0]].history} channel={channels.channelList[0]} userList={channels[channels.channelList[0]].userList} autoCompleted={userToSendAMessage} resetAutoComplete={resetAutoComplete}/>
                </div>
            )
        }
    ];

    function addChannel() {
        for (let i = 1; i < channels.channelList.length; i++) {
            console.log("For loop count", i);
            console.log("Channel List", channels.channelList);
            var newChannel = {
                id: channels.channelList[i],
                label: channels[channels.channelList[i]].name,
                content: (
                    <div className="channel-content">
                        <Body soc={socket} active={activeChannel[1]} history={channels[channels.channelList[i]].history} channel={channels.channelList[i]} userList={channels[channels.channelList[i]].userList} autoCompleted={userToSendAMessage} resetAutoComplete={resetAutoComplete}/>
                    </div>
                )
            };
            channelList = [...channelList, newChannel];
        }
    }

    function autoCompleteFromMenu(user) {
        setuserNameToSendAMessage(user)
    }

    function resetAutoComplete(){
        setuserNameToSendAMessage(null)
    }

    if (channels !== props.channels) {
        setChannels(props.channels)
    }

    if (props.channels.channelList.length > channelList.length) {
        addChannel();
    }

    if (!props.channels.channelList.some((element) => element === currentChannel)) {
        setCurrentChannel("général");
    }

    //channel log
    // console.log('====================================');
    // console.log("The actual Channel count:",props.channels.channelList.length);
    // console.log("The displayed channel count:",channelList.length);
    // console.log("The react component Channel list:",channelList);
    // console.log('====================================');

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

    function showButtonNotification(channelID) {
        let notif = channels[channelID].unread;
        if (notif !== undefined) {
            if (notif === true) {
                if (channelID === currentChannel) {
                    props.updateNotifs(channelID);
                    return null
                } else {
                    return (
                        <p className="symbol">{String.fromCharCode("9679")}</p>
                    )
                }
            } else {
                return (
                    null
                )
            }
        } else {
            return null
        }
    }

    function showCross(label, id) {
        if (label === "général") {
            return null
        } else {
            return (
                <button className="btn delete" onClick={() => { socket.emit("post", "/quit " + label, id, null) }}>&times;</button>
            )
        }
    }

    //history log
    console.log('====================================');
    console.log("Channels history", props.channels);
    console.log('====================================');

    //return jsx
    return (
        <div className="d-flex flex-column flex-grow-1">
            {/* Create channel tabs */}
            <div className="channels">
                {
                    channelList.map((channel, i) => (
                        <button
                            key={i}
                            onClick={() => { updateChannel(channel.id); props.updateNotifs(channel.id) }}
                            className={(channel.id === currentChannel) ? 'btn channel active' : 'btn channel'}>
                            {showButtonNotification(channel.id)}
                            <p>{channel.label}</p>
                            {showCross(channel.label, channel.id)}
                        </button>
                    ))
                }
            </div>

            {/* Display channel content */}
            {
                channelList.map((channel, i) => {

                    if (channel.id === currentChannel) {
                        return (
                            <div className="frame">
                                <div className="d-flex flex-column flex-grow-1" key={i}>
                                    {channel.content}
                                </div>
                                <Menu title="Connected Users" userlist={props.channels[currentChannel].userList} autoCompleteFromMenu={autoCompleteFromMenu} socket={socket} />
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