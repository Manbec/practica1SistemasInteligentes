
var blocks = [' ', 1,2,3,4,5,6,7,8];
var visitedStates = [];
var pendingStates = [];
var goalState = " 12345678";

Direction = {
    UP: 0,
    RIGHT: 1,
    LEFT: 2,
    DOWN: 3
}

var nullPosX, nullPosY;
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//console.log(shuffle(blocks));
shuffle(blocks);

var matrix = [];
count = 0;
for(var i=0; i<3; i++) {
    matrix[i] = [];
    for(var j=0; j<3; j++) {
    	if(blocks[count]==' '){nullPosX = i; nullPosY = j;}
        matrix[i][j] = blocks[count];
    	document.getElementById('cell'+count).innerHTML = blocks[count++];
    }
}


function matrix_to_state(matrix){

	state ="";
	for(var i=0; i<matrix.length; i++) {
	    for(var j=0; j<matrix[i].length; j++) {
	    	state+=matrix[i][j];
	    }
	}
	return state
}

/*
var visitedStates = ["268 17435", "4513872 6", "237456 81", "2158736 4"];
var a = fruits.indexOf("237456 81");
*/

function move_null(matrix, direction, nullPosX, nullPosY){
	switch (direction){
		case Direction.UP:
			var temp = matrix[nullPosX][nullPosY-1];
			matrix[nullPosX][nullPosY] = temp;
			matrix[nullPosX][nullPosY-1] = ' ';
			break;
		case Direction.RIGHT:
			var temp = matrix[nullPosX+1][nullPosY];
			matrix[nullPosX][nullPosY] = temp;
			matrix[nullPosX+1][nullPosY] = ' ';
			break;
		case Direction.LEFT:
			var temp = matrix[nullPosX-1][nullPosY];
			matrix[nullPosX][nullPosY] = temp;
			matrix[nullPosX-1][nullPosY] = ' ';
			break;
		case Direction.DOWN:
			var temp = matrix[nullPosX][nullPosY+1];
			matrix[nullPosX][nullPosY] = temp;
			matrix[nullPosX][nullPosY+1] = ' ';
			break;
	}
}


depth_first(matrix);
function depth_first(matrix, nullPosX, nullPosY){
	visitedStates.push(matrix_to_state(matrix));
	console.log(nullPosX>0);
	if(nullPosX>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
		console.log(matrix);
		move_null(matrix);
		console.log(matrix);
	}
	if(nullPosX<2){ // si puedes mover el null a la der (o una ficha a la izq)
		console.log(matrix);
		move_null(matrix);
		console.log(matrix);
	}
	if(nullPosY>0){ // si puedes mover el null para arriba (o una ficha para abajo)

		console.log(matrix);
		move_null(matrix);
		console.log(matrix);
	}
	if(nullPosY<2){ // si puedes mover el null para abajo (o una ficha para arriba)
		console.log(matrix);
		move_null(matrix);
		console.log(matrix);

	}
}
function breadth_first(matrix){
	
}