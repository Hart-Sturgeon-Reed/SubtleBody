function updateCells(){
    for (var cl of cells){
        cl.update();
    }
    
    if (cells.length<cellCount){
        new Cell();
        setPhysics();
    }
}

function Cell(userId,xPos,yPos,tint,scale){
    var self = this;
    this.ai = true;
    if(userId!=null) this.id = userId;
    if(scale==null) scale = range(cellMin,cellMax);
    this.energy = scale;
    var maxEnergy = 30;
    var maxEnergyAi = 15;
    var hunger = 100;
    var satiety = 0;
    var breath = Math.random()*100;
    var breathingSpeed = 0.012;
    var syms = [
        [5,3]
    ];
    var innerSym = 3;
    var outerSym = 3;
    var moonSym = 4;
    var innerOffset = 0.4;
    var outerOffset = 0.6;
    var moonOffset = 2.0;
    var innerScale = 0.3;
    var outerScale = 3.4;
    var somaOffset = 0.6;
    var somaScale = 1.6;
    var moonScale = 4.2;
    var moonAlpha = 0.35;
    var hasMoons = true;
    
    var levels = 9;
    
    var opacity = scale/cellMax;
    if (tint==null) {
        if(self.ai){
            tint = getRandomProperty(aiColors);
        }else{
            tint = getRandomProperty(entityColors);
        }
    } 
    if (xPos==null) var xPos = Math.random()*stageWidth;
    if (yPos==null) var yPos = Math.random()*stageHeight;
    
    this.canDodge = true;
    this.canSprint = true;
    this.sprinting = false;
    this.sprintTime = 1600;
    this.sprintCost = 0.2;
    this.timeSinceSprint = 0;
    this.timeSinceDodge = 0;
    this.dodgeDelay = 450;
    this.dodgeCost = 0.5;
    
    this.moveSpeed = 0.04;
    this.jumpSpeed = 0.16;
    this.dodgeSpeed = 0.96;
    this.sprintSpeed = 0.28;
    this.brain = new Brain(this,this.ai);
    this.body = Physics.body('circle', {
        x: xPos, // x-coordinate
        y: yPos, // y-coordinate
        radius: scale * 2.8,
        restitution: 0.65,
        mass: scale/3,
        angle: Math.random(),
        label: 'cell'
    });
    
    this.body.self = self;
    
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
    
    this.recolor = function(newTint){
        tint = newTint;
        this.soma.tint = newTint;
        this.membrane.tint = newTint;
        for (var moon of this.moons){
            moon.view.tint = newTint;
        }
        this.generateOrganelles();
    }
    
    this.reset = function(){
        var prevEnergy = self.energy;
        self.energy = cellMin;
        self.setEnergy(prevEnergy);
    }
    
    this.setEnergy = function(prevEnergy){
        self.setScale(self.energy/prevEnergy);
        outerSym = Math.ceil((self.energy/(maxEnergy*1.5))*levels)+1;
        self.generateOrganelles();
    }
    
    this.grow = function(amount){
        var prevEnergy = self.energy;
        self.energy += amount;
        if(self.ai && self.energy > maxEnergyAi){
            self.energy = maxEnergyAi;
            console.log('constrained');
        }else if(!self.ai && self.energy > maxEnergy){
            self.energy = maxEnergy;
        }
        self.setScale(self.energy/prevEnergy);
        outerSym = Math.ceil((self.energy/(maxEnergy*1.5))*levels)+1;
        self.generateOrganelles();
    }
    this.damage = function(amount){
        var prevEnergy = self.energy;
        self.energy -= amount;
        self.setScale(self.energy/prevEnergy);
        outerSym = Math.ceil((self.energy/(maxEnergy*1.5))*levels)+1;
        self.generateOrganelles();
        if(self.energy<3 && self.ai){
            stage.ents.removeChild(self.sprite);
            world.remove(self.body);
            cells.splice(cells.indexOf(self),1);
            //cellBodies.splice(cells.indexOf(self.body),1);
            setPhysics();
            if(hasMoons){
                for (var moon of self.moons){
                    stage.ents.removeChild(moon.view);
                    world.remove(moon);
                }
            }
        }
    }
    
    this.generateOrganelles = function() {
        if(this.organelles != null){
            for (var old of this.organelles){
                self.sprite.removeChild(old);
            }
        }
        if(this.outerOrganelles != null){
            for (var old of this.outerOrganelles){
                self.sprite.removeChild(old);
            }
        }
        if(this.outerSoma != null){
            for (var old of this.outerSoma){
                self.sprite.removeChild(old);
            }
        }
        this.organelles = [];
        this.outerOrganelles = [];
        this.outerSoma = [];
        // Inner organelles
        var points = getRadialSym(innerSym, {x:0,y:-innerOffset*scale}, {x:0,y:0});
        for (var p of points){
            var og = new PIXI.Sprite(cellSprite);
            og.width = innerScale*scale;
            og.height = innerScale*scale;
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
        points = getRadialSym(outerSym, {x:0,y:-outerOffset*scale}, {x:0,y:0});
        for (var p of points){
            var og = new PIXI.Sprite(cellSprite);
            og.width = outerScale*scale;
            og.height = outerScale*scale;
            og.alpha = 0.4;
            og.tint = tint;//colors.white;
            og.blendMode = PIXI.blendModes.SCREEN;
            og.anchor = {
                x:0.5,
                y:0.5
            };
            og.position.x = p.x;
            og.position.y = p.y;
            this.outerOrganelles.push(og);
            this.sprite.addChild(og);

            var so = new PIXI.Sprite(sprites.bubLt);
            so.width = somaScale*scale;
            so.height = somaScale*scale;
            so.alpha = 0.8;
            so.tint = tint;//colors.white;
            so.blendMode = PIXI.blendModes.SCREEN;
            so.anchor = {
                x:0.5,
                y:0.5
            };
            so.position.x = p.x;
            so.position.y = p.y;
            this.outerSoma.push(so);
            this.sprite.addChild(so);
        }
    }
    
    this.generateOrganelles();
    
    this.breathe = function(){
        breath += breathingSpeed;
        var offset = Math.cos(breath) * (scale*outerOffset);
        var points = getRadialSym(outerSym, {x:0,y:-scale-offset}, {x:0,y:0});
        var i = 0;
        for (var p of points){
            self.outerOrganelles[i].position.x = p.x;
            self.outerOrganelles[i].position.y = p.y;
            i++;
        }
    }
    
    this.anchorPoint = Physics.body('circle', {
        x: this.body.state.pos.x,
        y: this.body.state.pos.y,
        treatment: 'kinematic',
        mass: 0.1,
        hidden: true
    });
    
    world.add(this.anchorPoint);
    
    // Orbiting bodies
    if(hasMoons){
        this.moons = [];
        points = getRadialSym(moonSym, {x:this.body.state.pos.x,y:this.body.state.pos.y-(scale*moonOffset)}, this.body.state.pos);
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
            so.width = scale * moonScale;
            so.height = scale * moonScale;
            so.alpha = moonAlpha;
            so.tint = tint;//colors.white;
            so.blendMode = PIXI.blendModes.SCREEN;
            so.anchor = {
                x:0.5,
                y:0.5
            };
            constraints.distanceConstraint(this.anchorPoint, bd, 0.3);
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
        if(!hasMoons) return;
        var i = 0;
        points = getRadialSym(moonSym, {x:this.body.state.pos.x,y:this.body.state.pos.y-(scale*moonOffset)}, this.body.state.pos);
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
        var dampening = 0.999;
        if (self.body.state.pos.y > stageHeight + offset && self.body.state.vel.y > 0) {
            self.body.state.pos.y = -offset;
            self.body.state.old.pos.y = -offset;
            self.body.state.vel.y *= dampening;//Math.random()*-0.1;
            if(hasMoons) self.resetMoons();
        }else if (self.body.state.pos.y < -offset && self.body.state.vel.y < 0){
            self.body.state.pos.y = stageHeight + offset;
            self.body.state.old.pos.y = stageHeight + offset;
            self.body.state.vel.y *= dampening;// Math.random()*0.01;
            if(hasMoons) self.resetMoons();
        }
        if (self.body.state.pos.x > stageWidth + offset && self.body.state.vel.x > 0) {
            self.body.state.pos.x = -offset;
            self.body.state.old.pos.x = -offset;
            self.body.state.vel.x *= dampening;// Math.random()*-0.1;
            if(hasMoons) self.resetMoons();
        }else if (self.body.state.pos.x < -offset && self.body.state.vel.x < 0) {
            self.body.state.pos.x = stageWidth + offset;
            self.body.state.old.pos.x = stageWidth + offset;
            self.body.state.vel.x *= dampening;// Math.random()*0.1;
            if(hasMoons) self.resetMoons();
        }
        
        if(!this.canDodge){
            this.timeSinceDodge += 10;
            if(this.timeSinceDodge>this.dodgeDelay && this.energy > cellMin+this.dodgeCost){
                this.canDodge = true;
            }
        }
        if(this.sprinting){
            this.timeSinceSprint += 10;
            if(this.timeSinceSprint>this.sprintTime){
                console.log('done sprinting');
                this.sprinting = false;
            }
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
        self.body.state.vel.x *= 0.995;
        self.body.state.vel.y *= 0.995;
        self.body.state.angular.vel *= 0.999;
        
//        if(hasMoons){
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
        if(self.ai){
            self.brain.meander();
        }
        
        self.anchorPoint.state.pos = self.body.state.pos;
        if(self.anchorPoint.old) self.anchorPoint.old.pos = self.body.state.pos;
        self.anchorPoint.state.vel.x = 0;
        self.anchorPoint.state.vel.y = 0;
        self.anchorPoint.state.angular.vel = self.body.state.angular.vel;
        
        self.breathe();
        
        if(Math.random()>0.9999){
            self.resetMoons();
        }
        
        
    }
    this.setScale = function(newScale){
        self.sprite.width *= newScale;
        self.sprite.height *= newScale;
        self.body.geometry.radius *= newScale;
        self.body.mass *= newScale;
        self.body.recalc();
        for (var moon of self.moons){
            moon.view.width *= newScale;
            moon.view.height *= newScale;
        }
    }
    
    world.add(this.body);
    stage.ents.addChild(this.sprite);
    cells.push(this);
    cellBodies.push(this.body);
}