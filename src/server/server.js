//Setup basic express server
var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql');

//Pass express application function to http
const server = require('http').createServer(app);
//Pass the server to socket.io
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

//Are we listening
server.listen(port, function()
        {
            console.log('Server listening at port %d', port);
        });

//Routing
app.use(express.static(path.join(__dirname, '../client/public')));


//Database credentials
var db = mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            database: 'test',
            password: 'IAMGROOT'
        });

//Error logging
db.connect(function(err)
        {
            if(err) console.log(err);
        });

//Definition of global vars
var numUsers = 0;
var notes = [];
var isInitNotes = false;
var socketCount = 0;



//adding a connection
io.on('connection', function(socket)
        {
            var addedUser = false;
            socketCount++;
            io.sockets.emit('users connected', socketCount);

            //disconnect
            socket.on('disconnect', function()
                    {
                        socketCount--;
                        io.sockets.emit('users connected', socketCount);
                    });

            //check initial query
            if(!isInitNotes)
            {
                //Initial start
                db.query('SELECT * FROM notes')
                    .on('result', function(data)
                        {
                            //push results
                            notes.push(data);
                        })
                    .on('end', function()
                        {
                            //emit after finished
                            socket.emit('initial notes', notes)
                        });
                isInitNotes = true;
            }
            else
            {
                //inital notes exist
                socket.emit('initial notes', notes)
            };

           //new note added
            socket.on('new note', function(data)
                    {
                        notes.push(data);
                        io.sockets.emit('new note', data);
                        //db injection
                        db.query('INSERT INTO notes (note) VALUES (?)', data.note);
                    });
        });                            
