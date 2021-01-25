function Menu(props) {

    function displayConnectedUsers() {
        console.log("Userlist",props.userlist);
        if (props.userlist !== undefined) {
            var content = [];
            let count = 0;
            for(const [key,value] of Object.entries(props.userlist)) {
                content[count] = (
                    <div className="username">
                        {value}
                    </div>
                )
                count++;
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

    return (
        <div className="menu">
            <div className="title">
                {props.title}
            </div>
            <div className="userlist">
                {displayConnectedUsers()}
            </div>
        </div>
    )
}

export default Menu;