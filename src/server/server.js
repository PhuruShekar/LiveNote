//Setup basic express server
var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql');
//other dependencies
var linguistics = require('./linguisticsCall.js');
var munkres = require('munkres-js');
var mergePhrases = require('./mergePhrase.js');

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
var snippetsBuffer = {};
var previousUser = '';
var masters = [];
var entries = 0;

var isInit = false;
var socketCount = 0;

//the magic of copy and paste
var MySqlDateTime = function() {return (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ')};


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
                            masters = [];
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
                            // to debug
                            //io.sockets.emit('view contrib', snippets);
                        });
                isInit = true;
            }


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
                                  process(data);
                                  //emit after finished
                                  
                                  
                                  // to debug
                                  //io.sockets.emit('view contrib', snippets);
                                });
                    });
            //finding common phrases
            function process(data)
            {
                var masterNote = '';
                if(!(data.user in snippetsBuffer))
                {
                    snippetsBuffer[data.user] =
                    {
                        "notes" : [data.note],
                    }
                    if(previousUser !== '' && previousUser !== data.user)
                    {
                        var common = mergePhrases.mergePhrases(data.note, snippetsBuffer[previousUser].notes.slice(-1));
                        masterNote = common.join([separator = ' ']);

                    }
                    else 
                    {
                        masterNote = data.note;
                    }
                    previousUser = data.user;

                    
                }
                else
                {
                    snippetsBuffer[data.user].notes.push(data.note);
                    if(previousUser !== data.user)
                    {

                        var common = mergePhrases.mergePhrases(data.note, snippetsBuffer[previousUser].notes.slice(-1));
                        masterNote = common.join([separator = ' ']);
                    }
                    else
                    {
                       // snippetsBuffer[previousUser].notes.push(snippetsBuffer[previousUser].notes.pop() + data.note);
                    }
                    previousUser = data.user;
                   
                }
                if(masterNote.length !== 0)
                {
                    entries++;
                    var now = MySqlDateTime();
                    db.query('INSERT INTO masterdoc (id, entrytime, note) VALUES (?,?,?);', [entries, now, masterNote],
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

                            db.query('SELECT * FROM masterdoc;')
                                .on('result', function(data)
                                    {
                                        //push results
                                        masters.push(data);
                                    })
                                .on('end', function()
                                    {
                                        //emit after finished
                                        console.log(masters);
                                        io.sockets.emit('view master', masters);
                                        masters = [];
                                    });
                        });
                };
                    
            };
                   


        });                            
