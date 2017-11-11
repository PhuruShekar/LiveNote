var webpath = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
var SERVER_DIR = path.resolve(__dirname, 'src/server');
var CSS_DIR = BUILD_DIR + '/css';


var config = 
[
    {
        name: 'client',
        entry: APP_DIR + '/index.js',
        target: 'web',
        output: {
                    path: BUILD_DIR, 
                    filename: 'clientbundle.js'
                },
        module: {
                    loaders: [
                                {
                                    test: /\.js$/,
                                    include: APP_DIR,
                                    loader: 'babel-loader',
                                },
                                {
                                    test: /\.css$/,
                                    include: CSS_DIR, 
                                    loaders: ['style-loader', 'css-loader'], 
                                }
                             ]
                }       
    },
    
    {
       name: 'server',
       entry: SERVER_DIR + '/server.js',
       target: 'node',
       output: {
                    path: SERVER_DIR,
                    filename: 'serverbundle.js' 

               },
      // module:
    }
];
module.exports = config;


