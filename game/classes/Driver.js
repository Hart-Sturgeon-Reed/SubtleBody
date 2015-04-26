function addCellDriver(socketNum){
    new Driver(socketNum,new Cell(socketNum,center.x,center.y));
    setPhysics();
}

function Driver(socketNum,cell){
    this.id = socketNum;
    this.cell = cell;
    drivers.push(cell);
}

function getDriver(socketNum){
    for (var d of drivers){
        if (d.id == socketNum){
            return d;
        }
    }
    return null;
}