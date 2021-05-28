const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,   {cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});
const cors = require('cors');
const { timeStamp } = require('console');
const port = process.env.PORT || 8080;

app.use(cors())

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
   });
   
   app.get('*', function (req, res) {
     res.sendFile(path.join(__dirname, 'build', 'index.html'));
   });

   app.listen();

const initialState = {
  trigger: 'heartbeat',
  time: 0,
  paused: true,
  get timestamp(){
    return (new Date()).getTime();
  }
}

let state = initialState;

let timelineEvents = [];

const broadcastState = (socket, trigger = 'heartbeat') => {
  socket.broadcast.emit('state', {...state, trigger: trigger})
}

io.on('connection', (socket) => {
    console.log('connected')
    socket.on('disconnect', () => {
        if(io.engine.clientsCount == 0){
          state = initialState;
          timelineEvents = [];
        }
        console.log('disconnected')
    })

    socket.emit('state', state)
    socket.emit('timelineEvents', timelineEvents)

    socket.on('pause', ({author, time}) => {
        state = {...state, paused: true};
        broadcastState(socket, 'pause')

        let timelineEvent = {author, message: `paused`, time, type: 'PLAYER_EVENT'};
        timelineEvents = [...timelineEvents, timelineEvent]
        io.emit('timelineEvent', timelineEvent)
    })

    socket.on('play', ({author, time}) => {
      state = {...state, paused: false};
      broadcastState(socket, 'play')

      let timelineEvent = {author, message: `played`, time, type: 'PLAYER_EVENT'};
      timelineEvents = [...timelineEvents, timelineEvent]
      io.emit('timelineEvent', timelineEvent)
    })

    socket.on('seek', ({author, time}) => {
      state = {...state, time: time};
      broadcastState(socket, 'seek')

      let timelineEvent = {author, message: `seeked to ${new Date(time * 1000).toISOString().substr(11, 8)}`, time, type: 'PLAYER_EVENT'};
      timelineEvents = [...timelineEvents, timelineEvent]
      io.emit('timelineEvent', timelineEvent)
    })

    socket.on('message', ({author, time, message}) => {
      let timelineEvent = {author, message, time, type: 'MESSAGE'};
      timelineEvents = [...timelineEvents, timelineEvent]
      io.emit('timelineEvent', timelineEvent)
    })
})

server.listen(port, () => {
  console.log(`listening on *:${port}`);
})