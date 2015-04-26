function LightBody(skeleton){
    var self = this;
    this.skeleton = skeleton;
    console.log('LightBody created');
    this.update = function(data){
        if(self.skeleton) {
            self.skeleton.update(data);
            if(useWind){
                var delta = self.skeleton.torso.getDelta(1);
                var force = {x:delta.x*0.001,y:delta.y*-0.001};

                console.log(delta);
                applyFlow(force);
            }
        }
    }
    
    this.sprite = new PIXI.DisplayObjectContainer();
    stage.mandala.addChild(this.sprite);
    this.core = new SpriteRing(3,sprites.bubLt,10,center);
    this.sprite.add(this.core.sprite);
    
}

function createLightBody(skeleton){
    lightBody = new LightBody(skeleton);
    lightBodyCreated = true;
    lightBodyVisible = true;
}

function hideLightBody(){
    lightBodyVisible = false;
}

function SpriteRing(sym,sprite,offset,center,angle,scale) {
    this.sprite = new PIXI.DisplayObjectContainer();
    this.moons
    if (scale==null) scale = 30;
    if (tint==null) tint = getRandomProperty(entityColors);
    var points = getRadialSym(sym, {x:0,y:-offset}, {x:0,y:0});
        for (var p of points){
            var og = new PIXI.Sprite(sprite);
            og.width = scale;
            og.height = scale;
            og.alpha = 0.8;
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
}