import React from 'react'

function Remote({onPlay, onPause, paused}){
    return (
        <div>
            {paused && (<button className="btn btn-primary" onClick={onPlay}>Play</button>)}
            {!paused && (<button className="btn btn-secondary" onClick={onPause}>Pause</button>)}
        </div>        
    )
}

export default Remote;