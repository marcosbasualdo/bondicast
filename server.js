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
const cors = require('cors')
const port = process.env.PORT || 8080;

app.use(cors())

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
   });
   
   app.get('/', function (req, res) {
     res.sendFile(path.join(__dirname, 'build', 'index.html'));
   });

   app.listen();

io.on('connection', (socket) => {
    console.log('connected')
    socket.on('disconnect', () => {
        console.log('disconnected')
    })

    socket.on('pause', () => {
        socket.broadcast.emit('pause')
    })

    socket.on('play', () => {
        socket.broadcast.emit('play')
    })

    socket.on('seek', (time) => {
        socket.broadcast.emit('seek', time)
    })
})

server.listen(port, () => {
  console.log(`listening on *:${port}`);
})