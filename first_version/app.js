var express = require('express');
var path = require('path');
var app = express();

app.io = require('socket.io')();

var Note = [];

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
    res.render('index');
});

app.io.on('connection', function(socket) {

    socket.emit('getData', {data: Note});

    socket.on('NoteCreation', function(data) {
	Note.push(data);
	socket.broadcast.emit('CreateNote', data);
    });

    socket.on('NoteUpdate', function(data) {
	var item = Note.map(function(e) {return e.id; }).indexOf(data.id);
	Note[item] = data;
	socket.broadcast.emit('UpdateNote', data);
    });

    socket.on('NoteDrag', function(data){
	var item = Note.map(function(e) {return e.id; }).indexOf(data.id);
	Note[item].x = data.x;
	Note[item].y = data.y;
	socket.broadcast.emit('DragNote', data);
    });

    socket.on('NoteRemove', function(data){
	var item = Note.map(function(e) {return e.id; }).indexOf(data.id);
	Note.splice(item, 1);
	socket.broadcast.emit('RemoveNote', data);
    });
});

module.exports = app;
