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

    const currentTimeout = useRef();
    const eventsStack = useRef([]);
    const emit = useRef(true);

    const sendEvent = (key, fn) => {
        eventsStack.current = [...eventsStack.current, {key, fn}]
        if(!currentTimeout.current){
            currentTimeout.current = setTimeout(() => {
                let elem = (eventsStack.current.find(el => el.key == 'seeked') || eventsStack.current.pop());
                if(elem && elem.fn){
                    if(emit.current){
                        elem.fn();
                    }
                    emit.current = true
                }
                eventsStack.current = []
                currentTimeout.current = undefined
            },300)
        }
    }

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
        const onPlayerPlay = ((event) => {
            sendEvent('play', (() => onPlay(event)).bind(this))
        }).bind(this)

        const onPlayerPause = ((event) => {
            sendEvent('pause', (() => onPause(event)).bind(this))
        }).bind(this)

        const onPlayerSeek = (() => {
            sendEvent('seeked', (() => onSeek(player.current.currentTime)).bind(this))
        }).bind(this)

        player.current.addEventListener('pause', onPlayerPause)
        player.current.addEventListener('seeked', onPlayerSeek)
        player.current.addEventListener('play', onPlayerPlay)

        return () => {
            player.current.removeEventListener('pause', onPlayerPause)
            player.current.removeEventListener('seeked', onPlayerSeek)
            player.current.removeEventListener('play', onPlayerPlay)
        }
    },[])

    useImperativeHandle(ref, () => ({

        play: (emitEvent = true) => {
            emit.current = emitEvent
            player.current.play()
        },

        pause: (emitEvent = true) => {
            emit.current = emitEvent
            player.current.pause()
        },

        seek: (time, emitEvent = true) => {
            emit.current = emitEvent
            player.current.currentTime = time
        },

        get paused() {
            return player.current.paused;
        },

        get currentTime() {
            return player.current.currentTime;
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
                    <track key={url} label="Default" kind="subtitles" src={url} default></track>
                ))}
            </video>
        </div>
        </>
    );
})

export default Player;