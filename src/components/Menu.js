import { useState } from 'react';
import slicer from '../Methods/Slicer';

function Menu(props) {
    const [userCount,setUserCount] = useState(0);

    function displayConnectedUsers() {
        console.log("Userlist",props.userlist);
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
            console.log("count",count);
            if (userCount !== count){
                setUserCount(count);
            }

            console.log("userCount",userCount);

            return content.map(element => {
                console.log("Element",element);
                return element;
            });
        } else {
            console.log("No user to display");
            return null;
        }
    }

    function userType() {
        return "Connected as Guest"
    }

    //slice name
    console.log("userlist menu", props.userlist);
    let name;
    let tag;
    if (props.userlist !== undefined && props.userlist !== null) {
        name = slicer(props.userlist[props.socket])[0]
        tag = slicer(props.userlist[props.socket])[1]
    }

    let titleContent = props.title + " ( " + userCount + " )";

    return (
        <div className="menu">
            <div className="userlist">
                <div className="title">
                    {titleContent}
                </div>
                <div className="users">
                    {displayConnectedUsers()}
                </div>
            </div>
            <div className="profile">
                <div className="username">
                    <div className="name">{name}</div>
                    <div className="tag">{tag}</div>
                </div>
                <div className="userType">
                    {userType()}
                </div>
            </div>
        </div>
    )
}

export default Menu;