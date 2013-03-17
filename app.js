
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socket = require('socket.io')
  , mongoose = require('mongoose');

var app = express();

var server = http.createServer(app);
var io = socket.listen(server);

server.listen(3000);
mongoose.connect('mongodb://localhost/test');

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

var Schema = mongoose.Schema;
var MessageSchema = new Schema({
    name : String,
    msg : String,
    date : Date
});

var MessageModel = mongoose.model('messages', MessageSchema);
var message = new MessageModel();

io.sockets.on('connection', function (socket) {
  console.log('누군가 들어옴');
  io.sockets.emit('connect');
  socket.on('msg', function (data) {
    io.sockets.emit('new', data);
	//data.date = new Date();
	message.name = data.name;
	message.msg = data.msg;
	message.date = new Date();
	message.save();
	console.log(data);
  });
});

io.sockets.on('disconnect', function (socket) {
  console.log('누군가 떠남');
  io.sockets.emit('disconnect');
});
