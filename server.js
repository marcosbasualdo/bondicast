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

const broadcastState = (socket, trigger = 'heartbeat') => {
  socket.broadcast.emit('state', {...state, trigger: trigger})
}

io.on('connection', (socket) => {
    console.log('connected')
    socket.on('disconnect', () => {
        if(io.engine.clientsCount == 0){
          state = initialState;
        }
        console.log('disconnected')
    })

    socket.emit('state', state)

    socket.on('pause', () => {
        state = {...state, paused: true};
        broadcastState(socket, 'pause')
    })

    socket.on('play', () => {
      state = {...state, paused: false};
      broadcastState(socket, 'play')
    })

    socket.on('seek', (time) => {
      state = {...state, time: time};
      socket.broadcast.emit('seek', time)
    })
})

server.listen(port, () => {
  console.log(`listening on *:${port}`);
})