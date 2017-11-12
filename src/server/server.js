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
            database: 'noteDatabase',
            password: 'IAMGROOT'
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
var approved = [];
var isInit = false;
var socketCount = 0;
var MySqlDateTime = function() {return (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ')};


//adding a connection
io.on('connection', function(socket)
        {
            socketCount++;
            //push to all sockets the number of users
            io.sockets.emit('users connected', socketCount);

            //disconnect
            socket.on('disconnect', function()
                    {
                        socketCount--;
                        io.sockets.emit('users connected', socketCount);
                    });
            
            
            
            //check initial query
            if(!isInit)
            {
                //Initial start
             

                db.query('SELECT * FROM snippets')
                    .on('result', function(data)
                        {
                            //push results
                            snippets.push(data);
                        })
                    .on('end', function()
                        {
                            //emit after finished
                            socket.emit('initial snippets', approved)
                        });
                isInit = true;
            }
            else
            {
                //inital notes exist
                socket.emit('initial snippets', approved);
            };




            //new note added
            socket.on('new snippet', function(data)
                    {
                        snippets.push(data);
                        //push to sockets
                        io.sockets.emit('new snippet', data);
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
                                });

                        var contrib = 
                        {
                            "id"    :   approved.length,
                            "user"  :   data.user,
                            "entrytime":now,
                            "note"  :   data.note
                        };

                        approved.push(contrib);
                        
                        db.query('INSERT INTO masterdoc (id, user, entrytime, note) VALUES (?,?,?,?);', [approved.length, data.user, now, data.note],
                                function(err, results)
                                {
                                    if(err)
                                    {
                                        console.log(this.sql);
                                        console.log(err);
                                    }
                                });
                    });
        });                            
