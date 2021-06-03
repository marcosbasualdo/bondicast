import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Player from './components/Player';
import VideoSelector from './components/VideoSelector';
import Remote from './components/Remote';
import SubtitlesSelector from './components/SubtitlesSelector';
//import TimelineEvents from './components/TimelineEvents';
import NameSelector from './components/NameSelector';
import RecentTimelineEvents from './components/RecentTimelineEvents'
import ReactionSelector from './components/ReactionSelector'
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
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [lastEvent, setLastEvent] = useState();
  const player = useRef();
  const socket = useRef();
  const container = useRef();
  
  useEffect(() => {

    socket.current = socketIOClient();

    socket.current.on('state', (state) => {
      setPaused(state.paused);
      if(state.trigger == 'seek'){
        if(player.current){
          player.current.seek(state.time, false)
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
      setLastEvent(event)
    })

    return () => socket.current.disconnect();

  }, []);  

  useEffect(() => {
    if(videoFile && player.current){
      if(paused){
        if(!player.current.paused){
          player.current.pause(false)
        }
      }else{
        if(player.current.paused){
          player.current.play(false)
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
    if(socket.current){
      let time = data.time || (player.current && player.current.currentTime) || 0
      let d = {...data, time, author: name}
      socket.current.emit(event, d)
    }    
  }

  const onPlay = () => {
    playerEmit('play')
    setPaused(false)
  }

  const onPause = () => {
    playerEmit('pause')
    setPaused(true)
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
    let data = {author: name, message, time: (player.current && player.current.currentTime) || 0}
    socket.current.emit('message', data)
  }

  const onTimeSelected = (time) => {
    if(player.current){
      player.current.seek(time)
    }
  }

  return (
    <div className="app-container">
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
                <div ref={container} className="player-container">
                  <Player ref={player} source={videoFile} subtitles={subtitles} onFullscreen={() => openFullscreen(container.current)} onExitFullscreen={closeFullscreen} onTimeUpdate={onTimeUpdate} onPlay={onPlay} onPause={onPause} onSeek={onSeek}></Player>
                  <RecentTimelineEvents event={lastEvent}></RecentTimelineEvents>
                </div>
              </Route>
              <Route path="/remote">
                <div className="remote-container">
                  <div className="mb-3">
                    <NameSelector name={name} setName={setName}></NameSelector>  
                  </div>
                  <div className="mb-3">
                    <Remote name={name} setName={setName} onPlay={remoteOnPlay} onPause={remoteOnPause} paused={paused}></Remote>
                  </div>
                  <ReactionSelector onReaction={onSendMessage}></ReactionSelector>
                  {/*<TimelineEvents onTimeSelected={onTimeSelected} timelineEvents={timelineEvents} onSendMessage={onSendMessage}></TimelineEvents>*/}
                </div>
              </Route>
            </Switch>
          </Router>
        </div>
    </div>
  );
}

export default App;
