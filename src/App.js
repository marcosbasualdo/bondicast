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
  const player = useRef();
  
  let emitSeek = true;
  let emitPlay = true;
  let emitPause = true;

  let socket;

  useEffect(() => {
    socket = socketIOClient();

    socket.on('play', () => {
      emitPlay = false;
      player.current.play()
    })

    socket.on('pause', () => {
      emitPause = false;
      player.current.pause()
    })

    socket.on('seek', (time) => {
      emitSeek = false;
      player.current.seek(time)
    })
  }, []);  

  const onSelectFile = (video) => {
    setVideoFile(video);
  }

  const onAddSubtitle = (sub) => {
    setSubtitles([sub])
  }

  const onTimeUpdate = (time) => {
  }

  const onPlay = () => {
    if(emitPlay){
        socket.emit("play")
    }
    emitPlay = true
  }

  const onPause = () => {
    if(emitPause){
      socket.emit("pause")
    }
    emitPause = true
  }

  const onSeek = (time) => {
    if(emitSeek){
      socket.emit("seek", time)
    }
    emitSeek = true
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <VideoSelector onSelect={onSelectFile}></VideoSelector>
          <SubtitlesSelector onSelect={onAddSubtitle}></SubtitlesSelector>
          <Player ref={player} source={videoFile} subtitles={subtitles} onTimeUpdate={onTimeUpdate} onPlay={onPlay} onPause={onPause} onSeek={onSeek}></Player>
        </Route>
        <Route path="/remote">
          <Remote onPlay={onPlay} onPause={onPause}></Remote>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
