var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5555;
var counter = 0;
var express = require('express');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));

io.on('connection', function (socket) {
  socket.on('set-online', function (msg) {
    // counter.push(1)
    ++counter;
  })
  socket.on('chat message', function (msg) {
    socket.broadcast.emit('chat message', msg.username + " : " + msg.message);
  });
  setInterval(function () {
    socket.emit("online", counter)
  }, 50);
  socket.on('disconnect', function () {
    --counter
  })
  socket.on('typing', function (username) {
    socket.broadcast.emit('typing', username)
  })
  socket.on('stop-typing', function (username) {
    socket.broadcast.emit('stop-typing', username)
  })
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});