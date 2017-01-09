/*if (window.location.hostname === '127.0.0.1') {
    window.location = 'http://localhost:1898';
}*/
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    username = profile.getName();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    $('#name').html('<p>' + profile.getName() + '</p>');
    $('#email').html('<p>' + 'Email' + ':' + profile.getEmail() + '</p>');
    $('.g-signin2').hide();
}