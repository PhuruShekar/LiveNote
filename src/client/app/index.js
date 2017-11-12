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

            
            //initial set of notes
            socket.on('initial snippets', function(data)
                    {
                        
                        var html = '';
                        for (var i = 0; i < data.length; i++)
                        {
                            //store html as a var and add to dom afterward
                            html += '<li>' + data[i].note + '</li>';
                        }
                        $('#mastered').html(html);
                    });

            //New note emitted - add it to current list
            socket.on('new snippet', function(data)
                    {
                        $('#snippets').append('<li>' + data.note + '</li>');
                    });


            //New socket connected
            socket.on('users connected', function(data)
                    {
                        $('#usersConnected').html('Users connected: ' + data);
                    });

            
            

            //New snippet
            $('#newSnippet').click(function()
                    {
                        var text = $('textarea#editor').val(); 
                        var name = $('textarea#name').val();
                        var newSnippet = 
                        {
                            "user"  :   name,
                            "note"  :   text
                        };
                        socket.emit('new snippet', newSnippet);
                    });
        });
