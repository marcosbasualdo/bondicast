import React from 'react'

function Remote({onPlay, onPause}){
    return (
        <div>
            <button className="btn btn-primary" onClick={onPlay}>Play</button>
            <button className="btn btn-secondary" onClick={onPause}>Pause</button>
        </div>        
    )
}

export default Remote;