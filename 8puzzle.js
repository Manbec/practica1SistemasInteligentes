    
var blocks = [' ', 1,2,3,4,5,6,7,8];
var visitedStates = [];
var pendingStates = [];
var pendingStatesStrings = [];

//a_star and greedy
var priority_queue = [];
var closed_states = [];

var running  = true;


var goalState = " 12345678";
goalState = "1283 7645";
//goalState="123 56487"
var found=false;

Direction = {
    UP: 0,
    RIGHT: 1,
    LEFT: 2,
    DOWN: 3
}

PositionState = {
    TRANSITABLE: 0,
    BLOCKED: 1,
    START: 2,
    GOAL: 3
}

function activate(){
    blocks=[" ",2,3,1,4,5,8,7,6];
    found = false;
    puzzle = {matrix:[], nullPosX: 0, nullPosY: 0};
    count = 0;
    visitedStates = [];
    pendingStates = [];
    pendingStatesStrings = [];
    for(var i=0; i<3; i++) {
        puzzle.matrix[i] = [];
        for(var j=0; j<3; j++) {
            if(blocks[count]==' '){puzzle.nullPosX = i; puzzle.nullPosY = j;}
            puzzle.matrix[i][j] = blocks[count];
            document.getElementById('cell'+count).innerHTML = blocks[count++];
        }
    }
    running = true;
}
function deactivate(){
    running = false;
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
//blocks=[3,1,2,6,4,5," ",7,8]
blocks=[1,4,2,3,5,8,6," ",7]

//blocks=[" ",2,3,1,4,5,8,7,6]
var puzzle = {matrix:[], nullPosX: 0, nullPosY: 0};
count = 0;
for(var i=0; i<3; i++) {
    puzzle.matrix[i] = [];
    for(var j=0; j<3; j++) {
        if(blocks[count]==' '){puzzle.nullPosX = i; puzzle.nullPosY = j;}
        puzzle.matrix[i][j] = blocks[count];
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

function copy_matrix(puzzle){
    var p = {matrix:[], nullPosX: puzzle.nullPosX, nullPosY: puzzle.nullPosY}
    for(var i=0; i<puzzle.matrix.length; i++) {
        p.matrix[i]=[];
        for(var j=0; j<puzzle.matrix[i].length; j++) {
            p.matrix[i][j]=puzzle.matrix[i][j];
        }
    }
    return p;
}

/*
var visitedStates = ["268 17435", "4513872 6", "237456 81", "2158736 4"];
var a = fruits.indexOf("237456 81");
*/

function move_null(puzzle, direction){
    switch (direction){
        case Direction.UP:
            var temp = puzzle.matrix[puzzle.nullPosX-1][puzzle.nullPosY];
            puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY] = temp;
            puzzle.matrix[puzzle.nullPosX-1][puzzle.nullPosY] = ' ';
            puzzle.nullPosX--;
            break;
        case Direction.RIGHT:
            var temp = puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY+1];
            puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY] = temp;
            puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY+1] = ' ';
            puzzle.nullPosY++;
            break;
        case Direction.LEFT:
            var temp = puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY-1];
            puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY] = temp;
            puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY-1] = ' ';
            puzzle.nullPosY--;
            break;
        case Direction.DOWN:
            var temp = puzzle.matrix[puzzle.nullPosX+1][puzzle.nullPosY];
            puzzle.matrix[puzzle.nullPosX][puzzle.nullPosY] = temp;
            puzzle.matrix[puzzle.nullPosX+1][puzzle.nullPosY] = ' ';
            puzzle.nullPosX++;
            break;
    }
    return puzzle;
}

// X arriba-,  abajo+
// Y izq -, derecha +

//a_star(puzzle);
//a_star_opt(puzzle);
//greedy_search(puzzle)
//greedy_search_opt(puzzle);

function breadth_first(puzzle){
    'use strict';
    pendingStates.push(puzzle);
    console.log(pendingStates);
    var step = 0;
    while(!found && running){
                puzzle = pendingStates[0];
                var stateStr = matrix_to_state(puzzle.matrix); 
                console.log("visiting: "+stateStr);
                //console.log(puzzle);
                pendingStates.shift();
                pendingStatesStrings.shift();
                if(stateStr==goalState){
                    found=true;
                    console.log("found!");
                    return;
                }

                visitedStates.push(stateStr);
                if(puzzle.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
                    //console.log("left");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.LEFT);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState);

                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                    }
                }
                if(puzzle.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
                    //console.log("right");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.RIGHT);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState);

                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                    }
                }
                if(puzzle.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
                    //console.log("up");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.UP);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState)

                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                    }
                }
                if(puzzle.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
                    //console.log("down");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.DOWN);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState)
                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                    }
                }

                /*
                for(var i=0; i<pendingStates.length;i++){
                    console.log("Pending:" + matrix_to_state(pendingStates[i]));
                }
                */
                setTimeout(function(pStates, pStateStrings, visitedStates,count) { 
                    
                    console.log("step: " + count);
                    console.log("pending ("+pendingStatesStrings.length+")");
                    //console.log(pendingStates);
                    console.log(pendingStatesStrings);
                    console.log("visited ("+pendingStatesStrings.length+")");
                    console.log(visitedStates);
                }(pendingStates, pendingStatesStrings, visitedStates, count), 1);
                sleep(2);
                step++;
    }
}

function depth_first_recursive(puzzle){
    'use strict';
    pendingStates.push(puzzle);
    var step = 0;
    var splicepos = 0;
    while(!found && running){

                splicepos = 0;
                puzzle = Object.create(pendingStates[0]);
                var stateStr = matrix_to_state(puzzle.matrix); 
                console.log("visiting: "+stateStr);
                //console.log(puzzle);
                pendingStates.shift();
                pendingStatesStrings.shift();
                if(stateStr==goalState){
                    found=true;
                    console.log("found!");
                    return;
                }

                visitedStates.push(stateStr);

                if(puzzle.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
                    //console.log("down");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.DOWN);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState)
                    if(visitedStates.indexOf(pState)==-1){
                       depth_first_recursive(p);
                       return false;
                    }
                }
                if(puzzle.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
                    //console.log("up");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.UP);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState)

                    if(visitedStates.indexOf(pState)==-1){
                        depth_first_recursive(p);
                        return false;
                    }
                }
                if(puzzle.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
                    //console.log("right");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.RIGHT);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState);

                    if(visitedStates.indexOf(pState)==-1){
                        depth_first_recursive(p);
                        return false;
                    }
                }
                if(puzzle.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
                    //console.log("left");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.LEFT);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState);

                    if(visitedStates.indexOf(pState)==-1){
                        depth_first_recursive(p);
                        return false;
                    }
                }

                /*
                for(var i=0; i<pendingStates.length;i++){
                    console.log("Pending:" + matrix_to_state(pendingStates[i]));
                }
                */
                setTimeout(function(pStates, pStateStrings, visitedStates) { 
                    
                    console.log("pending");
                    //console.log(pendingStates);
                    console.log(pendingStatesStrings);
                    console.log("visited");
                    console.log(visitedStates);
                }(pendingStates, pendingStatesStrings, visitedStates), 1);
                sleep(500);
                step++;
    }
}

function depth_first(puzzle){
    'use strict';
    pendingStates.push(puzzle);
    var step = 0;
    var splicepos = 0;
    while(!found && running){

                splicepos = 0;
                puzzle = Object.create(pendingStates[0]);
                var stateStr = matrix_to_state(puzzle.matrix); 
                console.log("visiting: "+stateStr);
                //console.log(puzzle);
                pendingStates.shift();
                pendingStatesStrings.shift();
                if(stateStr==goalState){
                    found=true;
                    console.log("found!");
                    return;
                }

                visitedStates.push(stateStr);

                if(puzzle.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
                    //console.log("down");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.DOWN);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState)
                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos++,0,pState);
                    }
                }
                if(puzzle.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
                    //console.log("up");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.UP);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState)

                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos++,0,pState);
                    }
                }
                if(puzzle.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
                    //console.log("right");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.RIGHT);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState);

                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos++,0,pState);
                    }
                }
                if(puzzle.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
                    //console.log("left");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.LEFT);
                    var pState = matrix_to_state(p.matrix); 
                    //console.log(pState);

                    if(visitedStates.indexOf(pState)==-1){
                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos,0,pState);
                    }
                }

                /*
                for(var i=0; i<pendingStates.length;i++){
                    console.log("Pending:" + matrix_to_state(pendingStates[i]));
                }
                */
                setTimeout(function(pStates, pStateStrings, visitedStates) { 
                    
                    console.log("pending");
                    //console.log(pendingStates);
                    console.log(pendingStatesStrings);
                    console.log("visited");
                    console.log(visitedStates);
                }(pendingStates, pendingStatesStrings, visitedStates), 1);
                sleep(500);
                step++;
    }
}


function bruteforce_breadth_first(puzzle){
    'use strict';
    console.log(puzzle);
    pendingStates.push(puzzle);
    console.log(pendingStates);
    var step = 0;
    while(!found && running){
                puzzle = Object.create(pendingStates[0]);
                var stateStr = matrix_to_state(puzzle.matrix); 
                console.log("visiting: "+stateStr);
                //console.log(puzzle);
                pendingStates.shift();
                pendingStatesStrings.shift();
                if(stateStr==goalState){
                    found=true;
                    console.log("found!");
                    return;
                }
                visitedStates.push(stateStr);
                if(puzzle.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
                    //console.log("left");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.LEFT);
                    var pState = matrix_to_state(p.matrix);

                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                }
                if(puzzle.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
                    //console.log("right");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.RIGHT);
                    var pState = matrix_to_state(p.matrix);

                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                }
                if(puzzle.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
                    //console.log("up");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.UP);
                    var pState = matrix_to_state(p.matrix);
                    

                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                }
                if(puzzle.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
                    //console.log("down");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.DOWN);
                    var pState = matrix_to_state(p.matrix);

                        pendingStates.push(p);
                        pendingStatesStrings.push(pState);
                }

                /*
                for(var i=0; i<pendingStates.length;i++){
                    console.log("Pending:" + matrix_to_state(pendingStates[i]));
                }
                */
                setTimeout(function(pStates, pStateStrings, visitedStates,count) { 
                    
                    console.log("step: " + count);
                    console.log("pending ("+pendingStatesStrings.length+")");
                    //console.log(pendingStates);
                    console.log(pendingStatesStrings);
                }(pendingStates, pendingStatesStrings, visitedStates, count), 1);
                sleep(2);
                step++;
    }

}

function bruteforce_depth_first(puzzle){
    'use strict';
    console.log(puzzle);
    pendingStates.push(puzzle);
    var step = 0;
    var splicepos = 0;
    while(!found && running){
                splicepos = 0;
                puzzle = Object.create(pendingStates[0]);
                var stateStr = matrix_to_state(puzzle.matrix); 
                console.log("visiting: "+stateStr);
                //console.log(puzzle);
                pendingStates.shift();
                pendingStatesStrings.shift();
                if(stateStr==goalState){
                    found=true;
                    console.log("found!");
                    return;
                }

                visitedStates.push(stateStr);

                if(puzzle.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
                    //console.log("down");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.DOWN);
                    var pState = matrix_to_state(p.matrix); 

                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos++,0,pState);
                }
                if(puzzle.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
                    //console.log("up");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.UP);
                    var pState = matrix_to_state(p.matrix);

                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos++,0,pState);
                }
                if(puzzle.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
                    //console.log("right");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.RIGHT);
                    var pState = matrix_to_state(p.matrix);

                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos++,0,pState);
                }
                if(puzzle.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
                    //console.log("left");
                    let p = copy_matrix(puzzle);
                    p = move_null(p,Direction.LEFT);
                    var pState = matrix_to_state(p.matrix);

                        pendingStates.splice(splicepos,0,p);
                        pendingStatesStrings.splice(splicepos,0,pState);
                }

                /*
                for(var i=0; i<pendingStates.length;i++){
                    console.log("Pending:" + matrix_to_state(pendingStates[i]));
                }
                */
                setTimeout(function(pStates, pStateStrings, visitedStates) { 
                    
                    console.log("pending");
                    //console.log(pendingStates);
                    console.log(pendingStatesStrings);
                }(pendingStates, pendingStatesStrings, visitedStates), 1);
                sleep(500);
                step++;
    }
}


function State(board,moves,prior,prev){
    this.board = board;
    this.moves = moves;
    this.prior = prior;
    this.prev = prev;
}

function calculate_priority(state){
    var prior=0;
    for(var i=0;i<state.length;i++){
        if(state[i]!=goalState[i]){
            prior++;
        }
    }
    return prior;
}
function find_lower(priority){
    var lower= priority[0];
    var lowerIndex=0;
    for(var i=0;i<priority.length;i++){
        if(priority[i].prior<lower.prior){
            lower = priority[i];
            lowerIndex=i;
        }
    }
    return lowerIndex;
}


function greedy_search(puzzle){
    'use strict'
    priority_queue.push(new State(puzzle,0,0,null));
    priority_queue[0].prior=calculate_priority(matrix_to_state(priority_queue[0].board.matrix));
    var lower=priority_queue[0];
    var lowerIndex=0;
    while (matrix_to_state(lower.board.matrix)!=goalState && running){
        console.log(lower);
        if(lower.board.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
            //console.log("left");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.LEFT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState);
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
        }
        if(lower.board.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
            //console.log("right");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.RIGHT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState);
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
        }
        if(lower.board.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
            //console.log("up");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.UP);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState);
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
        }
        if(lower.board.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
            //console.log("down");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.DOWN);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState)
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
        }
        var closed = [];
        closed = priority_queue.splice(lowerIndex,1);
        closed_states.push(closed[0]);
        lowerIndex = find_lower(priority_queue);
        lower=priority_queue[lowerIndex];
    }
    console.log("Pending States:")
    console.log(priority_queue);
    console.log("Visited States");
    console.log(closed_states);
    console.log("Goal State:")
    console.log(lower);
}


function greedy_search_opt(puzzle){
    'use strict';
    priority_queue.push(new State(puzzle,0,0,null));
    priority_queue[0].prior=calculate_priority(matrix_to_state(priority_queue[0].board.matrix));
    var lower=priority_queue[0];
    var lowerIndex=0;
    while (matrix_to_state(lower.board.matrix)!=goalState && running){
        console.log(lower);
        if(lower.board.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
            //console.log("left");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.LEFT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState);
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
        }
        if(lower.board.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
            //console.log("right");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.RIGHT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState);
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
        }
        if(lower.board.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
            //console.log("up");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.UP);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState);
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
        }
        if(lower.board.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
            //console.log("down");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.DOWN);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState)
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
        }
        var closed = [];
        closed = priority_queue.splice(lowerIndex,1);
        closed_states.push(closed[0]);
        lowerIndex = find_lower(priority_queue);
        lower=priority_queue[lowerIndex];
    }
    console.log("Pending States:")
    console.log(priority_queue);
    console.log("Visited States");
    console.log(closed_states);
    console.log("Goal State:")
    console.log(lower);
}



function a_star(puzzle){
    'use strict'
    priority_queue.push(new State(puzzle,0,0,null));
    priority_queue[0].prior=calculate_priority(matrix_to_state(priority_queue[0].board.matrix));
    var lower=priority_queue[0];
    var lowerIndex=0;
    while (matrix_to_state(lower.board.matrix)!=goalState && running){
        console.log(lower);
        if(lower.board.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
            //console.log("left");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.LEFT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves;
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            //console.log(pState);
        }
        if(lower.board.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
            //console.log("right");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.RIGHT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves;
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            //console.log(priority_queue);
            //console.log(pState);
        }
        if(lower.board.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
            //console.log("up");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.UP);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves;
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
        }
        if(lower.board.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
            //console.log("down");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.DOWN);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves
            priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
        }
        var closed = [];
        closed = priority_queue.splice(lowerIndex,1);
        closed_states.push(closed[0]);
        lowerIndex = find_lower(priority_queue);
        lower=priority_queue[lowerIndex];
    }
    console.log("Pending States:")
    console.log(priority_queue);
    console.log("Visited States");
    console.log(closed_states);
    console.log("Goal State:")
    console.log(lower);
}

function a_star_opt(puzzle){
    'use strict'
    priority_queue.push(new State(puzzle,0,0,null));
    priority_queue[0].prior=calculate_priority(matrix_to_state(priority_queue[0].board.matrix));
    var lower=priority_queue[0];
    var lowerIndex=0;
    while (matrix_to_state(lower.board.matrix)!=goalState && running){
        console.log(lower);
        if(lower.board.nullPosY>0){ // si puedes mover el null a la izq (o una ficha a la derecha)
            //console.log("left");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.LEFT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves;
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
            //console.log(pState);
        }
        if(lower.board.nullPosY<2){ // si puedes mover el null a la der (o una ficha a la izq)
            //console.log("right");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.RIGHT);
            var pState = matrix_to_state(p.matrix);
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves;
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
            //console.log(priority_queue);
            //console.log(pState);
        }
        if(lower.board.nullPosX>0){ // si puedes mover el null para arriba (o una ficha para abajo)
            //console.log("up");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.UP);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves;
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
        }
        if(lower.board.nullPosX<2){ // si puedes mover el null para abajo (o una ficha para arriba)
            //console.log("down");
            let p = copy_matrix(lower.board);
            p = move_null(p,Direction.DOWN);
            var pState = matrix_to_state(p.matrix); 
            var moves = lower.moves + 1;
            var prior = calculate_priority(pState) + moves
            if(matrix_to_state(p.matrix)!=lower.prev){
                priority_queue.push(new State(p,moves,prior,matrix_to_state(lower.board.matrix)));
            }
        }
        var closed = [];
        closed = priority_queue.splice(lowerIndex,1);
        closed_states.push(closed[0]);
        lowerIndex = find_lower(priority_queue);
        lower=priority_queue[lowerIndex];
    }
    console.log("Pending States:")
    console.log(priority_queue);
    console.log("Visited States");
    console.log(closed_states);
    console.log("Goal State:")
    console.log(lower);
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
    console.log("woke up!");
}


//breadth_first(puzzle);
//depth_first(puzzle);
depth_first_recursive(puzzle);
