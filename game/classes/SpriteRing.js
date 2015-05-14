function SpriteRing(container,sym,sprite,offset,origin,angle,scale,alpha,tint) {
    var self = this;
    this.sprite = new PIXI.DisplayObjectContainer();
    if (angle==null) angle = 0;
    if (scale==null) scale = 30;
    if (alpha==null) alpha = 0.8;
    if (tint==null) tint = getRandomProperty(entityColors);
    this.sprite.anchor = {x:0.5,y:0.5};
    this.sprite.position.x = origin.x;
    this.sprite.position.y = origin.y;
    
    this.sym = sym;
    this.tint = tint;
    this.moonSprite = sprite;
    this.scale = scale;
    
    this.initMoons = function(){
        this.moons = [];
        var points = getRadialSym(sym, {x:0,y:-offset}, {x:0,y:0}, angle);
        for (var p of points){
            var og = new PIXI.Sprite(this.moonSprite);
            og.width = scale;
            og.height = scale;
            og.alpha = alpha;
            og.tint = this.tint;
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
    this.initMoons();
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
    this.update = function(newSym,offset,origin,angle,scale){
        if (angle==null) angle = 0;
        if (origin==null) origin = {x:0,y:0};
        if (scale==null) scale = self.scale;
        if(newSym!=self.sym){
            self.sym = newSym;
            for (var old of self.moons){
                self.sprite.removeChild(old);
            }
            self.moons = [];
            var points = getRadialSym(self.sym, {x:0,y:-offset}, origin, angle);
            for (var p of points){
                var og = new PIXI.Sprite(self.moonSprite);
                og.width = scale;
                og.height = scale;
                og.alpha = alpha;
                og.tint = self.tint;
                og.blendMode = PIXI.blendModes.SCREEN;
                og.anchor = {
                    x:0.5,
                    y:0.5
                };
                og.position.x = p.x;
                og.position.y = p.y;
                self.moons.push(og);
                self.sprite.addChild(og);
            }
        }else{
            var points = getRadialSym(newSym, {x:0,y:-offset}, {x:0,y:0}, angle);
            var i =0;
            for (var p of points){
                var moon = this.moons[i];
                i++;
                moon.position.x = p.x;
                moon.position.y = p.y;
                moon.tint = self.tint;
                if(scale!=null) moon.scale = scale;
            }
        }
    }
}