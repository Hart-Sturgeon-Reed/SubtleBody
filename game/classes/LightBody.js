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
        if(!lightBodyVisible) showLightBody();
        if(self.skeleton) {
            self.skeleton.update(data);
            this.lHand.setPosition(self.skeleton.lHand.x,self.skeleton.lHand.y);
            this.rHand.setPosition(self.skeleton.rHand.x,self.skeleton.rHand.y);
            this.lHand.update(handSym,coreOff*self.skeleton.normDistance.l,{x:0,y:0},skeleton.handAngles.l);
            this.rHand.update(handSym,coreOff*self.skeleton.normDistance.r,{x:0,y:0},skeleton.handAngles.r);
            this.inner.update(innerSym,innerOff*self.skeleton.normDistance.t,{x:0,y:0},0);
            this.outer.update(outerSym,outerOff*self.skeleton.normDistance.t,{x:0,y:0},Math.PI);
            if(useWind){
                var delta = self.skeleton.torso.getDelta(1);
                var force = {x:delta.x*0.0004,y:delta.y*-0.0004};

                //console.log(delta);
                applyFlow(force);
            }
            //console.log(self.skeleton.torso.z);
            
            //Preprocess data to send to stephen
            
            if(sendData){
                socket.emit('send osc', data);
            }
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
    var handSym = 6;

    this.outer = new SpriteRing(this.sprite,outerSym,sprites.bubLt,outerOff,center,Math.PI,outerMag,0.3,colors.red);
    this.inner = new SpriteRing(this.sprite,innerSym,sprites.bubLt,innerOff,center,Math.PI,outerMag,0.3,colors.red);
    
    this.coreL = new SpriteRing(this.sprite,rotSym,sprites.bubLt,coreOff,center,coreLRot,coreMag,0.4,colors.white);
    this.coreR = new SpriteRing(this.sprite,rotSym,sprites.bubLt,coreOff,center,coreLRot,coreMag,0.4,colors.white);
    this.core = new SpriteRing(this.sprite,coreSym,sprites.bubLt,coreOff,center,Math.PI,coreMag,0.7,colors.orange);
    
    this.lHand = new SpriteRing(this.sprite,handSym,sprites.bubLt,coreOff,center,0,coreMag,0.6,colors.red);
    this.rHand = new SpriteRing(this.sprite,handSym,sprites.bubLt,coreOff,center,0,coreMag,0.6,colors.red);
    
}

function createLightBody(skeleton){
    lightBody = new LightBody(skeleton);
    lightBodyCreated = true;
    lightBodyVisible = true;
}

function hideLightBody(){
    //console.log('hiding lightbody');
    animTo(lightBody.sprite, {alpha: 0.5}, 5);
    lightBodyVisible = false;
}

function showLightBody(){
    //console.log('showing lightbody');
    animTo(lightBody.sprite, {alpha: 1}, 2);
    lightBodyVisible = true;
}