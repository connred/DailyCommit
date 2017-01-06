var express = require('express');
var app = express();
//var http = require('http').Server(app);
//app.use('/', express.static(__dirname));
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);
var port = process.env.PORT || 8080;
server.listen(port);
/*var server = http.listen(3000, function () {
    console.log('hosting from ' + __dirname);
    console.log('server listening on http://localhost:3000/');
});
var users = []; */
/*var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    /*socket.emit('Welcome', {
        text: ""
    });
    socket.on('user', function (name) {
        console.log(name + ' connected');
        users.push(name);
        socket.user = name;
        console.log('users : ' + users.length);
        socket.broadcast.emit('otherUserConnect', socket.user);
    });
    /*socket.on('nameis', function(){
        console.log('Someone choose the name ' + name);
        socket.user = name;
        socket.broadcast.emit('displayname');
    });
    socket.on('disconnect', function () {
        if (!socket.user) {
            return;
        }
        if (users.indexOf(socket.user) > -1) {
            console.log(socket.user + ' disconnected');
            users.splice(users.indexOf(socket.user), 1);
            socket.broadcast.emit('otherUserDisconnect', socket.user);
        }
    }); */
    /*socket.on('message', function (data) {
        io.sockets.emit('message', {
            message: data
        })
    });
    //
});*/
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.get('/main.css', function (req, res) {
    res.sendfile(__dirname + '/main.css');
});
app.get('/fullscrean.png', function (req, res) {
    res.sendfile(__dirname + '/fullscrean.png');
});
app.get('/main.js', function (req, res) {
    res.sendfile(__dirname + '/main.js');
});
app.get('/webrtc.io.js', function (req, res) {
    res.sendfile(__dirname + '/webrtc.io.js');
});
webRTC.rtc.on('chat_msg', function (data, socket) {
    var roomList = webRTC.rtc.rooms[data.room] || [];
    for (var i = 0; i < roomList.length; i++) {
        var socketId = roomList[i];
        if (socketId !== socket.id) {
            var soc = webRTC.rtc.getSocket(socketId);
            if (soc) {
                soc.send(JSON.stringify({
                    "eventName": "receive_chat_msg"
                    , "data": {
                        "messages": data.messages
                        , "color": data.color
                    }
                }), function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        }
    }
});