function Skeleton(userId){
    var self = this;
    this.id = userId;
    this.com = new TrackingPoint();
    this.head = new TrackingPoint();
    this.torso = new TrackingPoint();
    this.lHand = new TrackingPoint();
    this.rHand = new TrackingPoint();
    this.lKnee = new TrackingPoint();
    this.rKnee = new TrackingPoint();
    this.radius = 0;
    this.handOffset = {x:0,y:0};
    this.handAngles = {l:0,r:0};
    this.handDistance = {l:0,r:0};
    
    //Events
    this.pause = function(){};
    this.changeDir = function(point,dir){};
    //Main update from osc
    this.update = function(data){
        var chunk = {
            x: data[1].value,
            y: data[2].value,
            z: data[3].value,
            px: data[4].value,
            py: data[5].value
        };
        self.lHand.update(chunk);
        chunk = {
            x: data[6].value,
            y: data[7].value,
            z: data[8].value,
            px: data[9].value,
            py: data[10].value
        };
        self.rHand.update(chunk);
        chunk = {
            x: data[11].value,
            y: data[12].value,
            z: data[13].value,
            px: data[14].value,
            py: data[15].value
        };
        self.torso.update(chunk);
        chunk = {
            x: data[16].value,
            y: data[17].value,
            z: data[18].value,
            px: data[19].value,
            py: data[20].value
        };
        self.head.update(chunk);
        chunk = {
            x: data[21].value,
            y: data[22].value,
            z: data[23].value,
            px: data[24].value,
            py: data[25].value
        };
        self.lKnee.update(chunk);
        chunk = {
            x: data[26].value,
            y: data[27].value,
            z: data[28].value,
            px: data[29].value,
            py: data[30].value
        };
        self.rKnee.update(chunk);
    };
}

function TrackingPoint(){
    var self = this;
    this.x = null;
    this.y = null;
    this.z = null;
    this.px = null;
    this.py = null;
    this.old = [];
    this.update = function(data){
        self.old.shift({x:self.x,y:self.y,z:self.z,px:self.px,py:self.py});
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.px = data.px;
        this.py = data.py;
        self.old = self.old.slice(0,10);
    }
}

function newSkeleton(userId,data){
    var skeleton = new Skeleton(userId);
    skeleton.update(data);
    return skeleton;
}
function destroySkeleton(skeleton){
    
}