/*if (window.location.hostname === '127.0.0.1') {
    window.location = 'http://localhost:1898';
}*/
var socket = io.connect();

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var username = profile.getName();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    $('#name').append('<p>' + profile.getName() + '</p>');
    $('#email').append('<p>' + 'Email' + ':' + profile.getEmail() + '</p>');
    init();
}