function updateMotes(){
    for (var mote of motes){
        mote.update();
    }
    if (deadMotes.length>10 && motes.length<100 && Math.random()>0.9){
        new Mote();
        setPhysics();
//        var zombie = deadMotes.unshift();
//        zombie.body.state.pos.x = Math.random()*stageWidth;
//        zombie.body.old.pos.x = zombie.body.state.pos.x;
//        zombie.body.state.pos.y = Math.random()*stageHeight;
//        zombie.body.old.pos.y = zombie.body.state.pos.y;
//        stage.motes.addChild(zombie.sprite);
//        world.add(zombie.body);
//        motes.push(zombie);
//        moteBodies.push(zombie.body);
    }
}

function Mote(xPos,yPos,tint,vel){
    var self = this;
    var scale = range(moteMin,moteMax);
    var opacity = scale/cellMax;
    if (tint==null) tint = getRandomProperty(moteColors);
    var xPos = Math.random()*stageWidth;
    var yPos = Math.random()*stageHeight;
    
    this.moveSpeed = 0.02;
    this.jumpSpeed = 0.03;
    this.energy = scale;
    this.brain = new Brain(this);
    this.body = Physics.body('circle', {
        x: xPos, // x-coordinate
        y: yPos, // y-coordinate
        radius: scale * 1.8,
        restitution: 0.3,
        mass: scale/5,
        angle: Math.random(),
        label: 'mote'
    });
    
    this.body.self = self;
    
    this.body.view = new PIXI.DisplayObjectContainer();
    this.body.state.angular.vel = equalDist(0.06);
    
    this.sprite = this.body.view;
    this.sprite.blendMode = PIXI.blendModes.SCREEN;
    this.spriteScale = scale;
    this.sprite.alpha = opacity;
    
    this.membrane = new PIXI.Sprite(sprites.wpLt);
    this.membrane.width = scale * 1.9;
    this.membrane.height = scale * 1.9;
    this.membrane.alpha = 0.7;
    this.membrane.tint = tint;//colors.white;//getRandomProperty(colors,restrictedColors);
    this.membrane.blendMode = PIXI.blendModes.NORMAL;
    this.membrane.anchor = {
        x:0.5,
        y:0.5
    };
    this.sprite.addChild(this.membrane);
    
    this.soma = new PIXI.Sprite(cellSprite);
    this.soma.width = scale * 1.7;
    this.soma.height = scale * 1.7;
    this.soma.tint = colors.white;
    this.soma.alpha = 0.9;
    this.soma.blendMode = PIXI.blendModes.SCREEN;
    this.soma.anchor = {
        x:0.5,
        y:0.5
    };
    this.sprite.addChild(this.soma);
    
    this.organelles = [];
    // Inner organelles
    var points = getRadialSym(3, {x:0,y:-scale/2.8}, {x:0,y:0});
    for (var p of points){
        var og = new PIXI.Sprite(cellSprite);
        og.width = scale * 0.4;
        og.height = scale * 0.4;
        og.alpha = 0.9;
        og.tint = colors.white;
        og.blendMode = PIXI.blendModes.SCREEN;
        og.anchor = {
            x:0.5,
            y:0.5
        };
        og.position.x = p.x;
        og.position.y = p.y;
        this.organelles.push(og);
        this.sprite.addChild(og);
    }
    // Outer organelles
    points = getRadialSym(3, {x:0,y:-scale*0.6}, {x:0,y:0});
    for (var p of points){
        var og = new PIXI.Sprite(cellSprite);
        og.width = scale * 3.4;
        og.height = scale * 3.4;
        og.alpha = 0.4;
        og.tint = tint;//colors.white;
        og.blendMode = PIXI.blendModes.SCREEN;
        og.anchor = {
            x:0.5,
            y:0.5
        };
        og.position.x = p.x;
        og.position.y = p.y;
        this.organelles.push(og);
        this.sprite.addChild(og);
        
        var so = new PIXI.Sprite(sprites.bubLt);
        so.width = scale * 1.2;
        so.height = scale * 1.2;
        so.alpha = 0.8;
        so.tint = tint;//colors.white;
        so.blendMode = PIXI.blendModes.SCREEN;
        so.anchor = {
            x:0.5,
            y:0.5
        };
        so.position.x = p.x;
        so.position.y = p.y;
        this.sprite.addChild(so);
    }
    points = getRadialSym(3, {x:0,y:-scale/1.8}, {x:0,y:0});
    for (var p of points){
        var og = new PIXI.Sprite(cellSprite);
        og.width = scale * 0.4;
        og.height = scale * 0.4;
        og.alpha = 0.9;
        og.tint = colors.white;
        og.blendMode = PIXI.blendModes.SCREEN;
        og.anchor = {
            x:0.5,
            y:0.5
        };
        og.position.x = p.x;
        og.position.y = p.y;
        this.organelles.push(og);
        this.sprite.addChild(og);
    }
    points = getRadialSym(3, {x:0,y:-scale*1.2}, {x:0,y:0});
    for (var p of points){
        var og = new PIXI.Sprite(cellSprite);
        og.width = scale * 2.4;
        og.height = scale * 2.4;
        og.alpha = 0.6;
        og.tint = tint;
        og.blendMode = PIXI.blendModes.SCREEN;
        og.anchor = {
            x:0.5,
            y:0.5
        };
        og.position.x = p.x;
        og.position.y = p.y;
        this.organelles.push(og);
        this.sprite.addChild(og);
    }
    
    var angleLock = 0.004;
    this.update = function(){
        //Screen wrap
        var offset = scale*3.4;
        var dampening = 0.9;
        if (self.body.state.pos.y > stageHeight + offset && self.body.state.vel.y > 0) {
            self.body.state.pos.y = -offset;
            self.body.state.old.pos.y = -offset;
            self.body.state.vel.y *= dampening;//Math.random()*-0.1;
        }else if (self.body.state.pos.y < -offset && self.body.state.vel.y < 0){
            self.body.state.pos.y = stageHeight + offset;
            self.body.state.old.pos.y = stageHeight + offset;
            self.body.state.vel.y *= dampening;// Math.random()*0.01;
        }
        if (self.body.state.pos.x > stageWidth + offset && self.body.state.vel.x > 0) {
            self.body.state.pos.x = -offset;
            self.body.state.old.pos.x = -offset;
            self.body.state.vel.x *= dampening;// Math.random()*-0.1;
        }else if (self.body.state.pos.x < -offset && self.body.state.vel.x < 0) {
            self.body.state.pos.x = stageWidth + offset;
            self.body.state.old.pos.x = stageWidth + offset;
            self.body.state.vel.x *= dampening;// Math.random()*0.1;
        }
        
        //Move anchor point
//        self.anchorPoint.state.pos = self.body.state.pos;
        
        //Rotation lock
        if (self.body.state.angular.vel > angleLock){
            self.body.state.angular.vel = angleLock;
            self.body.state.angular.acc = 0;
        }else if (self.body.state.angular.vel < -angleLock){
            self.body.state.angular.vel = -angleLock;
            self.body.state.angular.acc = 0;
        }
        
        //Velocity lock
        self.body.state.vel.x *= 0.999;
        self.body.state.vel.y *= 0.999;
        self.body.state.angular.vel *= 0.99;
        
        //Movement
        self.brain.meander();
    }
    this.setScale = function(newScale, scaleY){
        if(scaleY==null){
            self.sprite.width = self.spriteScale * newScale;
            self.sprite.height = self.spriteScale * newScale;
        }else{
            self.sprite.width = self.spriteScale * newScale;
            self.sprite.height = self.spriteScale * scaleY;
        }
//        self.body.geometry.radius = self.sprite.width;
//        self.body.geometry.height = self.sprite.height;
//        self.body.recalc();
    }
    
    world.add(this.body);
    stage.motes.addChild(this.sprite);
    motes.push(this);
    moteBodies.push(this.body);
}