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
        new Cell();
    }
    for (var i=0;i<moteCount;i++){
        new Mote(i+2);
    }
    
    setPhysics();
    
    console.log(cells.length+' cells added');
}

function setPhysics(){
    collider.applyTo(cellBodies);
    collidable.applyTo(cellBodies.concat(moteBodies));
    orbitalGrav.applyTo(cellBodies.concat(moteBodies));
    edgeCollider.applyTo(cellBodies);
}