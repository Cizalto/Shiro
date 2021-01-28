import React, { useState } from 'react';
import logo from '../images/Shiroctogone.png';
import title from '../images/title.png';


function Modal(props) {
    var nameList = [
        "Jack the Reaper",
        "Bobby",
        "John Rambo",
        "SpongeBob SquarePants",
        "Kitty the Cat",
        "Pr Heisenberg",
        "Steve",
        "Sephiroth",
        "Shrek",
        "Lupin the 3rd",
        "Ash Ketchum",
        "Alucard",
        "James Bond",
        "Light Yagami",
        "PewDiePie",
        "Link",
        "Dark Sasuke",
        "Pinkie Pie",
        "Rainbow Dash",
        "Twilight Sparkle",
        "Rarity",
        "Fluttershy",
        "Applejack",
        "Anakin",
        "Princess Leia",
        "Obi-Wan",
        "Han Solo",
        "Chewie",
        "Greedo",
        "The Doctor",
        "The Master",
        "Yoda",
        "Arthemis",
        "John Titor"
    ];
    
    var Checkbox = "9634"; //SQR 9634 //Mark 10003

    var random = Math.floor(Math.random() * nameList.length);
    var name = nameList[random];

    const [userName, setUserName] = useState(name);
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [signin, setSignIn] = useState(false);

    if (userName === "") {
        setVerifiedUserName(name);
    }

    function checkEnter(event) {
        if (event.key === 'Enter') {
            setVerifiedUserName(name);
            props.joinAs(userName, "général")
        } else {

        }
    }

    function setVerifiedUserName(name) {
        if (name.includes("#")) {
            name = name.split("#").join("")
            console.log('#removed ',name)
        }
        setUserName(name);
    }

    return (
        <div className="cmodal background-animated">
            <div className="brand">
                <div className="imgContainer">
                    <img src={title} className="title" alt="Title"></img>
                    <img src={logo} className="logo" alt="Logo"></img>
                </div>
                <h2 className="desc">The quick chat app !</h2>
            </div>
            <div className="connection">
                <div className="auth">
                    <div className="title">Login or Register</div>
                    <h3 className="inputDesc">Enter your username</h3>
                    <input type="text" className="input" maxLength="23" onChange={event => setAccountName(event.target.value)}></input>
                    <h3 className="inputDesc">Enter your password</h3>
                    <input type="text" className="input" maxLength="23" minLength="6" onChange={event => setPassword(event.target.value)}></input>
                    <div className="checkbox">
                        <input name="isGoing" type="checkbox"/>
                        {/* <button className="btn">{String.fromCharCode(Checkbox)}</button> */}
                        <label>Register</label>
                        {/* <button className="wonderful btn btn-default disabled">{String.fromCharCode(Checkbox)}</button> */}
                    </div>
                    <div className="validation">
                        <button className="btn" onClick={event => props.joinWithAuth(accountName,password,"général")}>Connect</button>
                    </div>
                </div>
                <div className="separator">
                    <p>|</p>
                </div>
                <div className="guest">
                    <div className="title">Join as Guest</div>
                    <div className="content">
                        <div className="buttons">
                            <div className="wonderful btn btn-default disabled">&#x21bb;</div>
                                <button className="btn join" onClick={event => props.joinAs(userName, "général")}>
                                    Join the chat as
                                    <p className="username">{userName}</p>
                                </button>
                            <button className="btn reload" onClick={event => {setVerifiedUserName(nameList[Math.floor(Math.random() * nameList.length)])}}>&#x21bb;</button>
                        </div>
                        <h3 className="or">- or -</h3>
                        <div className="log">
                            <h3 className="inputDesc">Type your own username</h3>
                            <input type="text" className="input" maxLength="23" onChange={event => setVerifiedUserName(event.target.value)} onKeyPress={event => checkEnter(event)}></input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;