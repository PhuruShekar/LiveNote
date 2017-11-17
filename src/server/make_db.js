//Make the database

var mysql = require('mysql');
var db_name = 'noteDatabase'; 


//Make the credentials
var db = mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: 'IAMGROOT',
            multipleStatements: true 
        });

//Upon connection
db.connect(function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log('Connected');
                //clean up
                db.query('DROP DATABASE IF EXISTS ' + db_name + '; CREATE DATABASE '+ db_name +'; USE ' + db_name +';',
                        function (err, result)
                        {
                            if(err)
                            {
                                console.log(this.sql);
                                console.log(err);
                            }
                            else console.log('Database clean.');
                        });

                //the tables
                db.query('CREATE TABLE snippets (user VARCHAR(20), entrytime DATETIME, score DECIMAL, note TEXT);'
                        +'CREATE TABLE masterdoc (id TINYINT, entrytime DATETIME, note TEXT)',
                        function(err, result)
                        {
                            if(err)
                            {
                                console.log(this.sql);
                                console.log(err);
                            }
                            else console.log('Tables created.');   
                        });
            }
            
            db.end();
        });
