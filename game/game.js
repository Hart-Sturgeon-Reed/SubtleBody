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
    
    setupParticles();
    
    // create a physics world
    world = new BasicWorld();
    
    // start current interaction model
    modes[mode]();
    
    // add physics entities
    addEntities();
    
//    modes[mode]();
    
    // render on each step
    world.on('step', function(){
        //updateCursor();
        updateParticles();
        updateCells();
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