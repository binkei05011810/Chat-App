const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const router = require('./routers/router');
const { addUser, removeUser } = require('./controllers/users');
const { callbackify } = require('util');

const app = express();
const server = http.createServer(app);
//Create an instance of socket.io
const io = socketio(server);

app.use(cors());
app.use('/', router);

//Will run when we have a client connection on io instance
io.on('connection', (socket /*A client instance of a socket*/) => {
    socket.on('join', ({ name, room }) => {
        const { error, user } = addUser(socket.id, name, room);

        if (error) {
            return callbackify(error);
        }

        //Emit to that user only
        socket.emit('message',
            {
                user: 'admin',
                message: `${user.name}, welcome to room ${user.room}`
            })

        //Emit to everyone besides that user
        socket.broadcast.to(user.room).emit('message',
            {
                user: 'admin',
                message: `${user.name} has joined`
            })

        // Join a user in a room
        socket.join(user.room);

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message',
            {
                user: 'admin',
                message
            })

        callback();
    })

    // Juts this single socket not the whole io
    // Socket is just a speciific socket that just joined (A single user)
    socket.on('disconnect', () => {
        console.log('User has left')
    })
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));