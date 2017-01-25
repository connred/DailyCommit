var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use('/', express.static(__dirname));
var server = require('http').createServer(app);
var port = process.env.PORT || 8080;
server.listen(port);
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var mongo_url = "mongo://localhost:27017/apcsp";
var users = [];
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.on('welcome', function () {
        text: "Chat here:"
    });
    socket.on('user', function (username) {
        console.log(username + ' connected');
        users.push(username);
        socket.user = username;
        console.log('users : ' + users.length);
        socket.broadcast.emit('otherUserConnect', socket.user);
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
    });
    socket.on('message', function (data) {
        io.sockets.emit('message', {
            user: socket.user
            , message: data
        })
    });
    //
});
mongo.connect(mongo_url, function (err, db) {
    if (err) {
        log('DB Connection Error');
    }
    else {
        log('Connected to DB')
    }
})