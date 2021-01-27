import React, { useState,useEffect } from 'react';
import Body from './Body';
import Menu from './Menu';

function Channels(props) {
    let socket = props.soc;

    const [currentChannel, setCurrentChannel] = useState('général');
    const [activeChannel, setActiveChannel] = useState([false,true]);
    const [channels, setChannels] = useState(props.channels)

    var channelList = [
        {
            label: 'général',
            content: (
                <div className="channel-content">
                    <Body soc={socket} active={activeChannel[0]} history={channels[channels.channelList[0]].history} channel={channels.channelList[0]} userList={channels[channels.channelList[0]].userList}/>
                </div>
            )
        }
    ];

    function addChannel() {
        for (let i = 1; i <channels.channelList.length; i++ ){
            console.log("For loop count", i);
            var newChannel =  {
                label: channels.channelList[i],
                content: (
                    <div className="channel-content">
                        <Body soc={socket} active={activeChannel[1]} history={channels[channels.channelList[i]].history} channel={channels.channelList[i]} userList={channels[channels.channelList[i]].userList}/>
                    </div>
                )
            };
            channelList = [...channelList, newChannel];
        }
    }

    if (channels !== props.channels){
        setChannels(props.channels)
    }

    if (props.channels.channelList.length>channelList.length) {
        addChannel();
    }

    //channel log
    console.log('====================================');
    console.log("The actual Channel count:",props.channels.channelList.length);
    console.log("The displayed channel count:",channelList.length);
    console.log("The react component Channel list:",channelList);
    console.log('====================================');

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

    function showButtonNotification(label) {
        if (label !== currentChannel) {
            return (
                <p className="symbol">{String.fromCharCode("9679")}</p>
            )
        } else {
            return (
                null
            )
        }
    }

    //history log
    console.log('====================================');
    console.log("Channels history", props.channels);
    console.log('====================================');

    //return jsx
    return(
        <div className="d-flex flex-column flex-grow-1">
            {/* Create channel tabs */}
            <div className="channels">
                {
                    channelList.map((channel, i) => (
                        <button
                            key={i}
                            onClick={() => updateChannel(channel.label)}
                            className={(channel.label === currentChannel) ? 'btn channel active' : 'btn channel'}>
                                <p>{channel.label}</p>
                                {showButtonNotification(channel.label)}
                        </button>
                    ))
                }
            </div>

            {/* Display channel content */}
            {
                channelList.map((channel, i) => {

                    if (channel.label === currentChannel) {
                        return (
                            <div className="frame">
                                <div className="d-flex flex-column flex-grow-1" key={i}>
                                    {channel.content}
                                </div>
                                <Menu title="Connected Users" userlist={props.channels[currentChannel].userList} socket={socket.id}/>
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