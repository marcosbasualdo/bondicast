import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const Player = forwardRef(({source, subtitles, onTimeUpdate, onPlay, onPause, onSeek}, ref) => {

    const player = useRef();

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
        }        
    
      }));

    return (
        <video controls ref={player} src={source} className="video">
            {subtitles.map(url => (
                <track key={url} label="Default" kind="subtitles" srclang="en" src={url}></track>
            ))}
        </video>
    );
})

export default Player;