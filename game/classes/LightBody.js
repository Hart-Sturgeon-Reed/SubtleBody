function updateLightBody(){
    if (lightBodyCreated){
        lightBody.rotate();
    }
}

function LightBody(skeleton){
    var self = this;
    this.primaryColor = colors.blue;
    this.secondaryColor = colors.teal;
    
    this.skeleton = skeleton;
    this.cycle = 0;
    this.offCycle = 0;
    var cycleRate = 0.01;
    console.log('LightBody created');
    this.rotate = function(){
        this.cycle += cycleRate;
        this.offCycle += cycleRate/4;
        var coreRot = Math.cos(this.cycle);
        var coreSize = Math.sin(this.offCycle)*(coreOff.y/2);
        this.coreL.update(rotSym,coreOff,{x:0,y:0},coreRot);
        this.coreR.update(rotSym,coreOff,{x:0,y:0},-coreRot);
        this.core.update(coreSym,{x:0,y:(coreOff.y/2)-coreSize},nv,Math.PI);
    }
    this.update = function(data){
        if(!lightBodyVisible) showLightBody();
        if(self.skeleton) {
            self.skeleton.update(data);
            
            var handOffL = {x:center.x+self.skeleton.handOffset.l.x,y:center.y+self.skeleton.handOffset.l.y};
            var handOffR = {x:center.x+self.skeleton.handOffset.r.x,y:center.y+self.skeleton.handOffset.r.y};
            
            this.lHand.setPosition(handOffL.x,handOffL.y);
            this.rHand.setPosition(handOffR.x,handOffR.y);
            
            this.lHand.update(handSym,{x:0,y:120*self.skeleton.normDepth.l},{x:0,y:0},skeleton.handAngles.l);
            this.rHand.update(handSym,{x:0,y:120*self.skeleton.normDepth.r},{x:0,y:0},skeleton.handAngles.r);
            
            this.lhRing.update(ringSym,{x:skeleton.handOffset.l.x,y:skeleton.handOffset.l.y},{x:0,y:0},skeleton.handAngles.l,midMag*skeleton.normDistance.l);
            this.rhRing.update(ringSym,{x:skeleton.handOffset.r.x,y:skeleton.handOffset.r.y},{x:0,y:0},skeleton.handAngles.r,midMag*skeleton.normDistance.r);
            
            this.inner.update(innerSym,{x:0,y:innerOff.y*self.skeleton.normDistance.t},{x:0,y:0},0);
            this.outer.update(outerSym,{x:0,y:outerOff.y*self.skeleton.normDistance.t},{x:0,y:0},Math.PI);
            this.mid.update(midSym, midOff, nv, 1.6*self.skeleton.headAngle);
            if(useWind){
                var delta = self.skeleton.torso.getDelta(1);
                var force = {x:delta.x*0.0004,y:delta.y*-0.0004};

                //console.log(delta);
                applyFlow(force);
            }
            if(handAttract){
                if(self.skeleton.normDepth.l>0.5){
                    lAttractor.position(handOffL);
                    if(!lAttractor.down){
                        world.add(lAttractor);
                        lAttractor.down = true;
                    }
                }else if(lAttractor.down){
                    world.remove(lAttractor);
                    lAttractor.down = false;
                }
                if(self.skeleton.normDepth.r>0.5){
                    rAttractor.position(handOffR);
                    if(!rAttractor.down){
                        world.add(rAttractor);
                        rAttractor.down = true;
                    }
                }else if(rAttractor.down){
                    world.remove(rAttractor);
                    rAttractor.down = false;
                }
            }
            //console.log(self.skeleton.torso.z);
            
            //Preprocess data to send to stephen
            
            data[36] = {type:'float',value:self.skeleton.handAngles.l};
            data[37] = {type:'float',value:self.skeleton.handAngles.r};
            data[38] = {type:'float',value:self.skeleton.handAngles.t};
            
            data[39] = {type:'float',value:self.skeleton.handDistance.l};
            data[40] = {type:'float',value:self.skeleton.handDistance.r};
            data[41] = {type:'float',value:self.skeleton.handDistance.t};
            
            data[42] = {type:'float',value:self.skeleton.normDistance.l};
            data[43] = {type:'float',value:self.skeleton.normDistance.r};
            data[44] = {type:'float',value:self.skeleton.normDistance.t};
            
            if(sendData){
                socket.emit('send osc', '/kinect data', data);
            }
        }else{
            console.log('skeleton lost');
        }
    }
    
    this.sprite = new PIXI.DisplayObjectContainer();
    stage.mandala.addChild(this.sprite);
    
    var outerOff = {x:0,y:-100};
    var outerSym = 9;
    var outerMag = 680;
    var innerOff = {x:0,y:-200};
    var innerSym = 7;
    var outerMag = 480;
    var coreOff = {x:0,y:-60};
    var coreSym = 9;
    var coreMag = 120;
    var rotSym = 3;
    var coreLRot = 0;
    var coreRRot = 0;
    var handSym = 6;
    var ringSym = 5;
    var midSym = 6;
    var midOff = {x:0,y:-260};
    var midMag = 800;
    
    this.lhRing = new SpriteRing(this.sprite,ringSym,sprites.bubLt,coreOff,center,0,midMag,0.27,this.primaryColor);
    this.rhRing = new SpriteRing(this.sprite,ringSym,sprites.bubLt,coreOff,center,0,midMag,0.27,this.primaryColor);

    this.outer = new SpriteRing(this.sprite,outerSym,sprites.bubLt,outerOff,center,Math.PI,outerMag,0.2,this.primaryColor);
    this.mid = new SpriteRing(this.sprite,midSym,sprites.wpLt,midOff,center,0,midMag,0.6,this.secondaryColor);
    this.inner = new SpriteRing(this.sprite,innerSym,sprites.bubLt,innerOff,center,Math.PI,midMag,0.2,this.primaryColor);
    
    this.coreL = new SpriteRing(this.sprite,rotSym,sprites.bubLt,coreOff,center,coreLRot,coreMag,0.3,colors.white);
    this.coreR = new SpriteRing(this.sprite,rotSym,sprites.bubLt,coreOff,center,coreLRot,coreMag,0.3,colors.white);
    this.core = new SpriteRing(this.sprite,coreSym,sprites.bubLt,coreOff,center,Math.PI,coreMag,0.3,this.secondaryColor);
    
    this.lHand = new SpriteRing(this.sprite,handSym,sprites.bubLt,coreOff,center,0,200,0.42,this.primaryColor);
    this.rHand = new SpriteRing(this.sprite,handSym,sprites.bubLt,coreOff,center,0,200,0.42,this.primaryColor);
    
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
    if(lAttractor.down){
        world.remove(lAttractor);
        lAttractor.down = false;
    }
    if(rAttractor.down){
        world.remove(rAttractor);
        rAttractor.down = false;
    }
}

function showLightBody(){
    //console.log('showing lightbody');
    animTo(lightBody.sprite, {alpha: 1}, 2);
    lightBodyVisible = true;
}