var map = [
    ['X','X','X','X','X','X','X','X','X','X'],
    ['X','_','_','_','X','X','_','X','_','X'],
    ['X','_','X','_','_','X','_','_','_','X'],
    ['X','S','X','X','_','_','_','X','_','X'],
    ['X','_','X','_','_','X','_','_','_','X'],
    ['X','_','_','_','X','X','_','X','_','X'],
    ['X','_','X','_','_','X','_','X','_','X'],
    ['X','_','X','X','_','_','_','X','_','X'],
    ['X','_','_','O','_','X','_','_','_','X'],
    ['X','X','X','X','X','X','X','X','X','X']   
];

function Coord(x,y,weight){
    this.x = x;
    this.y = y;
    this.weight = weight;
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
            line+=map[i][j];
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

function savePath(path){
    var newNext=false;
    for(var i=0; i<path.length;i++){
        var adjacents=checkAdjacents(path[i]);
        var next;
        for(var j = 1; j<adjacents.length; j++){
            if(adjacents[j].weight!="X"  && adjacents[j].weight!="_" && adjacents[j].weight<path[i].weight){
                if(!next || adjacents[j].weight<next.weight){
                    next=adjacents[j];
                    newNext=true;
                }
            }
        }
        if(newNext){
            path.push(next);
            newNext=false;
        }
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
            for(var j=0; j<adjacents.length; j++){
                queue.push(adjacents[j]);
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

searchPaths(queue);
