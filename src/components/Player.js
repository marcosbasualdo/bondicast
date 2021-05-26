import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import {throttle, debounce} from 'lodash';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const Player = forwardRef(({source, subtitles, onTimeUpdate, onPlay, onPause, onSeek, onFullscreen, onExitFullscreen}, ref) => {

    const player = useRef();
    const [showControls, setShowControls] = useState(false);

    const hideControls = useRef(debounce(() => {
        setShowControls(false);
    },2500));

    const mouseOutted = useRef(false);

    const onMouseMove = useRef(throttle(() => {
        if(!mouseOutted.current){
            setShowControls(true);
            hideControls.current()
        }
        mouseOutted.current = false;
    },100));

    useEffect(() => {
        player.current.load();
    }, [source])

    useEffect(() => {
        player.current.addEventListener('timeupdate', (event) => {
            onTimeUpdate(player.current.currentTime)
        });

        player.current.addEventListener('play', (event) => {
            onPlay(event)
        })

        player.current.addEventListener('pause', (event) => {
            onPause(event)
        })

        player.current.addEventListener('seeked', (event) => {
            onSeek(player.current.currentTime)
        })
    },[])

    useImperativeHandle(ref, () => ({

        play: () => {
            player.current.play()
        },

        pause: () => {
            player.current.pause()
        },

        seek: (time) => {
            player.current.currentTime = time
        },

        get paused() {
            return player.current.paused;
        }
    
    }));

    const onMouseLeave = () => {
        mouseOutted.current = true;
        setShowControls(false)
    }

    return (
        <>
        <div className={`player ${showControls ? 'player--controls' : ''}`} onMouseMove={onMouseMove.current} onMouseLeave={onMouseLeave}>
            <button className="player-control player-control--fullscreen" onClick={onFullscreen}>
                <FullscreenIcon></FullscreenIcon>
            </button>
            <button className="player-control player-control--fullscreenexit" onClick={onExitFullscreen}>
                <FullscreenExitIcon></FullscreenExitIcon>
            </button>
            <video controls controlsList="nofullscreen nodownload" ref={player} src={source} className="video">
                {subtitles.map(url => (
                    <track key={url} label="Default" kind="subtitles" src={url}></track>
                ))}
            </video>
        </div>
        </>
    );
})

export default Player;