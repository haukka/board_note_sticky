function NoteDrag(socket) {
     var drag = function(scope, elem) {
	elem.draggable({
	    containment: '.container',
	    stop: function(event, ui) {
		socket.emit('NoteDrag', {
		    id: scope.note.id,
		    x: ui.position.left,
		    y: ui.position.top
		});
	    }
	});
	
	socket.on('DragNote', function(data) {
	    if(data.id == scope.note.id) {
		elem.animate({
		    left: data.x,
		    top: data.y
		});
	    }
	});
     };

    var controller = function($scope) {
	socket.on('UpdateNote', function(data) {
	    if(data.id == $scope.note.id) {
		console.log($scope.note);
		$scope.note.title = data.title;
		$scope.note.message = data.message;
	    }
	});

	$scope.updateElem = function(note) {
	    socket.emit('NoteUpdate', note);
	};

	$scope.remove = function(id) {
	    $scope.onremove({
		id: id
	    });
	};
    };

    return {
	restrict: 'A',
	link: drag,
	controller: controller,
	scope: {
	    note: '=',
	    onremove: '&'
	}
    };
};

angular.module('app.NoteDirective', []).directive('noteDrag', NoteDrag);
