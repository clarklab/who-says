var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/public", express.static(__dirname + '/public'));

// the player view
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// the dealer view
app.get('/middle', function(req, res){
  res.sendFile(__dirname + '/index-middle.html');
});


// track the number of players connected to the game
var players = 0;
io.on('connection', function(socket){
  ++players;
  io.emit('count', players);
  socket.on('disconnect', function(){
    --players;
    io.emit('count', players);
  });
});

// track when an answer card is played
io.on('connection', function(socket){
  socket.on('answer', function(msg){
    io.emit('answer', msg);
  });
});

// track when a new question is dealt
io.on('connection', function(socket){
  socket.on('deal', function(msg){
    io.emit('deal', msg);
  });
});

// shhhh, just listen
http.listen(3000, function(){
  console.log('listening on *:3000');
});