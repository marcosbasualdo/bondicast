import React from 'react'

function VideoSelector({onSelect}){

    const onChange = (event) => {
        onSelect(URL.createObjectURL(event.target.files[0]))
    }

    return (
        <input onChange={onChange} type="file" accept="video/*" />
    )
}

export default VideoSelector;