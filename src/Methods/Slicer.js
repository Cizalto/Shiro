function slicer(props) {
    if (props !== undefined && props !== null) {
        let slicePosition = props.search("#")
        let username = props.slice(0, slicePosition)
        let tag = props.slice(slicePosition, props.length)

        //console.log("Slicer", "username", username, "Tag",tag)
        return [username, tag]
    } else {
        return [" ", " "]
    }
}

export default slicer;