function addCellDriver(socketNum){
    new Driver(socketNum,new Cell(socketNum,center.x,center.y));
    setPhysics();
}

function newCell(socketNum){
    removeUser(socketNum);
    addCellDriver(socketNum);
}

function cycleCellColor(socketNum){
    var cell = getDriver(socketNum);
    if(cell!=null){
        var color;
        if(cell.ai){
            color = getRandomProperty(aiColors);
        }else{
            color = getRandomProperty(entityColors);
        } 
        while (color==cell.soma.tint){
            if(cell.ai){
                color = getRandomProperty(aiColors);
            }else{
                color = getRandomProperty(entityColors);
            } 
        }
        cell.recolor(color);
    }
}

function checkDodge(socketNum,accel){
    var cell = getDriver(socketNum);
    if(cell!=null){
        cell.brain.dodge(accel);
    }
}

function checkSprint(socketNum){
    var cell = getDriver(socketNum);
    if(cell!=null){
        cell.brain.sprint();
    }
}

function resetCell(socketNum){
    var cell = getDriver(socketNum);
    if(cell!=null){
        cell.reset();
    }
}

function Driver(socketNum,cell){
    this.id = socketNum;
    this.cell = cell;
    cell.ai = false;
    drivers.push(cell);
    cycleCellColor(socketNum);
}

function getDriver(socketNum){
    for (var d of drivers){
        if (d.id == socketNum){
            return d;
        }
    }
    return null;
}