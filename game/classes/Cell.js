function updateCells(){
    for (var cl of cells){
        cl.update();
    }
}

function Cell(userId,xPos,yPos,tint,scale){
    var self = this;
    var age = 1;
    var hunger = 100;
    var satiety = 0;
    var breath = 0;
    
    if(scale==null) scale = range(cellMin,cellMax);
    var opacity = scale/cellMax;
    if (tint==null) var tint = getRandomProperty(entityColors,restrictedColors);
    if (xPos==null) var xPos = Math.random()*stageWidth;
    if (yPos==null) var yPos = Math.random()*stageHeight;
    
    this.jumpSpeed = 0.06;
    this.brain = new Brain(this);
    this.body = Physics.body('circle', {
        x: xPos, // x-coordinate
        y: yPos, // y-coordinate
        radius: scale * 1.8,
        restitution: 0.3,
        mass: scale/3,
        angle: Math.random()
    });
    
    this.body.view = new PIXI.DisplayObjectContainer();
    
    this.sprite = this.body.view;
    this.sprite.blendMode = PIXI.blendModes.SCREEN;
    this.spriteScale = scale;
    this.sprite.alpha = opacity;
    
    this.membrane = new PIXI.Sprite(sprites.wpLt);
    this.setMembraneSize = function(size){
        self.membrane.width = size * 1.9;
        self.membrane.height = size * 1.9;
    }
    this.setMembraneSize(scale);
    this.membrane.alpha = 0.6;
    this.membrane.tint = tint;//colors.white;//getRandomProperty(colors,restrictedColors);
    this.membrane.blendMode = PIXI.blendModes.NORMAL;
    this.membrane.anchor = {
        x:0.5,
        y:0.5
    };
    this.sprite.addChild(this.membrane);
    
    this.soma = new PIXI.Sprite(cellSprite);
    this.setSomaSize = function(size){
        self.soma.width = size * 0.7;
        self.soma.height = size * 0.7;
    }
    this.setSomaSize(scale);
    this.soma.tint = tint;
    this.soma.blendMode = PIXI.blendModes.SCREEN;
    this.soma.anchor = {
        x:0.5,
        y:0.5
    };
    this.sprite.addChild(this.soma);
    
    this.generateOrganelles = function(innerSym,innerOffset,innerScale,outerSym,outerOffset,outerScale,somaOffset,somaScale) {
        this.organelles = [];
        // Inner organelles
        var points = getRadialSym(innerSym, {x:0,y:-innerOffset}, {x:0,y:0});
        for (var p of points){
            var og = new PIXI.Sprite(cellSprite);
            og.width = innerScale;
            og.height = innerScale;
            og.alpha = 0.8;
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
        // Outer organelles
        points = getRadialSym(outerSym, {x:0,y:-outerOffset}, {x:0,y:0});
        for (var p of points){
            var og = new PIXI.Sprite(cellSprite);
            og.width = outerScale;
            og.height = outerScale;
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
            so.width = somaScale;
            so.height = somaScale;
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
    }
    
    this.generateOrganelles(5,scale*0.4,scale*0.3,3,scale*0.6,scale * 3.4,scale*1.2);
    
    this.anchorPoint = Physics.body('circle', {
        x: this.body.state.pos.x,
        y: this.body.state.pos.y,
        treatment: 'kinematic',
        mass: 0.1,
        hidden: true
    });
    
    world.add(this.anchorPoint);
    
    this.hasMoons = true;
    this.numMoons = 3;
    // Orbiting bodies
    if(this.hasMoons){
        this.moons = [];
        points = getRadialSym(self.numMoons, {x:this.body.state.pos.x,y:this.body.state.pos.y-(scale*3.5)}, this.body.state.pos);
        for (var p of points){
            var bd = Physics.body('circle', {
                x: p.x, // x-coordinate
                y: p.y, // y-coordinate
                radius: scale * 0.1,
                restitution: 0.0,
                mass: 1.1,
                angle: Math.random(),
                treatment: 'dynamic'
            });
            bd.view = new PIXI.Sprite(sprites.bubLt);
            var so = bd.view;
            so.width = scale * 1.2;
            so.height = scale * 1.2;
            so.alpha = 0.3;
            so.tint = tint;//colors.white;
            so.blendMode = PIXI.blendModes.SCREEN;
            so.anchor = {
                x:0.5,
                y:0.5
            };
            constraints.distanceConstraint(this.anchorPoint, bd, 0.5);
            world.add(bd);
            stage.ents.addChild(so);
            this.moons.push(bd);
        }

        for (var i=0;i<this.moons.length;i++){
            var moonA = this.moons[i];
            var moonB;
            if (i+1>this.moons.length-1){
                moonB = this.moons[0];
            }else{
                moonB = this.moons[i+1];
            }
            constraints.angleConstraint(moonA,this.anchorPoint,moonB, 0.4);
        }
    }
    
    this.resetMoons = function(){
        if(!self.hasMoons) return;
        var i = 0;
        points = getRadialSym(self.numMoons, {x:this.body.state.pos.x,y:this.body.state.pos.y-(scale*3.5)}, this.body.state.pos);
        for (var p of points){
            self.moons[i].state.pos.x = p.x;
            self.moons[i].state.pos.y = p.y;
            self.moons[i].state.vel.x = 0;
            self.moons[i].state.vel.y = 0;
            self.moons[i].state.angular.vel = 0;
            if (self.moons[i].old != null) self.moons[i].old.pos.x = p.x;
            if (self.moons[i].old != null) self.moons[i].old.pos.y = p.y;
            i++;
        }
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
            if(self.hasMoons) self.resetMoons();
        }else if (self.body.state.pos.y < -offset && self.body.state.vel.y < 0){
            self.body.state.pos.y = stageHeight + offset;
            self.body.state.old.pos.y = stageHeight + offset;
            self.body.state.vel.y *= dampening;// Math.random()*0.01;
            if(self.hasMoons) self.resetMoons();
        }
        if (self.body.state.pos.x > stageWidth + offset && self.body.state.vel.x > 0) {
            self.body.state.pos.x = -offset;
            self.body.state.old.pos.x = -offset;
            self.body.state.vel.x *= dampening;// Math.random()*-0.1;
            if(self.hasMoons) self.resetMoons();
        }else if (self.body.state.pos.x < -offset && self.body.state.vel.x < 0) {
            self.body.state.pos.x = stageWidth + offset;
            self.body.state.old.pos.x = stageWidth + offset;
            self.body.state.vel.x *= dampening;// Math.random()*0.1;
            if(self.hasMoons) self.resetMoons();
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
        self.body.state.angular.vel *= 0.999;
        
//        if(self.hasMoons){
//            for (var moon of self.moons){
//                moon.state.vel.x = 0.9;
//                //moon.state.acc.x = 0;
//                moon.state.vel.y = 0.9;
//                //moon.state.acc.y = 0;
//                moon.state.angular.vel = 0.9;
//                moon.state.angular.acc = 0;
//            }
//        }
        
        //Movement
        self.brain.meander();
        
        self.anchorPoint.state.pos = self.body.state.pos;
        if(self.anchorPoint.old) self.anchorPoint.old.pos = self.body.state.pos;
        self.anchorPoint.state.vel.x = 0;
        self.anchorPoint.state.vel.y = 0;
        self.anchorPoint.state.angular.vel = self.body.state.angular.vel;
        
        
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
    stage.ents.addChild(this.sprite);
    cells.push(this);
    cellBodies.push(this.body);
}