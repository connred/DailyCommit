/*if (window.location.hostname === '127.0.0.1') {
    window.location = 'http://localhost:1898';
}*/

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var username = profile.getName();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    $('#name').append('<p>' + profile.getName() + '</p>');
    $('#email').append('<p>' + 'Email' + ':' + profile.getEmail() + '</p>');
    $('.g-signin2').hide();
    init();
}
/*var auth2;
function appStart {
    gapi.load('auth2',initSignInV2);
}
function initSigninV2() {
    auth2 = gapi.auth2.getAuthInstance();
    auth2.isSignedin.listen(signinChanged);
    auth2.currentuser.listen(userChanged);
    if (auth2.isSignedin.get() == true){
        auth2.SignIn();
    }
}*/
var videos = [];
var username;
var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;

function getNumPerRow() {
    var len = videos.length;
    var biggest;
    // Ensure length is even for better division.
    if (len % 2 === 1) {
        len++;
    }
    biggest = Math.ceil(Math.sqrt(len));
    while (len % biggest !== 0) {
        biggest++;
    }
    return biggest;
}

function subdivideVideos() {
    var perRow = getNumPerRow();
    var numInRow = 0;
    for (var i = 0, len = videos.length; i < len; i++) {
        var video = videos[i];
        setWH(video, i);
        numInRow = (numInRow + 1) % perRow;
    }
}

function setWH(video, i) {
    var perRow = getNumPerRow();
    var perColumn = Math.ceil(videos.length / perRow);
    var width = Math.floor((window.innerWidth) / perRow);
    var height = Math.floor((window.innerHeight - 190) / perColumn);
    video.width = width;
    video.height = height;
    video.style.position = "absolute";
    video.style.left = (i % perRow) * width + 10 + "px";
    video.style.top = Math.floor(i / perRow) * height + "px";
}

function cloneVideo(domId, socketId) {
    var video = document.getElementById(domId);
    var clone = video.cloneNode(false);
    clone.id = "remote" + socketId;
    document.getElementById('videos').appendChild(clone);
    videos.push(clone);
    return clone;
}

function removeVideo(socketId) {
    var video = document.getElementById('remote' + socketId);
    if (video) {
        videos.splice(videos.indexOf(video), 1);
        video.parentNode.removeChild(video);
    }
}

function addToChat(msg, color) {
    var messages = document.getElementById('messages');
    msg = sanitize(msg);
    if (color) {
        msg = '<span style="color: ' + color + '; padding-left: 6px">' + username + ':' + msg + '</span>';
    }
    else {
        msg = '<strong style="padding-left: 6px">' + username + ':' + msg + '</strong>';
    }
    messages.innerHTML = messages.innerHTML + msg + '<br>';
    messages.scrollTop = 10000;
}

function sanitize(msg) {
    return msg.replace(/</g, '&lt;');
}

function initFullScreen() {
    var button = document.getElementById("fullscreen");
    button.addEventListener('click', function (event) {
        var elem = document.getElementById("vid");
        //show full screen
        elem.webkitRequestFullScreen();
    });
}

function initNewRoom() {
    var button = document.getElementById("newRoom");
    button.addEventListener('click', function (event) {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        window.location.hash = randomstring;
        location.reload();
    })
}
var websocketChat = {
    send: function (message) {
        rtc._socket.send(message);
    }
    , recv: function (message) {
        return message;
    }
    , event: 'receive_chat_msg'
};
var dataChannelChat = {
    send: function (message) {
        for (var connection in rtc.dataChannels) {
            var channel = rtc.dataChannels[connection];
            channel.send(message);
        }
    }
    , recv: function (channel, message) {
        return JSON.parse(message).data;
    }
    , event: 'data stream data'
};

function initChat() {
    var chat;
    if (rtc.dataChannelSupport) {
        console.log('initializing data channel chat');
        chat = dataChannelChat;
    }
    else {
        console.log('initializing websocket chat');
        chat = websocketChat;
    }
    var input = document.getElementById("chatinput");
    //var toggleHideShow = document.getElementById("hideShowMessages");
    var room = window.location.hash.slice(1);
    var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    /*toggleHideShow.addEventListener('click', function() {
      var element = document.getElementById("messages");

      if(element.style.display === "block") {
        element.style.display = "none";
      }
      else {
        element.style.display = "block";
      }

    });
    */
    input.addEventListener('keydown', function (event) {
        var key = event.which || event.keyCode;
        if (key === 13) {
            chat.send(JSON.stringify({
                "eventName": "chat_msg"
                , "data": {
                    "messages": input.value
                    , "room": room
                    , "color": color
                }
            }));
            addToChat(input.value);
            input.value = "";
        }
    }, false);
    rtc.on(chat.event, function () {
        var data = chat.recv.apply(this, arguments);
        console.log(data.color);
        addToChat(data.messages, data.color.toString(16));
    });
}

function init() {
    var socket = io.connect();
    if (PeerConnection) {
        rtc.createStream({
            "video": {
                "mandatory": {}
                , "optional": []
            }
            , "audio": false
        }, function (stream) {
            document.getElementById('you').src = URL.createObjectURL(stream);
            document.getElementById('you').play();
            //videos.push(document.getElementById('you'));
            //rtc.attachStream(stream, 'you');
            //subdivideVideos();
        });
    }
    else {
        alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
    }
    var room = window.location.hash.slice(1);
    rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);
    rtc.on('add remote stream', function (stream, socketId) {
        console.log("ADDING REMOTE STREAM...");
        var clone = cloneVideo('you', socketId);
        document.getElementById(clone.id).setAttribute("class", "");
        rtc.attachStream(stream, clone.id);
        subdivideVideos();
    });
    rtc.on('disconnect stream', function (data) {
        console.log('remove ' + data);
        removeVideo(data);
    });
    initFullScreen();
    initNewRoom();
    initChat();
}
window.onresize = function (event) {
    subdivideVideos();
};