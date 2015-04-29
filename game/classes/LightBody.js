function updateLightBody(){
    if (lightBodyCreated){
        lightBody.rotate();
    }
}

function LightBody(skeleton){
    var self = this;
    this.skeleton = skeleton;
    this.cycle = 0;
    var cycleRate = 0.01;
    console.log('LightBody created');
    this.rotate = function(){
        this.cycle += cycleRate;
        var coreRot = Math.cos(this.cycle);
        this.coreL.update(rotSym,coreOff,{x:0,y:0},coreRot);
        this.coreR.update(rotSym,coreOff,{x:0,y:0},-coreRot);
    }
    this.update = function(data){
        
        if(self.skeleton) {
            self.skeleton.update(data);
            //this.inner.setPosition(self.skeleton.lHand.x,self.skeleton.lHand.y);
            this.inner.update(innerSym,innerOff*self.skeleton.normDistance.t,{x:0,y:0},0);
            this.outer.update(outerSym,outerOff*self.skeleton.normDistance.t,{x:0,y:0},Math.PI);
            if(useWind){
                var delta = self.skeleton.torso.getDelta(1);
                var force = {x:delta.x*0.0004,y:delta.y*-0.0004};

                //console.log(delta);
                applyFlow(force);
            }
            //console.log(self.skeleton.torso.z);
            //socket.emit('send osc', data);
        }else{
            console.log('skeleton lost');
        }
    }
    
    this.sprite = new PIXI.DisplayObjectContainer();
    stage.mandala.addChild(this.sprite);
    
    var outerOff = 100;
    var outerSym = 9;
    var outerMag = 680;
    var innerOff = 200;
    var innerSym = 7;
    var outerMag = 480;
    var coreOff = 60;
    var coreSym = 9;
    var coreMag = 120;
    var rotSym = 3;
    var coreLRot = 0;
    var coreRRot = 0;

    this.outer = new SpriteRing(this.sprite,outerSym,sprites.bubLt,outerOff,center,Math.PI,outerMag,0.3,colors.red);
    this.inner = new SpriteRing(this.sprite,innerSym,sprites.bubLt,innerOff,center,Math.PI,outerMag,0.3,colors.red);
    
    this.coreL = new SpriteRing(this.sprite,rotSym,sprites.bubLt,coreOff,center,coreLRot,coreMag,0.4,colors.white);
    this.coreR = new SpriteRing(this.sprite,rotSym,sprites.bubLt,coreOff,center,coreLRot,coreMag,0.4,colors.white);
    this.core = new SpriteRing(this.sprite,coreSym,sprites.bubLt,coreOff,center,Math.PI,coreMag,0.7,colors.orange);
    
}

function createLightBody(skeleton){
    lightBody = new LightBody(skeleton);
    lightBodyCreated = true;
    lightBodyVisible = true;
}

function hideLightBody(){
    //lightBodyVisible = false;
}

function SpriteRing(container,sym,sprite,offset,center,angle,scale,alpha,tint) {
    this.sprite = new PIXI.DisplayObjectContainer();
    this.moons = [];
    if (angle==null) angle = 0;
    if (scale==null) scale = 30;
    if (alpha==null) alpha = 0.8;
    if (tint==null) tint = getRandomProperty(entityColors);
    this.sprite.anchor = {x:0.5,y:0.5};
    this.sprite.position.x = center.x;
    this.sprite.position.y = center.y;
    var points = getRadialSym(sym, {x:0,y:-offset}, {x:0,y:0}, angle);
        for (var p of points){
            var og = new PIXI.Sprite(sprite);
            og.width = scale;
            og.height = scale;
            og.alpha = alpha;
            og.tint = tint;
            og.blendMode = PIXI.blendModes.SCREEN;
            og.anchor = {
                x:0.5,
                y:0.5
            };
            og.position.x = p.x;
            og.position.y = p.y;
            this.moons.push(og);
            this.sprite.addChild(og);
        }
    container.addChild(this.sprite);
    this.setPosition = function(x,y){
        this.sprite.position.x = x;
        this.sprite.position.y = y;
    }
    this.set = function(prop,value){
        for (var moon of this.moons){
            moon[prop]=value;
        }
    }
    this.update = function(newSym,offset,origin,angle){
        if (angle==null) angle = 0;
        if (origin==null) origin = {x:0,y:0};
        if(newSym!=sym){
            
        }else{
            var points = getRadialSym(newSym, {x:0,y:-offset}, {x:0,y:0}, angle);
            var i =0;
            for (var p of points){
                var moon = this.moons[i];
                i++;
                moon.position.x = p.x;
                moon.position.y = p.y;
            }
        }
    }
}