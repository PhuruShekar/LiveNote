//client side
var io = require('socket.io-client');
var jquery = require('jquery');


//style
import landstyles from '../public/css/landstyle.css'



//ready
$(document).ready(function()
        {
            console.log('Ready.');

            //Connect
            var socket = io.connect('http://localhost:3000');
        });
