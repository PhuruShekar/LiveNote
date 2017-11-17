//Setup basic express server
var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql');

var key_values = require('./config.js');
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
            host: key_values.host,
            user: key_values.user,
            database: key_values.database,
            password: key_values.password
        });

//Error logging
db.connect(function(err)
        {
            if(err) console.log(err);
            else
            {
                console.log('Database connection created.');
            }
        });

//Definition of global vars
var numUsers = 0;
var snippets = [];
var masters = [];

var isInit = false;
var socketCount = 0;

//the magic of copy and paste
var MySqlDateTime = function() {return (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ')};


//Merging
var mergedText = function(c)
    {
        db.query('SELECT * FROM snippets WHERE user != ? ORDER BY entrytime;',
                c.user, function(err, results)
                {
    
                    if(err) 
                    {
                        console.log(this.sql);
                        console.log(err);
                    }
                });
    }


//adding a connection
io.on('connection', function(socket)
        {
            console.log('User connected');
            socketCount++;
            //push to all sockets the number of users
            io.sockets.emit('users connected', socketCount);
            //disconnect
            socket.on('disconnect', function()
                    {
                        socketCount--;
                        io.sockets.emit('users connected', socketCount);
                        console.log('User disconnected.');
                    });
            
            //check initial query
            if(!isInit)
            {
                //Initial start
             
                db.query('SELECT * FROM masterdoc;')
                    .on('result', function(data)
                        {
                            //push results
                            masters.push(data);
                        })
                    .on('end', function()
                        {
                            //emit after finished
                            io.sockets.emit('view master', masters);
                        });
                db.query('SELECT * FROM snippets;')
                    .on('result', function(data)
                        {
                            //push results
                            snippets.push(data);
                        })
                    .on('end', function()
                        {
                            //emit after finished
                            io.sockets.emit('view contrib', snippets);
                        });
                isInit = true;
            }
            else
            {
                //notes exist
                io.sockets.emit('view contrib', snippets);
                console.log('There are pre-existing snippets');
                io.sockets.emit('view master', masters);
                console.log('There are pre-existing master entries');
            };


            //new note added
            socket.on('new snippet', function(data)
                    {

                        //db injection --how to generalize?
                        var now = MySqlDateTime();
                        db.query('INSERT INTO snippets (user, entrytime, score, note) VALUES (?,?,?,?);', [data.user, now, 0, data.note],
                                function(err, results)
                                {
                                    if(err) 
                                    {
                                        console.log(this.sql);
                                        console.log(err);
                                    }
                                })
                            .on('end', function()
                                {

                                  //push results
                                  snippets.push(data);
                                  //emit after finished
                                  io.sockets.emit('view contrib', snippets);
                                });
                    });
        });                            
