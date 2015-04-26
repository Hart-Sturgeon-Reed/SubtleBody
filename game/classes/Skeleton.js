function Skeleton(userId){
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
    
    this.pause = function(){
        
    };
    this.changeDir = function(point,dir){};
    this.update = function(data){
        
    };
}

function TrackingPoint(){
    this.x = null;
    this.y = null;
    this.z = null;
    this.px = null;
    this.py = null;
    this.old = [];
    this.update = function(data){
        this.old.shift({x:this.x,y:this.y,z:this.z,px:this.px,py:this.py});
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.px = data.px;
        this.py = data.py;
    }
}

function newSkeleton(userId,data){
    var skeleton = new Skeleton(userId);
    skeleton.update(data);
    return skeleton;
}
function destroySkeleton(skeleton){
    
}