
var blocks = [' ', 1,2,3,4,5,6,7,8];
var visitedStates = [];
var pendingStates = [];
var goalState = " 12345678";
var found=false;

Direction = {
    UP: 0,
    RIGHT: 1,
    LEFT: 2,
    DOWN: 3
}

console.log("Inicio");
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

shuffle(blocks);

//Prueba no random
blocks=[3,1,2,6,4,5," ",7,8]

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

function find_null(matrix){
    for(var i=0; i<3; i++) {
        for(var j=0; j<3; j++) {
            if(matrix[i][j]==' '){nullPosX = i; nullPosY = j;}
        }
    }
    return nullPosX, nullPosY;
}

/*
var visitedStates = ["268 17435", "4513872 6", "237456 81", "2158736 4"];
var a = fruits.indexOf("237456 81");
*/

function copy_matrix(matrix){
    var matrixCopy=[];
    for(var i=0; i<matrix.length; i++) {
        matrixCopy[i]=[];
        for(var j=0; j<matrix[i].length; j++) {
            matrixCopy[i][j]=matrix[i][j];
        }
    }
    return matrixCopy;
}

function move_null(originalMatrix, direction, nullPosX, nullPosY){
    var matrix = copy_matrix(originalMatrix);

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
    if(visitedStates.indexOf(matrix_to_state(matrix))==-1){
        pendingStates.push(matrix);
        if(matrix_to_state(matrix)==goalState){
            found=true;
        }
    }
}

breadth_first(matrix);

function breadth_first(matrix){
    pendingStates.push(matrix);
    while(!found){
        nullPosX,nullPosY = find_null(pendingStates[0]);
        if(nullPosX>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
            move_null(pendingStates[0],Direction.LEFT,nullPosX,nullPosY);
        }
        if(nullPosX<2){ // si puedes mover el null a la der (o una ficha a la izq)
            move_null(pendingStates[0],Direction.RIGHT,nullPosX,nullPosY);
        }
        if(nullPosY>0){ // si puedes mover el null para arriba (o una ficha para abajo)
            move_null(pendingStates[0],Direction.UP,nullPosX,nullPosY);
        }
        if(nullPosY<2){ // si puedes mover el null para abajo (o una ficha para arriba)
            move_null(pendingStates[0],Direction.DOWN,nullPosX,nullPosY);
        }
        visitedStates.push(matrix_to_state(pendingStates[0]));
        pendingStates.shift();

        for(var i=0; i<pendingStates.length;i++){
            console.log("Pending:" + matrix_to_state(pendingStates[i]));
        }
        console.log("Visited:" + visitedStates);
    }
}
function depth_first(matrix){
    
}