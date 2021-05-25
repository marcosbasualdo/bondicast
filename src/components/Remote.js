import React from 'react'

function Remote({onPlay, onPause, paused}){
    return (
        <div class="d-grid gap-2">
            {paused && (<button className="btn btn-primary btn-lg" onClick={onPlay}>Play</button>)}
            {!paused && (<button className="btn btn-secondary btn-lg" onClick={onPause}>Pause</button>)}
        </div>        
    )
}

export default Remote;