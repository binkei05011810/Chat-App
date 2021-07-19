const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const router = require('./routers/router');

const app = express();
const server = http.createServer(app);
//Create an instance of socket.io
const io = socketio(server);

app.use(cors());
app.use('/', router);

//Will run when we have a client connection on io instance
io.on('connection', (socket /*A client instance of a socket*/) => {
    console.log('New connection');

    // Juts this single socket not the whole io
    // Socket is just a speciific socket that just joined (A single user)
    socket.on('disconnect', () => {
        console.log('User has left')
    })

    socket.on('join', ({ name, room }) => {
        console.log(name, room);

        //callback({ error: "error!!" })
    })
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));