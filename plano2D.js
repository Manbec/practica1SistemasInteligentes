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


function adjacentCells(coord){
    var adjacent = [];
    adjacent.push(new Coord(coord.x-1,coord.y,coord.weight+1));
    adjacent.push(new Coord(coord.x+1,coord.y,coord.weight+1));
    adjacent.push(new Coord(coord.x,coord.y-1,coord.weight+1));
    adjacent.push(new Coord(coord.x,coord.y+1,coord.weight+1));
    console.log("soy adj");
    console.log(adjacent);
    return adjacent;
}

function mapCounters(queue){
    for(var i=0; i<queue.length; i++){
        map[queue[i].y][queue[i].x]=queue[i].weight;
    }
    console.log("This is map counter");
    console.log(map);
}

function searchPaths(queue){ //breadth search
    var found=false;
    for(var i=0; i<queue.length; i++) {
        console.log("Entré");
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
}

searchPaths(queue);
var visitedStates = [];
