import { useState } from 'react';
import slicer from '../Methods/Slicer';
import ScrollableFeed from 'react-scrollable-feed';
import disconnectLogo from '../images/power-button.png';

function Menu(props) {
    const [userCount,setUserCount] = useState(0);

    function displayConnectedUsers() {
        if (props.userlist !== undefined) {
            var content = [];
            let count = 0;
            for(const [key,value] of Object.entries(props.userlist)) {
                let user = slicer(value)
                content[count] = (
                    <div className="user">
                        <div className="name">
                            {user[0]}
                        </div>
                        <div className="tag">
                            {user[1]}
                        </div>
                    </div>
                )
                count++;
            }
            if (userCount !== count){
                setUserCount(count);
            }

            return content.map(element => {
                return element;
            });
        } else {
            console.log("No user to display");
            return null;
        }
    }

    function userType() {
        return (
            <p className="connectionType">Connected as Guest</p>
            )
    }

    //slice name
    let name;
    let tag;
    if (props.userlist !== undefined && props.userlist !== null) {
        name = slicer(props.userlist[props.socket.id])[0]
        tag = slicer(props.userlist[props.socket.id])[1]
    }

    let titleContent = props.title + " ( " + userCount + " )";

    return (
        <div className="menu">
            <div className="connectedUsers">
                <div className="title">
                    {titleContent}
                </div>
                <ScrollableFeed className="feed">
                    <div className="userlist">
                        {displayConnectedUsers()}
                    </div>
                </ScrollableFeed>
            </div>
            <div className="profile">
                <div className="username">
                    <div className="name">{name}</div>
                    <div className="tag">{tag}</div>
                </div>
                <div className="userType">
                    {userType()}
                    <button className="btn disconnect" onClick={() => {props.socket.disconnect()}}><img src={disconnectLogo} alt="disconnect button icon"></img></button>
                </div>
            </div>
        </div>
    )
}

export default Menu;