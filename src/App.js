import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Player from './components/Player';
import VideoSelector from './components/VideoSelector';
import Remote from './components/Remote';
import SubtitlesSelector from './components/SubtitlesSelector';
import TimelineEvents from './components/TimelineEvents';
import NameSelector from './components/NameSelector';
import socketIOClient from "socket.io-client";
import {openFullscreen, closeFullscreen} from './utils'
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
  const [name, setName] = useState('');
  const emit = useRef(true);
  const nameRef = useRef(name)
  const [timelineEvents, setTimelineEvents] = useState([]);
  const player = useRef();
  const socket = useRef();
  const container = useRef();
  
  useEffect(() => {

    socket.current = socketIOClient(ENDPOINT);

    socket.current.on('state', (state) => {
      setPaused(state.paused);
      if(state.trigger == 'seek'){
        if(player.current){
          emit.current = false
          player.current.seek(state.time)
        }
      }
    })

    socket.current.on('timelineEvents', (events) => {
      setTimelineEvents(events)
    })
    
    socket.current.on('timelineEvent', (event) => {
      setTimelineEvents((currentEvents) => {
        return [...currentEvents, event]
      })
    })

    return () => socket.current.disconnect();

  }, []);  

  useEffect(() => {
    nameRef.current = name
  }, [name])


  useEffect(() => {
    if(videoFile){
      if(paused){
        if(player.current && !player.current.paused){
          emit.current = false; 
          player.current.pause()
        }
      }else{
        if(player.current && player.current.paused){
          emit.current = false; 
          player.current.play()
        }
        
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

  const playerEmit = (event, data = {}) => {
    if(emit.current && socket.current){
      let time = data.time || (player.current && player.current.currentTime) || 0
      let d = {...data, time, author: nameRef.current}
      socket.current.emit(event, d)
    }    
    emit.current = true
  }

  const onPlay = () => {
    playerEmit('play')
  }

  const onPause = () => {
    playerEmit('pause')
  }

  const onSeek = () => {
    playerEmit('seek')
  }

  const remoteOnPlay = () => {
    onPlay();
    setPaused(false);
  }

  const remoteOnPause = () => {
    onPause();
    setPaused(true);
  }

  const onSendMessage = (message) => {
    let data = {author: nameRef.current, message, time: player.current.currentTime}
    socket.current.emit('message', data)
  }

  const onTimeSelected = (time) => {
    if(player.current){
      player.current.seek(time)
    }
  }

  return (
    <div ref={container} className="app-container">
      <nav className="navbar navbar-light bg-light mb-3">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Bondicast</span>
        </div>
      </nav>
        <div className="container-fluid">
          <Router>
            <Switch>
              <Route exact path="/">
                <div className="controls">
                  <VideoSelector onSelect={onSelectFile}></VideoSelector>
                  <SubtitlesSelector onSelect={onAddSubtitle}></SubtitlesSelector>    
                  <NameSelector name={name} setName={setName}></NameSelector>
                </div>
                <div>
                  <Player ref={player} source={videoFile} subtitles={subtitles} onFullscreen={() => openFullscreen(container.current)} onExitFullscreen={closeFullscreen} onTimeUpdate={onTimeUpdate} onPlay={onPlay} onPause={onPause} onSeek={onSeek}></Player>
                </div>
                {false && (<div>
                  <TimelineEvents onTimeSelected={onTimeSelected} timelineEvents={timelineEvents} onSendMessage={onSendMessage}></TimelineEvents>
                </div>)}
              </Route>
              <Route path="/remote">
                <Remote name={name} setName={setName} onPlay={remoteOnPlay} onPause={remoteOnPause} paused={paused}></Remote>
              </Route>
            </Switch>
          </Router>
        </div>
    </div>
  );
}

export default App;
