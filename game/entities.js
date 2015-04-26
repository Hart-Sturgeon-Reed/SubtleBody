function setEntityColors(newColors){
    entityColors = newColors;
    for (var entity of entities){
        entity.sprite.tint = getRandomProperty(entityColors);
    }
}
function setEntitySprite(newSprite,opacity){
    entitySprite = newSprite;
    for (var entity of entities){
        entity.sprite.texture = PIXI.Texture.fromImage(entitySprite);
        if(opacity!=null){
            entity.sprite.alpha = opacity;
        }else{
            entity.sprite.alpha = 1.0;
        }
    }
    
}
function setEntitySpriteScale(newScale,scaleY){
    for (var entity of entities){
        if(scaleY==null){
            entity.setScale(newScale);
        }else{
            entity.setScale(newScale,scaleY);
        }
    }
}
function setEntityVel(newVel){
//    for (var entity of entities){
//        entity.body.state.vel = newVel;
//        entity.body.state.acc = {x:0,y:0};
//    }
}
function setEntityBlendMode(newMode){
    for (var entity of entities){
        entity.sprite.blendMode = newMode;
    }
}
function applyForceToEntities(force){
    for (var entity of entities){
        entity.body.applyForce(force);
    }
}
function applyFlow(force){
    for (var mote of moteBodies){
        mote.applyForce(force);
    }
}

function addEntities(){
    for (var i=0;i<cellCount;i++){
        new Cell(i+2);
    }
    for (var i=0;i<moteCount;i++){
        new Mote(i+2);
    }
    
    setPhysics();
    
    console.log(cells.length+' entities added');
}

function setPhysics(){
        collider.applyTo(cellBodies);
        collidable.applyTo(cellBodies.concat(moteBodies));
        orbitalGrav.applyTo(cellBodies);
    }

function Planet(){
    var self = this;
    var scale = (Math.random()*(entitySize.max-entitySize.min))+entitySize.min;
    this.body = Physics.body('circle', {
        x: Math.random()*stageWidth, // x-coordinate
        y: Math.random()*stageHeight, // y-coordinate
//        vx: 0.2, // velocity in x-direction
//        vy: 0.11, // velocity in y-direction,
        radius: scale,
        restitution: 0.9,
        mass: scale/8,
        styles: {
            strokeStyle: colors.darkRed
            ,fillStyle: colors.blue
            ,lineWidth: 1
        },
        angle: Math.random()
    });
    
    this.body.view = new PIXI.Sprite(PIXI.Texture.fromImage(entitySprite));
    this.body.state.angular.vel = equalDist(0.003);
    this.sprite = this.body.view;
    this.sprite.blendMode = PIXI.blendModes.SCREEN;
    this.sprite.anchor = {
        x:0.5,
        y:0.5
    };
    this.spriteScale = scale;
    this.sprite.width = scale * 1.9;
    this.sprite.height = scale * 1.9;
    this.sprite.tint = getRandomProperty(entityColors);//getRandomProperty(colors,restrictedColors);
    this.update = function(){
        if (self.body.state.pos.y > stageHeight + 60 && self.body.state.vel.y > 0) {
            self.body.state.pos.y = -20;
            self.body.state.old.pos.y = -20;
            //self.body.state.vel.y *= 0.6;//Math.random()*-0.1;
        }else if (self.body.state.pos.y < -80 && self.body.state.vel.y < 0){
            self.body.state.pos.y = stageHeight + 20;
            self.body.state.old.pos.y = stageHeight + 20;
            //self.body.state.vel.y *= 0.6;// Math.random()*0.01;
        }
        if (self.body.state.pos.x > stageWidth + 60 && self.body.state.vel.x > 0) {
            self.body.state.pos.x = -20;
            self.body.state.old.pos.x = -20;
            //self.body.state.vel.x *= 0.9;// Math.random()*-0.1;
        }else if (self.body.state.pos.x < -60 && self.body.state.vel.x < 0) {
            self.body.state.pos.x = stageWidth + 20;
            self.body.state.old.x = stageWidth + 20;
            //self.body.state.vel.x *= 0.9;// Math.random()*0.1;
        }
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
    entities.push(this);
}