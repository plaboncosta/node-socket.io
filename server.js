require('colors');
const express = require("express");
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const dotenv = require('dotenv');
const cors = require('cors');

/* Load All ENV Variable */
dotenv.config({ path: "./.env" });

const {
    HOST,
    PORT,
    REDIS_HOST,
    REDIS_PORT
} = process.env;

console.log(HOST, 'host');
console.log(PORT, 'port');

// initilize server
const app = express();
const httpServer = createServer(app);

// middleware
app.use(cors());
app.use(morgan('dev'));

// socket
const io = new Server(httpServer);

// redis subscribe
const sub = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});

sub.on('error', (err) => {
    console.log('Error in redis client: ' + err);
});

sub.on('message', (channel, response) => {
    console.log('Message on ' + response + ' channel ' + channel + ' arrived!');
    io.sockets.emit(channel, response);
});

io.on('connection', (socket) => {
    console.log('Socket connected'.yellow);

    socket.on('subscribe', async (response, callback) => {
        console.log('Frontend Page Subscribed!');
        console.log('Subscribe response', response);
        const res = await sub.subscribe(response);
        callback(res);
    });

    socket.on('disconnect', async (reason) => {
        console.log('Socket disconnected'.red, reason);
        await sub.unsubscribe(socket.handshake.query.userId);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + 'index.html');
});

httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`App listening on port ${PORT}`);
});