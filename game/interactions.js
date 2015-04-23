function switchMode(){
    mode++;
    if(mode>modes.length-1){
        mode = 0;
    }
    disableAllEffects();
    modes[mode]();
    for (var cursor of cursors){
        cursor.primary = model.primary();
        cursor.secondary = model.secondary();
    }
}

function setCollider(collide){
    if (collide && collider == null){
        collider = Physics.behavior('body-impulse-response');
        world.add(collider);
    } else if (!collide && collider != null){
        world.remove(collider);
        collider = null;
    }
}

function showParallax(visible){
    stage.parallax.visible = visible;
    stage.background.visible = visible;
}
function showLayer(layer,visible){
    stage[layer].visible = visible;
}

function Defaults(){
    drawRadial = false;
    drawMode = false;
    useWind = false;
    setEntitySprite('/assets/sprites/planet.png');
    showLayer('ents',true);
    showLayer('drawing',false);
}

function Dance(){
    Defaults();
    setBackground('angles');
    showLayer('ents',false);
    showParallax(false);
}

function Blackhole(){
    Defaults();
    console.log('Blackhole mode');
    world.warp(0.20);
    world.changeGrav(GRV.zero);
    
    setBackground('stars');
    setEntitySprite('/assets/sprites/planet.png');
    setEntityColors([colors.blue,colors.green,colors.dkBlue]);
    setEntitySpriteScale(1.9);
    setEntityVel({x:0,y:0});
    useWind = false;
    
    setCollider(true);
    
    model.primary = function(){return Physics.behavior('attractor', {
            order: 1.16,
            strength: 0.32,
            max: 460,
            min: 10
    });}

    model.secondary = function(){return Physics.behavior('attractor', {
        order: 1.1,
        strength: -0.8,
        max: 60,
        min: 10
    });}
}

function Leaves(){
    Defaults();
    console.log('Leaves mode');
    world.warp(0.36);
    world.changeGrav(GRV.micro);
    world.changeOrbit(Physics.behavior('newtonian', {
        strength: 0.31,
        max: 180,
        min: 20
    }));
    setEntitySprite('/assets/leaves/leaf_01.png');
    setEntityColors([colors.orange]);
    setCollider(false);
    setEntitySpriteScale(1,2);
    setEntityBlendMode(PIXI.blendModes.NORMAL);
    useWind = true;
    
    setBackground('tree');
    showParallax(false);
    
    model.secondary = function(){return Physics.behavior('attractor', {
        order: 1,
        strength: 0.6,
        max: 1200,
        min: 0
    });}

    model.primary = function(){return Physics.behavior('attractor', {
        order: 1,
        strength: -0.38,
        max: 860,
        min: 60
    });}
}

function Snow(){
    Defaults();
    console.log('Fluid mode');
    world.warp(0.6);
    world.changeGrav(GRV.micro);
    setEntitySprite('/assets/sprites/wisp.png');
    setEntityColors([colors.white]);
    setCollider(false);
    setEntitySpriteScale(0.6);
    setEntityBlendMode(PIXI.blendModes.SCREEN);
    useWind = true;
    drawRadial = true;
    
    setBackground('canvas');
    showParallax(false);
    
    model.secondary = function(){return Physics.behavior('attractor', {
        order: 1.2,
        strength: 0.4,
        max: 600,
        min: 10
    });}

    model.primary = function(){return Physics.behavior('attractor', {
        order: 1,
        strength: -0.06,
        max: 160,
        min: 60
    });}
}

function Radial(){
    Defaults();
    console.log('Radial mode');
    world.warp(0.6);
    world.changeGrav(GRV.micro);
    setEntitySprite('/assets/sprites/wisp.png');
    setEntityColors([colors.white]);
    setCollider(false);
    setEntitySpriteScale(0.6);
    setEntityBlendMode(PIXI.blendModes.NORMAL);
    useWind = true;
    drawRadial = true;
    
    setBackground('angles');
    showParallax(false);
    showLayer('ents',false);
    
    model.secondary = function(){return Physics.behavior('attractor', {
        order: 1.2,
        strength: 0.4,
        max: 600,
        min: 10
    });}

    model.primary = function(){return Physics.behavior('attractor', {
        order: 1,
        strength: -0.06,
        max: 160,
        min: 60
    });}
}

function Paint(){
    Defaults();
    console.log('Painting mode');
    world.warp(0.6);
    world.changeGrav(GRV.zero);
    setEntitySprite('/assets/sprites/bubbleLt.png');
    setEntityColors([colors.red]);
    setCollider(false);
    setEntitySpriteScale(0.6);
    setEntityBlendMode(PIXI.blendModes.SCREEN);
    useWind = true;
    drawRadial = false;
    drawMode = true;

    setBackground('canvas');
    showParallax(false);
    showLayer('ents',false);
    showLayer('drawing',true);
    
    model.secondary = function(){return Physics.behavior('attractor', {
        order: 0.1,
        strength: 0.01,
        max: 400,
        min: 10
    });}

    model.primary = function(){return Physics.behavior('attractor', {
        order: 1,
        strength: -0.06,
        max: 160,
        min: 60
    });}
    
}

function Firefly(){
    Defaults();
    console.log('Firefly mode');
    world.warp(0.18);
    world.changeGrav(GRV.micro);
    
    setBackground('sunset');
    showParallax(true);
    
    setCollider(false);
    setEntitySprite('/assets/sprites/wispLt.png');
    setEntityColors([colors.ltOrange]);
    setEntitySpriteScale(3.6);
    setEntityBlendMode(PIXI.blendModes.SCREEN);
    useWind = false;
    
    model.primary = function(){return Physics.behavior('attractor', {
        order: 1.2,
        strength: 0.5,
        max: 300,
        min: 10
    });}

    model.secondary = function(){return Physics.behavior('attractor', {
        order: 1,
        strength: -0.9,
        max: 160,
        min: 0
    });}
}

function Organism(){
    Defaults();
    console.log('Organism mode');
    world.warp(0.76);
    world.changeGrav(GRV.low);
    world.changeOrbit(Physics.behavior('newtonian', {
        strength: 0.11,
        max: 180,
        min: 20
    }));
    
    setBackground('canvas');
    setEntityColors([colors.white,colors.blue,colors.dkBlue]);
    setEntitySprite('/assets/sprites/bubbleLt.png',1);
    setEntitySpriteScale(1.9);
    setEntityBlendMode(PIXI.blendModes.SCREEN);
    useWind = false;
    
    setCollider(true);
    showParallax(false);
    
    model.primary = function(){return Physics.behavior('attractor', {
        order: 1.16,
        strength: 0.6,
        max: 700,
        min: 10
    });}

    model.secondary = function(){return Physics.behavior('attractor', {
        order: 1.2,
        strength: -6.8,
        max: 80,
        min: 10
    });}
}
