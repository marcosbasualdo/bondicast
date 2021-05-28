import React from 'react'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import NameSelector from './NameSelector';

function Remote({onPlay, onPause, paused, name, setName}){
    return (
        <>
        <div className="mb-3">
            <NameSelector name={name} setName={setName}></NameSelector>  
        </div>
        <div className="d-grid gap-2 remote">
            {paused && (<button className="btn btn-primary btn-lg" onClick={onPlay}>
                <PlayArrowIcon></PlayArrowIcon>
            </button>)}
            {!paused && (<button className="btn btn-secondary btn-lg" onClick={onPause}>
                <PauseIcon></PauseIcon>
            </button>)}
        </div> 
        </>     
    )
}

export default Remote;