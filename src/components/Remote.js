import React from 'react'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

function Remote({onPlay, onPause, paused}){
    return (
        <div className="d-grid remote">
            {paused && (<button className="btn btn-primary btn-lg" onClick={onPlay}>
                <PlayArrowIcon></PlayArrowIcon>
            </button>)}
            {!paused && (<button className="btn btn-secondary btn-lg" onClick={onPause}>
                <PauseIcon></PauseIcon>
            </button>)}
        </div> 
    )
}

export default Remote;