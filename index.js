var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

// app.use('/public', express.public(__dirname + '/public'));
// app.use(express.static('public'))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/control', function(req, res){
    res.sendFile(__dirname + '/controle.html');
});


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('particules', function(msg){
        // console.log('particules: ' + msg);
        io.emit("nbParticules", msg);
    });
    socket.on('bars', function(msg){
        // console.log('particules: ' + msg);
        io.emit("nbBars", msg);
    });
    socket.on('ampMouvementBar', function(msg){
        // console.log('particules: ' + msg);
        io.emit("ampMouvementBar", msg);
    });
    socket.on('playSound', function(msg){
        // console.log('playSound: ' + msg);
        io.emit("playSound", msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});