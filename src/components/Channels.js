import React, { useState,useEffect } from 'react';
import Body from './Body';

function Channels(props) {
    let socket = props.soc;

    const [currentChannel, setCurrentChannel] = useState('Général');
    const [activeChannel, setActiveChannel] = useState([false,true]);
    const [channels, setChannels] = useState(props.channels)
    const [count, setCount] = useState(1)
    
    var channelList = [
        {
            label: 'Général',
            content: (
                <div className="channel-content">
                    <Body soc={socket} active={activeChannel[0]} history={channels[channels.channelList[0]].history} channel={channels.channelList[0]} userList={props.userList}/>
                </div>
            )
        }
        // {
        //     label: 'Channel 2',
        //     content: (
        //         <div className="channel-content">
        //             <Body soc={socket} active={activeChannel[1]} history={channels[channels.channelList[1]].history} channel={channels.channelList[1]} userList={props.userList}/>
        //         </div>
        //     )
        // }
    ];

        function addChannel() {
            for (let i = 1; i <channels.channelList.length; i++ ){
                console.log("For loop count", i);
                var newChannel =  {
                    label: channels.channelList[i],
                    content: (
                        <div className="channel-content">
                            <Body soc={socket} active={activeChannel[1]} history={channels[channels.channelList[i]].history} channel={channels.channelList[i]} userList={props.userList}/>
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

    function removeChannel() {

    }

    function displayConnectedUsers() {
        console.log("Displaying", props.userList);
        if (props.userList != undefined) {
            console.log("Entries before",Object.entries(props.userList.content))
            var content = [];
            let count = 0;
            for(const [key,value] of Object.entries(props.userList.content)) {
                console.log("Entries",Object.entries(props.userList.content));
                console.log("Value", value);
                console.log("Content",content);
                content[count] = (
                    <div className="username">
                        {value}
                    </div>
                )
                console.log("Content",content);
                count++;
                // return content
            }
            
            return content.map(element => {
                console.log("Element",element);
                return element;
            });
        } else {
            console.log("No user to display");
            return null;
        }
    }

    function showButtonNotification() {
        let notif = [false,true];
        return channelList.map((index) => {
            if (notif[index] === true) {
                return (
                    <p className="symbol">{String.fromCharCode("9679")}</p>
                )
            } else {
                return (
                    null
                )
            }
        })
    }

    console.log('====================================');
    console.log("Channels history", props.channels);
    console.log('====================================');

    return(
        <div className="d-flex flex-column flex-grow-1">
            <div className="channels">
                {
                    channelList.map((channel, i) => (
                        <button
                            key={i}
                            onClick={() => updateChannel(channel.label)}
                            className={(channel.label === currentChannel) ? 'btn channel active' : 'btn channel'}>
                                <p>{channel.label}</p>
                                {showButtonNotification()}
                        </button>
                    ))
                }
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