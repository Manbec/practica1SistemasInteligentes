var map = [
['X','X','X','X','X','X','X','X','X','X'],
['X','_','_','_','X','X','_','X','_','X'],
['X','_','X','_','_','X','_','_','_','X'],
['X','_','X','X','_','_','_','X','_','X'],
['X','_','X','_','_','X','_','_','_','X'],
['X','_','_','_','X','X','_','X','_','X'],
['X','_','X','_','_','X','_','X','_','X'],
['X','_','X','X','_','_','_','X','S','X'],
['X','_','_',0,'_','X','_','_','_','X'],
['X','X','X','X','X','X','X','X','X','X']   
];

Direction = {
    UP: 0,
    RIGHT: 1,
    LEFT: 2,
    DOWN: 3
};

var dirArray = [Direction.UP,Direction.RIGHT,Direction.LEFT,Direction.DOWN];
var dirArrayStr = ["UP","RIGHT","LEFT","DOWN"];

var goalLocation = new Coord(9,7,0);
function activate(){
    map = [
['X','X','X','X','X','X','X','X','X','X'],
['X','_','_','_','X','X','_','X','_','X'],
['X','_','X','_','_','X','_','X','_','X'],
['X','_','X','X','_','_','_','X','_','X'],
['X','_','X','_','_','X','_','X','S','X'],
['X','_','_','_','X','X','_','X','_','X'],
['X','_','X','_','_','X','_','X','_','X'],
['X','_','X','X','_','_','_','X','_','X'],
['X','_','_',0,'_','X','_','_','_','X'],
['X','X','X','X','X','X','X','X','X','X']   
];
    goalLocation = new Coord(9,4,0);
    queue = [new Coord(3,8,0)];
    path = [];
    true;
}
function deactivate(){
    running = false;
}


function Coord(x,y,weight){
    this.x = x;
    this.y = y;
    this.weight = weight;
}

function Coordirection(x,y,weight,direction){
    this.x = x;
    this.y = y;
    this.weight = weight;
    this.direction = direction;
}


var queue = [new Coord(3,8,0)];
var path = [];

function adjacentCells(coord){
    var adjacent = [];
    adjacent.push(new Coord(coord.x-1,coord.y,coord.weight+1));
    adjacent.push(new Coord(coord.x+1,coord.y,coord.weight+1));
    adjacent.push(new Coord(coord.x,coord.y-1,coord.weight+1));
    adjacent.push(new Coord(coord.x,coord.y+1,coord.weight+1));
    return adjacent;
}

function printMatrix(map){
    var line="";
    for(var i=0;i<map.length;i++){
        for(var j=0;j<map[i].length;j++){
            if(map[i][j] == "X" || map[i][j] == "_"){
                line+=map[i][j]+" ";
            }
            else if(map[i][j]<10){
                line+=map[i][j]+" ";
            }
            else{
                line+=map[i][j];
            }
        }
        console.log(line);
        line="";
    }
}

function printPath(path){
    console.log("This is the path:");
    for(var i=path.length-1;i>=0;i--){
        console.log("(",path[i].x,",",path[i].y,",",path[i].weight,")");
    }
}

function mapCounters(queue){
    for(var i=0; i<queue.length; i++){
        map[queue[i].y][queue[i].x]=queue[i].weight;
    }
}


function checkAdjacents(coord){
    var adjacent = [];
    adjacent.push(new Coord(coord.x-1,coord.y,map[coord.y][coord.x-1]));
    adjacent.push(new Coord(coord.x+1,coord.y,map[coord.y][coord.x+1]));
    adjacent.push(new Coord(coord.x,coord.y-1,map[coord.y-1][coord.x]));
    adjacent.push(new Coord(coord.x,coord.y+1,map[coord.y+1][coord.x]));
    return adjacent;
}

function checkAdjacentsWithDirection(coord){
    var adjacent = {};
    adjacent[Direction.LEFT] = (new Coord(coord.x-1,coord.y,map[coord.y][coord.x-1]));
    adjacent[Direction.RIGHT] = (new Coord(coord.x+1,coord.y,map[coord.y][coord.x+1]));
    adjacent[Direction.UP] = (new Coord(coord.x,coord.y-1,map[coord.y-1][coord.x]));
    adjacent[Direction.DOWN] = (new Coord(coord.x,coord.y+1,map[coord.y+1][coord.x]));
    return adjacent;
}


function savePath(path){
    console.log("save path");
    while(path[path.length-1].weight>0){
        var adjacents=checkAdjacents(path[path.length-1]);
        var next = adjacents[0];
        for(var j = 1; j<adjacents.length; j++){
            if((adjacents[j].weight!="X"  && adjacents[j].weight!="_" && adjacents[j].weight<next.weight) ||(adjacents[j].weight!="X"  && adjacents[j].weight!="_" && (next.weight=="X" || next.weight=="_"))) {
                next=adjacents[j];
            }
        }
        path.push(next);
    }
}

function searchPaths(queue){ //breadth search
    var found=false;
    for(var i=0; i<queue.length; i++) {
        if(!found){
            var adjacents = adjacentCells(queue[i]);
            for(var j=0; j<adjacents.length; j++) {
                if(map[adjacents[j].y][adjacents[j].x]=='X'){
                    adjacents.splice(j,1);
                    j--;
                }
                else if(map[adjacents[j].y][adjacents[j].x]=='S'){
                    found=true;
                    console.log("Found S");
                    path.push(adjacents[j]);
                }
                else{
                    for(var k=0; k<queue.length;k++){
                        if(adjacents[j].x==queue[k].x && adjacents[j].y==queue[k].y && adjacents[j].weight>=queue[k].weight){                          
                            adjacents.splice(j,1);
                            k=queue.length;
                            j--;
                        }
                    }
                }
            }
            for(var h=0; h<adjacents.length; h++){
                queue.push(adjacents[h]);
            }
        }
        else{
            break;
        }
    }
    mapCounters(queue);
    savePath(path);
    printMatrix(map);
    printPath(path);
}

var road = [];

function depthsearchPaths(queue,weight,direction){ //depth search
    var found=false;
    printMatrix(map);
    var currentx =  queue[0].x;
    var currenty =  queue[0].y;
    var adjacents = checkAdjacentsWithDirection(queue[0]);
    var next;
    var hasAdjacents = false;
    weight++;

    for(var j = 0; j<4; j++){
        console.log(dirArrayStr[direction] + " in " + (weight-1));
        console.log(direction);
        next = adjacents[direction];
        //console.log(next);
        if(next.weight=="_") {
            map[next.y][next.x] = weight;
            printMatrix(map);
            sleep(500);
            console.log(queue);
            queue.splice(0,0,next);
            var dir = direction + 0;
            if (depthsearchPaths(queue,weight,dirArray[dir])){
                road.push(next);
                return true;
            }
            hasAdjacents  = true;
        }
        else if (next.weight=="S") {
            console.log("found");
            road.push(next);
            return true;
        }
        direction = (direction+1)%4;
    }
    map[currenty][currentx] = '_';
    console.log("backtrack");
    printMatrix(map);
    sleep(500);
    return false;
}


function depthsearchPathsIterative(queue,weight,direction){ //depth search
    var found=false;
    printMatrix(map);
    var currentx =  queue[0].x;
    var currenty =  queue[0].y;
    var current;
    var adjacents = checkAdjacentsWithDirection(queue[0]);
    var next;
    var hasAdjacents = false;
    var queueStrings = [queue[0].x+","+queue[0].y+":"+queue[0].weight];
    var adjacents;
    var adjacentCount;
    var path = [];

    while(!found && queue.length>0){
        map[queue[0].y][queue[0].x] = weight;
        printMatrix(map);
        current = queue[0];
        adjacents = checkAdjacentsWithDirection(queue[0]);
        //console.log(queue[0]);
        console.log("Checking: "+queueStrings[0]);
        queue.splice(0,1);
        queueStrings.splice(0,1);
        hasAdjacents = false;
        adjacentCount = 0;
        for(var j = 0; j<4; j++){
            //console.log(dirArrayStr[direction] + " in " + (weight-1));
            //console.log(direction);
            next = adjacents[direction];
            //console.log(next);
            if(next.weight=="_") {
                sleep(10);
                queue.splice(0+adjacentCount,0,next);
                queueStrings.splice(0+adjacentCount,0,next.x+","+next.y+":"+next.weight+", weight: "+(weight+1));

                //console.log(queue);

                //onsole.log(queueStrings);
                hasAdjacents  = true;
                adjacentCount++;
            }
            else if (next.weight=="S") {

                console.log("found");
                path.push(next);
                while (weight >= 0){
                    adjacents = checkAdjacentsWithDirection(current);
                    for(var j = 0; j<4; j++){
                        next = adjacents[j];
                        console.log(next);
                        if(next.weight!="_" && next.weight!="X" && next.weight!="S") {
                            if(next.weight== weight-1){
                                map[current.y][current.x] = '_';
                                path.push(current);
                                console.log(next.weight);
                                current = next;
                                printMatrix(map);
                            }
                        }
                    }
                    weight--;
                }

                console.log("Camino tamaño: "+path.length);
                console.log(path);
                return true;
            }
            direction = (direction+1)%4;
        }
        if(hasAdjacents){
            weight++;
        }
        else{

            console.log(path);
            console.log("backtrack");
            console.log(weight);
            console.log(queue[0]);
            adjacents = checkAdjacentsWithDirection(queue[0]);
            for(var j = 0; j<4; j++){
                next = adjacents[j];
                console.log(next);
                if(next.weight!="_" && next.weight!="X" && next.weight!="S") {
                    weight = next.weight+1;
                }
            }
        }
    }
    map[currenty][currentx] = '_';
    console.log("backtrack");
    printMatrix(map);
    sleep(500);
    return false;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
  }
}
}

//searchPaths(queue);
//depthsearchPaths(queue,0, Direction.UP);
//console.log(road);

function distanceFrom(sourceCoord, destCoord){
    Math.hypot = Math.hypot || function(x, y){ return Math.sqrt(x*x + y*y) }

    var x = (destCoord.x - sourceCoord.x),
    y = (destCoord.y - sourceCoord.y);

    //console.log ("x: "+x+", y: "+y);
    //console.log("distance from ("+sourceCoord.x+","+sourceCoord.y+")  to ("+destCoord.x+","+destCoord.y+") : " + Math.hypot(x, y));
    return Math.hypot(x, y);
}

function greedySearchPaths(queue,weight){ //depth search
    var found=false;
    printMatrix(map);
    //console.log(queue);
    var nextState = (queue[0].x+","+queue[0].y);
    var visitedStates = [nextState];
    //console.log(visitedStates);
    var current = queue[0];
    var adjacents = checkAdjacents(queue[0]);
    var next;
    var hasAdjacents = false;
    var prev = null;
    weight++;

    while(queue.length>0 && !found){
        //console.log(dirArrayStr[direction] + " in " + (weight-1));
        //console.log(direction);
        current = queue[0];
        queue.splice(0,1);
        nextState = (current.x+","+current.y);
        visitedStates.push();
        adjacents = checkAdjacents(current);

        map[current.y][current.x] = weight;
        console.log("queue");
        console.log(queue);
        var tempStates = [];
        for(i = 0; i < adjacents.length; i++){

            next = adjacents[i];
            nextState = (next.x+","+next.y);
            console.log(next);
            console.log(i+" con "+adjacents.length);
            console.log(prev != null);
            if(next.weight=="_" && visitedStates.indexOf(nextState)==-1) {
                printMatrix(map);
                sleep(100);
                if(prev == null){
                    console.log("firstfound");
                    prev = next;
                }
                else if(distanceFrom(next, goalLocation)<=distanceFrom(prev, goalLocation)){
                    console.log('better: '+ distanceFrom(next, goalLocation)+ ", than" + distanceFrom(current, goalLocation));
                    console.log(next);
                    console.log(",");
                    tempStates.splice(0,0,next);
                    prev = next;
                }
                else{
                    tempStates.splice(0,0,prev);
                }
                hasAdjacents  = true;
            }
            else if(i == (adjacents.length-1) && prev != null){
                tempStates.splice(0,0,prev);
                console.log('worse');
            }
            else if (next.weight=="S") {
                console.log("found");
                console.log(next);
                road.push(next);
                found = true;
            }
        }
        prev = null;
        while(tempStates.length>0){
             queue.splice(0,0,tempStates.pop());
        }
        weight++;
    }
    printMatrix(map);
    sleep(500);
    return false;
}

function aStarSearchPaths(queue,weight){ //depth search
    
    var found=false;
    printMatrix(map);
    //console.log(queue);
    var nextState = (queue[0].x+","+queue[0].y);
    var visitedStates = [nextState];
    //console.log(visitedStates);
    var current = queue[0];
    var adjacents = checkAdjacents(queue[0]);
    var next;
    var hasAdjacents = false;
    var prev = null;
    weight++;

    while(queue.length>0 && !found){
        //console.log(dirArrayStr[direction] + " in " + (weight-1));
        //console.log(direction);
        current = queue[0];
        queue.splice(0,1);
        nextState = (current.x+","+current.y);
        visitedStates.push();
        adjacents = checkAdjacents(current);

        map[current.y][current.x] = weight;
        console.log("queue");
        console.log(queue);
        var tempStates = [];
        hasAdjacents = false;
        for(i = 0; i < adjacents.length; i++){

            next = adjacents[i];
            nextState = (next.x+","+next.y);
            console.log(next);
            console.log(i+" con "+adjacents.length);
            console.log(prev != null);
            if(next.weight=="_" && visitedStates.indexOf(nextState)==-1) {
                printMatrix(map);
                sleep(100);
                if(prev == null){
                    console.log("firstfound");
                    prev = next;
                }
                else if((distanceFrom(next, goalLocation)+weight)<=(distanceFrom(prev, goalLocation)+weight)){
                    console.log('better: '+ distanceFrom(next, goalLocation)+ ", than" + distanceFrom(current, goalLocation));
                    console.log(next);
                    console.log(",");
                    tempStates.splice(0,0,next);
                    prev = next;
                }
                else{
                    tempStates.splice(0,0,prev);
                }
                hasAdjacents  = true;
            }
            else if(i == (adjacents.length-1) && prev != null){
                tempStates.splice(0,0,prev);
                console.log('worse');
            }
            else if (next.weight=="S") {
                console.log("found");
                console.log(next);
                road.push(next);
                found = true;
            }
        }
        if(!hasAdjacents){
            console.log("no se pudo encontrar la solución");
            printMatrix(map);
            return false;
        }
        prev = null;
        while(tempStates.length>0){
             queue.splice(0,0,tempStates.pop());
        }
        weight++;
    }
    printMatrix(map);
    sleep(500);
    return false;
}
