var app = require('express')();
//Pass express application function to http
const server = require('http').createServer(app);
//Pass the server to socket.io
const io = require('socket.io')(server);

io.on('connection', function()
        {
            
        }
);

server.listen(3000);
