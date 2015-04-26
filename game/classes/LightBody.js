function LightBody(skeleton){
    var self = this;
    this.skeleton = skeleton;
    console.log('LightBody created');
    this.update = function(data){
        if(self.skeleton) {
            self.skeleton.update(data);
            //this.inner.setPosition(self.skeleton.lHand.x,self.skeleton.lHand.y);
            this.inner.update(5,200*self.skeleton.normDistance.t,{x:0,y:0},0,380,0.4);
            this.outer.update(7,100*self.skeleton.normDistance.t,{x:0,y:0},Math.PI,980,0.4);
            if(useWind){
                var delta = self.skeleton.torso.getDelta(1);
                var force = {x:delta.x*0.001,y:delta.y*-0.001};

                //console.log(delta);
                applyFlow(force);
            }
        }else{
            console.log('skeleton lost');
        }
    }
    
    this.sprite = new PIXI.DisplayObjectContainer();
    stage.mandala.addChild(this.sprite);

    this.outer = new SpriteRing(this.sprite,7,sprites.bubLt,100,center,Math.PI,980,0.4);
    this.inner = new SpriteRing(this.sprite,5,sprites.bubLt,200,center,Math.PI,380,0.4);
    this.core = new SpriteRing(this.sprite,9,sprites.bubLt,100,center,Math.PI,180,0.4);
    
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
    this.update = function(newSym,offset,center,angle,scale,alpha,tint){
        if (angle==null) angle = 0;
        if (scale==null) scale = 30;
        if (alpha==null) alpha = 0.8;
        if (tint==null) tint = getRandomProperty(entityColors);
        if (angle==null) angle = 0;
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