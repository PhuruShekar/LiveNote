//client side

//style
import landstyles from '../public/css/landstyle.css';



//ready
$(document).ready(function()
        {
            console.log('Ready.');
            //connect
            var socket = io.connect();
            console.log('Connected.');

           
            //text buffer
            var textBuffer = '';
            //view of master
            socket.on('view master', function(data)
                    {
                        console.log("viewing master doc");
                        $('#masters').html('');
                        var html = '';
                        for (var i = 0; i < data.length; i++)
                        {
                            //store html as a var and add to dom afterward
                            html += '<li>' + data[i].note + '</li>';
                        }
                        $('#masters').html(html);
                    });

            //view of contributions
            socket.on('view contrib', function(data)
                    {
                        console.log("viewing contributions");
                        var html = '';
                        for (var i = 0; i < data.length; i++)
                        {
                            //store html as a var and add to dom afterward
                            html += '<li>' + data[i].note + '</li>';
                        }
                        $('#contribs').html(html);
                    });


            //New socket connected
            socket.on('users connected', function(data)
                    {
                            $('#usersConnected').html('Users connected: ' + data);
                    });
            //Username
            $('textarea#username').on("keyup", function (event)
                    {
                        var name = $('textarea#username').val();
                        if(name.length >= 4)
                        {
                            $('textarea#snippetEditor').prop('disabled', false);
                        }
                    });
            //New snippet
           
            $('textarea#snippetEditor').on("keydown", function(event)
                    {
                        
                        var textBuffer = $('textarea#snippetEditor').val().trim();
                        if((event.which == 13 || event.which == 11) && textBuffer.length > 0)
                        {
                            event.preventDefault();
                            $('textarea#username').prop('disabled', true);
                            var name = $('textarea#username').val();
                            var newSnippet = 
                            {
                                "user"  :   name,
                                "note"  :   textBuffer
                            };
                            socket.emit('new snippet', newSnippet);
                            console.log('new snippet created');
                            //clear textarea and buffer
                           textBuffer = '';
                           $('textarea#snippetEditor').val('');
                           return false;
                        }

                    });
        });
