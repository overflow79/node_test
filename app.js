
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socket = require('socket.io');

var app = express();

var server = http.createServer(app);
var io = socket.listen(server);

server.listen(8080);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', routes.index);

io.sockets.on('connection', function (socket) {
  console.log('누군가 들어옴');
  io.sockets.emit('connect');
  socket.on('msg', function (data) {
    io.sockets.emit('new', data);
  });
});

io.sockets.on('disconnect', function (socket) {
  console.log('누군가 떠남');
  io.sockets.emit('disconnect');
});
