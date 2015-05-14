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

function setEdge(collide){
    if(collide){
        world.add(edgeCollider);
    }else{
        world.remove(edgeCollider);
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
    showLayer('cells',true);
    showLayer('drawing',false);
}

function Soma(){
    Defaults();
    console.log('Cell mode');
    world.warp(0.26);
    world.changeGrav(GRV.zero);
    world.changeOrbit(Physics.behavior('newtonian', {
        strength: 0.09,
        max: 180,
        min: 20
    }));
    
    setBackground('black');
    setEntityColors([colors.red,colors.orange,colors.ltOrange]);
    setEntitySprite('/assets/sprites/bubbleLt.png',1);
    setEntitySpriteScale(1.9);
    setEntityBlendMode(PIXI.blendModes.SCREEN);
    useWind = false;
    drawRadial = true;
    
    runSim = true;
    setCollider(true);
    setEdge(true);
    showParallax(false);
    
    model.primary = function(){return Physics.behavior('attractor', {
        order: 1.2,
        strength: 0.8,
        max: 300,
        min: 20
    });}

    model.secondary = function(){return Physics.behavior('attractor', {
        order: 1.2,
        strength: -0.008,
        max: 80,
        min: 10
    });}
}