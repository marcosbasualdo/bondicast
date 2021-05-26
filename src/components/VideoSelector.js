import React from 'react'

function VideoSelector({onSelect}){

    const onChange = (event) => {
        onSelect(URL.createObjectURL(event.target.files[0]))
    }

    return (
        <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupFile01">Video</label>
            <input onChange={onChange} type="file" accept="video/*" className="form-control"/>
        </div>
    )
}

export default VideoSelector;