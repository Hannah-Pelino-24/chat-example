var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users = []
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    socket.broadcast.emit('chat message', msg.username + " : " + msg.message);
  });
  socket.on('online', function (username) {
    users.push({ id: socket.id, username: username })

  })
  socket.on('disconnect', function () {
    for (let i = 0; i < users.length; i++) {
      if (socket.id == users[i].id) {
        users.splice(i, 1)
        break;
      }
    }
  });

  setInterval(function () {
    socket.emit("online", users)
  }, 50);
  console.log(users)
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});