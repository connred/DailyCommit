/*if (window.location.hostname === '127.0.0.1') {
    window.location = 'http://localhost:1898';
}*/
//
// GOOGLE 
//
var socket = io.connect();

function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    username = profile.getGivenName();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    $('#name').html('<p>' + profile.getName() + '</p>');
    $('#email').html('<p>' + 'Email' + ':' + profile.getEmail() + '</p>');
    $('.g-signin2').hide();
    $('.g-signout2').show();
    loadChat();
    $('#chatinput').prop('disabled', false);
    $('#messages').show();
    socket.emit('welcome');
    socket.emit('user', username);
}
var auth2;
var username;
var profile;

function appStart() {
    gapi.load('auth2', initSigninV2);
    $('.g-signout2').click(function () {
        signOut();
    })
    initFullScreen();
}

function initSigninV2() {
    auth2 = gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(signinChanged);
    auth2.currentUser.listen(userChanged);
    if (auth2.isSignedIn.get() == true) {
        auth2.signIn();
    }
}

function signinChanged(isSignedIn) {
    console.log('signinChanged() = ' + isSignedIn);
    if (isSignedIn) {
        console.log('the user must be signed in to print this');
        var googleUser = auth2.currentUser.get();
        var authResponse = googleUser.getAuthResponse();
        var profile = googleUser.getBasicProfile();
        //$('#email').html('<p>' + profile.getEmail() + '</p>');
        //$('#photo').html('<img src="' + profile.getImageUrl() + '">');
        // some other properties
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('FName: ' + profile.getGivenName());
        console.log('LName: ' + profile.getFamilyName());
        console.log('ProPic: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        console.log('HostedDomain: ' + googleUser.getHostedDomain());
        console.log('IDtoken: ' + authResponse.id_token);
        console.log('Experies@: ' + authResponse.expires_at);
    }
    else {
        console.log('the user must not be signed in if this is printing');
    }
}

function userChanged() {
    console.log('userChanged()');
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    $('#name').html('<p>' + "" + '</p>');
    $('#email').html('<p>' + "" + '</p>');
    $('#chatinput').prop('disabled', true);
    $('#messages').html('');
    $('#messages').hide();
    $('.g-signout2').hide();
    $('.g-signin2').show();
    socket.emit('disconnect');
}
//
// NODE - Chat Portion 
//
function loadChat() {
    socket.on('Welcome', function (data) {
        $('#messages').append('<div><strong>' + data.text + '</strong></div>');
    });
    $('#send').click(function () {
        var input = $('#chatinput');
        var text = input.val().trim();
        if (text.length > 0) {
            socket.emit('message', text);
            //console.log('Message sent by', name,":'",text,"'");
        }
        input.val('');
    })
    socket.on('message', function (data) {
        $('#messages').append('<div><strong>' + username + ': ' + data.message + '</strong></div>');
        console.log('Message sent by', username, ":'", data.message, "'");
    });
    socket.on('otherUserConnect', function (data) {
        $('#messages').append('<div><strong>' + data + ' connected</strong></div>');
    });
    socket.on('otherUserDisconnect', function (data) {
        $('#messages').append('<div><strong>' + data + ' disconnected</strong></div>');
    });
    // Pressing enter sends
    $("#chatinput").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#send").click();
        }
    });
}
//
// NODE - Video...
//
function initFullScreen() {
    var button = document.getElementById("fullscreen");
    button.addEventListener('click', function (event) {
        var elem = document.getElementById("vid");
        //show full screen
        elem.webkitRequestFullScreen();
    });
}