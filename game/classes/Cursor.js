function Cursor(socketNum,brush,filter){
    var cursor = new PIXI.Sprite(PIXI.Texture.fromImage('/assets/sprites/sphereLt.png'));
    var size = 18;
    var positionsTracked = 25;
    cursor.anchor = {x:0.5,y:0.5};
    cursor.position = {x:stageWidth/2, y:stageHeight/2};
    var inset = 15;
    cursor.bounds = {xMin:inset,xMax:stageWidth-inset,yMin:inset,yMax:stageHeight-inset};
    cursor.width = size;
    cursor.height = size;
    cursor.tint = colors.white;
    cursor.num = socketNum;
    cursor.filterMotion = filter;
    cursor.enabled = true;
    cursor.draw = false;
    cursor.initPos = {
        x:null,
        y:null,
        z:null
    }
    cursor.pastPos = [];
    cursor.pastPos.unshift(cursor.position);
    if(brush==null){
        cursor.brush = new particleBrush();
    }else{
        cursor.brush = new brush();
    }
    cursor.pool = new ParticlePool(cursor.brush, 200, 60);
    
    cursor.primary = model.primary();

    cursor.secondary = model.secondary();
    
    
    cursor.disableEffect = function(hideCursor){
        if(hideCursor){cursor.enabled = false;}
        cursor.draw = false;
        world.remove( cursor.primary );
        world.remove( cursor.secondary );
        cursor.brush.particleTint = cursor.brush.primary;
    };
    cursor.toggleToPrimary = function(){
        if(cursor.enabled){
            cursor.draw = false;
            world.wakeUpAll();
            world.add( cursor.primary );
            world.remove( cursor.secondary );
            cursor.brush.particleTint = cursor.brush.primary;
        }
    };
    cursor.toggleToSecondary = function(){
        if(cursor.enabled){
            cursor.draw = true;
            world.wakeUpAll();
            cursor.primary.position( cursor.position );
            cursor.secondary.position( cursor.position );
            world.remove( cursor.primary );
            world.add( cursor.secondary );
            cursor.brush.particleTint = cursor.brush.secondary;
        }
    };
    cursor.updatePos = function(){
        cursor.primary.position( cursor.position );
        cursor.secondary.position( cursor.position );
        
        cursor.pastPos.unshift({x:cursor.position.x,y:cursor.position.y});
        
        if(cursor.pastPos.length>positionsTracked){
            cursor.pastPos.pop();
        }
    };
    cursor.getDelta = function(framesAgo){
        if(framesAgo==null){framesAgo=0};
        if(cursor.pastPos[framesAgo]){
            var deltaX = cursor.position.x - cursor.pastPos[framesAgo].x;
            var deltaY = cursor.position.y - cursor.pastPos[framesAgo].y;
            return {x:deltaX,y:deltaY};
        }
        return {x:0,y:0};
    }
    cursor.checkBounds = function(){
        if (cursor.position.x < cursor.bounds.xMin) {
            cursor.position.x = cursor.bounds.xMin;
        }else if (cursor.position.x > cursor.bounds.xMax){
            cursor.position.x = cursor.bounds.xMax;
        }
        if (cursor.position.y < cursor.bounds.yMin) {
            cursor.position.y = cursor.bounds.yMin;
        }else if (cursor.position.y > cursor.bounds.yMax){
            cursor.position.y = cursor.bounds.yMax;
        }
    }
    cursor.setInitPos = function(data){
        cursor.initPos = data;
        cursor.range = {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0,
            centerZ: data.z,
            minZ: data.z,
            maxZ: data.z
        };
    }
    
    return cursor;
}
function Preprocess(data,mainFilter){
    
    mainFilter.call(this,data);
}
function Pointer(accel){
    this.position.x = stageWidth/2 + (accel.xTilt*(stageWidth/1.2));
    this.position.y = stageHeight/2 - (accel.yTilt*(stageHeight/1.2));
    this.updatePos();
}
//function Smooth(accel){
//    this.position.x += (accel.xTilt*(10));
//    this.position.y -= (accel.yTilt*(10));
//    this.checkBounds();
//    this.updatePos();
//}
function Kinect(data){
    var kinectSpeed = 60;
    var toggleDepth = 32;
    data.x = data.x/400;
    data.y = data.y/350;
    if(kinectMap){
        this.position.x = center.x + (data.x*(stageWidth/1.2));
        this.position.y = center.y - (data.y*(stageHeight/1.2));
    }else{
        this.position.x += (data.x*(kinectSpeed));
        this.position.y -= (data.y*(kinectSpeed));
    }
    console.log(data.z);
    if(data.z-this.initPos.z<-toggleDepth){
        this.toggleToSecondary();
    }else if(data.z-this.initPos.z>0){
        this.toggleToPrimary();
    }
    this.checkBounds();
    
    if(useWind){
        var delta = this.getDelta(1);
        var force = {x:delta.x*0.001,y:delta.y*0.001};
        applyForceToEntities(force);
    }
    this.updatePos();
}
function SkeletonHand(data,torso){
    var kinectSpeed = 60;
    var toggleDepth = 40;
    var offset = 240;
    var xMap = data.x/400;
    var yMap = data.y/350;
    var pxMap = (data.px/640) * stageWidth;
    var pyMap = (data.py/480) * stageHeight;
    if(kinectMap){
        this.position.x = center.x + (xMap*(stageWidth/1.2));
        this.position.y = center.y - (yMap*(stageHeight/1.2));
    }else{
        var sPos = smooth(pxMap,pyMap,this.position.x,this.position.y,0.4);//{x:pxMap,y:pyMap};
        this.position.x += sPos.x;
        this.position.y += sPos.y;
    }
    //console.log(data.z);
    if(data.z-(torso-offset)<0){
        this.toggleToSecondary();
    }else if(data.z-(torso-offset)>0){
        this.toggleToPrimary();
    }
    this.checkBounds();
    
//    if(useWind){
//        var delta = this.getDelta(1);
//        var force = {x:delta.x*0.001,y:delta.y*0.001};
//        applyForceToEntities(force);
//    }
    this.updatePos();
}
function SkeletonTorso(data){
    var kinectSpeed = 60;
    var toggleDepth = 10;
    var xMap = data.x/400;
    var yMap = data.y/350;
    var pxMap = (data.px/640) * stageWidth;
    var pyMap = (data.py/480) * stageHeight;
    if(kinectMap){
        this.position.x = center.x + (xMap*(stageWidth/1.2));
        this.position.y = center.y - (yMap*(stageHeight/1.2));
    }else{
        var sPos = smooth(pxMap,pyMap,this.position.x,this.position.y,0.3);//{x:pxMap,y:pyMap};
        this.position.x += sPos.x;
        this.position.y += sPos.y;
    }
    if(data.z-this.initPos.z<-toggleDepth){
        this.toggleToSecondary();
    }else if(data.z-this.initPos.z>0){
        this.toggleToPrimary();
    }
    this.checkBounds();
    if(useWind){
        var delta = this.getDelta(1);
        var force = {x:delta.x*0.002,y:delta.y*0.008};
        applyForceToEntities(force);
    }
    this.updatePos();
}
function LeapMotion(data){
    var cursorSpeed = 60;
    var toggleDepth = 25;
    //data.x = data.x/400;
    //data.y = data.y/350;
    if(kinectMap){
        this.position.x = center.x + (data.x*(stageWidth/1.2));
        this.position.y = center.y - (data.y*(stageHeight/1.2));
    }else{
        this.position.x += (data.x*(cursorSpeed));
        this.position.y -= (data.y*(cursorSpeed));
    }
    if(data.z>0){
        this.toggleToSecondary();
    }else if(data.z<0){
        this.toggleToPrimary();
    }
    this.checkBounds();
    
    if(useWind){
        var delta = this.getDelta(1);
        var force = {x:delta.x*0.001,y:delta.y*0.001};
        applyForceToEntities(force);
    }
    
    this.updatePos();
}

function smooth(nx,ny,cx,cy,amount){
    var nPos = new Physics.vector(nx,ny);
    var cPos = new Physics.vector(cx,cy);
    var max = 20
    var min = 2;
    
    var sPos = nPos.vsub(cPos).mult(amount).clone();
    if (sPos.norm()>max){
        sPos.normalize().mult(max);
    }else if (sPos.norm()<min){
        sPos.set(0,0);
    }
    //console.log(sPos);
    return sPos;
}