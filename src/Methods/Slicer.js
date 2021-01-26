function slicer(props) {
    let slicePosition = props.search("#")
    let username = props.slice(0, slicePosition)
    let tag = props.slice(slicePosition, props.length)

    console.log("Slicer", "username", username, "Tag",tag)
    return [username, tag]
}

export default slicer;