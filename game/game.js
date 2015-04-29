function setupGame(){
    // create pixi renderer
    renderer = Physics.renderer('pixi', {
        autoResize: true,
        el: 'game', // The DOM element to append the stage to
        meta: false // Turns debug info on/off
    });
    
    initOptions();
    
    // scale cleanly without anti-aliasing
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    
    // set up stage layers
    stage = new TestStage();
    
    // set up interaction models
    modes = [Soma];
    mode = 0;
    model = {
        primary: function(){return Physics.behavior('attractor', {
            order: 1.16,
            strength: 0.4,
            max: 700,
            min: 10
        })},

        secondary: function(){return Physics.behavior('attractor', {
            order: 1.1,
            strength: -0.8,
            max: 60,
            min: 10
        })}
    };

    // set up default particle system
    particleBrush = Sparks;
    userBrushes = [Dancer1,Dancer2];//,User2,User3,User4];
    defaultCursor = addUser(0,true,Pointer,Sparks);
    defaultCursor.enabled = false;
    
    setupParticles();
    
    // create a physics world
    world = new BasicWorld();
    
    // start current interaction model
    modes[mode]();
    
    // add physics entities
    addEntities();
    
    setupCollisions();
    
//    modes[mode]();
    
    // render on each step
    world.on('step', function(){
        //updateCursor();
        updateParticles();
        updateCells();
        updateMotes();
        updateLightBody();
        if(drawMode){
            drawFrame();
        }
        world.render();
    });
    
    // start simulation and rendering
    Physics.util.ticker.on(function(time){
        if(!paused){
            // custom physics and state checking should go here
            for (var ent of entities){
                ent.update();
            }
            if(useParallax){
                sky.scroll();
            }
            if(runSim){
                world.step(time);
            }else{
                updateParticles();
                world.render();
            }
        }
    });
    Physics.util.ticker.start();
}

function setupCollisions(){
    foodQuery = Physics.query({
        $or: [
            { bodyA: { label: 'mote' }, bodyB: { label: 'cell' } }
            ,{ bodyB: { label: 'mote' }, bodyA: { label: 'cell' } }
        ]
    });
    bounceQuery = Physics.query({
        $or: [
            { bodyA: { label: 'cell' }, bodyB: { label: 'cell' } }
            ,{ bodyB: { label: 'cell' }, bodyA: { label: 'cell' } }
        ]
    });
    world.on('collisions:detected', function( data, e ){
        var found = Physics.util.find( data.collisions, foodQuery );
        if ( found ){
            //console.log(found);
            if(found.bodyA.label=='cell'){
                consume(found.bodyA,found.bodyB);
            }else{
                consume(found.bodyB,found.bodyA);
            }
        }
        found = Physics.util.find( data.collisions, bounceQuery );
        if ( found ){
            //console.log(found);
            if(found.bodyA.self.energy>found.bodyB.self.energy){
                bounce(found.bodyA,found.bodyB);
            }else{
                bounce(found.bodyB,found.bodyA);
            }
        }
    });
}