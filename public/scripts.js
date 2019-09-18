$(document).ready(function () {
    var username;
    var socket = io();
    var interval = 0;

    $('.ui.mini.modal')
        .modal('setting', 'closable', false)
        .modal('show');
    $('#nickname').change(function () {
        $('.btn-user').removeClass('disabled')
    })
    $('.btn-user').click(function () {
        username = $('#nickname').val();
        socket.emit('set-online', { username: username })
    })
    $('#message').keypress(function () {
        socket.emit('typing', username)
    })
    // $('#messages').focusout(function () {
    //     socket.emit('stop-typing', username)
    // })
    socket.on('typing', function (msg) {
        $('#messages').find('#typing').remove();
        clearInterval(interval);
        $('#messages').append('<p id="typing" class="' + msg + '">' + msg + ' is typing..</p>');
        interval = setInterval(function () {
            $('#messages').find('#typing').remove();
        }, 1500);
    })
    socket.on('stop-typing', function (msg) {
        $('#messages').find('.' + msg).remove();
    })
    $('.btnSend').click(function () {
        socket.emit('chat message', { username: username, message: $('#message').val() });
        $('#messages').append($('<div>', {
            class: "ui compact right pointing green basic big label "
        }).css({
            padding: '10px',
            marginTop: '10px',
            float: 'right'
        }).text("Me : " + $('#message').val()))

        $("#messages").append('<br><br><br><br>')
        $('#message').val('');
    });
    socket.on('chat message', function (msg) {
        $('#messages').find('#typing').remove();
        $('#messages').append($('<div>', {
            class: "ui left pointing blue basic big label "
        }).css({
            padding: '10px',
            marginTop: '10px'
        }).text(msg), "<br>");
        window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('online', function (msg) {
        $('#onlineUser').text(msg)
    })
});