import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Player from './components/Player';
import VideoSelector from './components/VideoSelector';
import Remote from './components/Remote';
import SubtitlesSelector from './components/SubtitlesSelector';
import socketIOClient from "socket.io-client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const ENDPOINT = "http://localhost:8080";


function App() {

  const [videoFile, setVideoFile] = useState();
  const [subtitles, setSubtitles] = useState([]);
  const [paused, setPaused] = useState(false);
  const player = useRef();
  const socket = useRef();
  
  let emitPlay = true;
  let emitPause = true;
  let emitSeek = true;
  
  useEffect(() => {
    socket.current = socketIOClient();

    socket.current.on('state', (state) => {
      console.log('received state')
      setPaused(state.paused);
    })

    socket.current.on('seek', (time) => {
      emitSeek = false;
      if(player.current){
        player.current.seek(time)
      }
    })

    return () => socket.current.disconnect();

  }, []);  

  useEffect(() => {
    if(videoFile){
      if(paused && player.current && !player.current.paused){
        emitPause = false;
        player.current.pause()
      }
      if(!paused && player.current && player.current.paused){
        emitPlay = false;
        player.current.play()
      }
    }

  }, [paused])

  const onSelectFile = (video) => {
    setVideoFile(video);
  }

  const onAddSubtitle = (sub) => {
    setSubtitles([sub])
  }

  const onTimeUpdate = (time) => {
  }

  const onPlay = () => {
    if(emitPlay && socket.current){
        socket.current.emit("play")
    }
    emitPlay = true
  }

  const onPause = () => {
    if(emitPause && socket.current){
      socket.current.emit("pause")
    }
    emitPause = true
  }

  const onSeek = (time) => {
    if(emitSeek && socket.current){
      socket.current.emit("seek", time)
    }
    emitSeek = true
  }

  return (
    <>
  <nav className="navbar navbar-light bg-light mb-3">
    <div className="container-fluid">
      <span className="navbar-brand mb-0 h1">Bondicast</span>
    </div>
  </nav>
    <div className="container-fluid">
      
      <Router>
        <Switch>
          <Route exact path="/">
            <div>
              <VideoSelector onSelect={onSelectFile}></VideoSelector>
              <SubtitlesSelector onSelect={onAddSubtitle}></SubtitlesSelector>
            </div>
            <div>
              <Player ref={player} source={videoFile} subtitles={subtitles} onTimeUpdate={onTimeUpdate} onPlay={onPlay} onPause={onPause} onSeek={onSeek}></Player>
            </div>
          </Route>
          <Route path="/remote">
            <Remote onPlay={onPlay} onPause={onPause} paused={paused}></Remote>
          </Route>
        </Switch>
      </Router>
    </div>
    </>
  );
}

export default App;
