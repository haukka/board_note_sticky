function NoteController($scope, socket, $timeout) {
    $scope.notes = [];
    var num_id = 0;

    socket.on('getData', function(elem) {
	var len = 0;
	for (var o in elem.data) {
	    len++;
	}
	if (len > 0)
	    $scope.notes = elem.data;
	num_id = $scope.notes.length;
    });
    
    socket.on('CreateNote', function(data) {
	$scope.notes.push(data);
    });

    socket.on('RemoveNote', function(data) {
	var item = $scope.notes.map(function(e) {return e.id; }).indexOf(data.id);
	$scope.notes.splice(item, 1);
    });

    $scope.create = function() {
	var note = {
	    id: num_id + 1,
	    title: 'Note',
	    message: 'Write your note here',
	    x: 15,
	    y: 72
	};
	num_id = $scope.notes.length + 1;
	$scope.notes.push(note);
	socket.emit('NoteCreation', note);
    };

    $scope.remove = function(id) {
	var item = $scope.notes.map(function(e) {return e.id; }).indexOf(id);
	$scope.notes.splice(item, 1);
	socket.emit('NoteRemove', {id: id});
    };
};


angular.module('app.NoteCtrl', []).controller('NoteCtrl', NoteController);
