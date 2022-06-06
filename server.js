require('colors');
const express = require("express");
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const port = 5000;

// middleware
app.use(morgan('dev'));

const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log(socket.id);
    console.log('Socket connected'.yellow);


    socket.on('QvpolWIt76zz8Fb-AAAD', (response) => {
        console.log(response);
    });

    // setTimeout(() => {
    //     socket.disconnect();
    // }, [5000])

    socket.on('disconnect', () => {
        console.log('Socket disconnected'.red);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + 'index.html');
});

httpServer.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log(`Example app listening on port ${port}`);
});