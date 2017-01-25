var http = require('http');
var Mongo = require('mongodb').MongoClient;
var express = require('express');
var io = require('socket.io').listen(server);
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
//
var app = express();
app.use('/', express.static(__dirname));
var users = [];
var mongoUrl = 'mongodb://localhost:27017/vidchat';
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
Mongo.connect(mongoUrl, function(err, db) {

    if (err) {
        log('MongoDB connection error');
    } else {
        log('Connected to MongoDB');
    }

    Mongo.ops = {};

});

function log(msg) {
    console.log(msg);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
var app = express();

app.get('/', function(req, res) {
    res.send('this is stoooooopid');
});

app.listen(8080, function() {
    log('listening on port 8080');
});