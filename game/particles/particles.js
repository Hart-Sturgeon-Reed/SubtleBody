particleSprites = {
    circle: PIXI.Texture.fromImage('assets/particles/circle.png'),
    drop: PIXI.Texture.fromImage('assets/particles/drop.png'),
    fire: PIXI.Texture.fromImage('assets/particles/fire.png')
}

function setupParticles(){
    particles = [];
    
    var brush = new particleBrush();
    var pool = new ParticlePool(brush, 200, 60);
    
    defaultCursor.brush = brush;
    defaultCursor.pool = pool;
}

function addParticle(pool,position){
    var np = pool.requestObject();
    np.setPosition(position.x,position.y);
    if(np.new){
        stage.ui.addChild(np.sprite);
        particles.push(np);
    }
}

function updateParticles(){
    frame++;
    if(frame%1==0){
        for (var cursor of cursors){
            if(cursor.enabled){
                if(drawRadial){
                    var points = getRadialSym(5, cursor.position, center);
                    for (var i=0;i<cursor.brush.particleFlow;i++){
                        for (var p of points){
                            addParticle(cursor.pool,p);
                        }
                    }
                }else{
                    for (var i=0;i<cursor.brush.particleFlow;i++){
                        addParticle(cursor.pool,cursor.position);
                    }
                }
            }
        }
    }
    if(frame%1==0){
        for (var p of particles){
            p.update();
            if(p.dead){
                p.pool.returnObject(p);
            }
        }
    }
}

function Minimal(){
    this.gravity = 0.02;
    this.particleFlow = 1;
    this.particleSpeed = 0.8;
    this.particleSpread = 6;
    this.particleLifespan = 20;
    this.particleOpacity = 1;
    this.particleTint = colors.white;
    this.primary = colors.white;
    this.secondary = colors.black;
    this.paint = colors.green;
    this.particleSprite = particleSprites.circle;
    this.particleSize = {
        min: 10,
        max: 12
    }
}

function FireTrail() {
    this.gravity = -1.8;
    this.particleFlow = 20;
    this.particleSpeed = 1.6;
    this.particleSpread = 12;
    this.particleLifespan = 35;
    this.particleOpacity = 0.86;
    this.particleTint = colors.orange;
    this.primary = colors.orange;
    this.secondary = colors.deepBlue;
    this.particleSprite = particleSprites.fire;
    this.particleSize = {
        min: 1,
        max: 14
    }
}

function BasicCircles() {
    this.gravity = 0.04;
    this.particleFlow = 2;
    this.particleSpeed = 1.6;
    this.particleSpread = 8;
    this.particleLifespan = 65;
    this.particleOpacity = 1;
    this.particleSprite = particleSprites.circle;
    this.particleSize = {
        min: 10,
        max: 18
    }
    //Default, will be overridden
    this.particleTint = colors.white;
    this.primary = colors.white;
    this.secondary = colors.black;
}

function Dancer() {
    this.gravity = 0;
    this.particleFlow = 6;
    this.particleSpeed = 0.8;
    this.particleSpread = 0;
    this.particleLifespan = 15;
    this.particleOpacity = 0.28;
    this.particleTint = colors.orange;
    this.primary = colors.orange;
    this.secondary = colors.deepBlue;
    this.particleSprite = particleSprites.circle;
    this.particleSize = {
        min: 8,
        max: 18
    }
}

function Dancer1() {
    Dancer.call(this);
    this.primary = colors.teal
    this.secondary = colors.blue
    this.paint = colors.dkBlue;

    this.particleTint = this.primary;
    
}
function Dancer2() {
    Dancer.call(this);
    this.primary = colors.green
    this.secondary = colors.purple
    this.paint = colors.indigo;

    this.particleTint = this.primary;
}

function User1() {
    BasicCircles.call(this);
    this.primary = brushColors.orange;
    this.secondary = brushColors.green;
    this.paint = colors.green;
    
    this.particleTint = this.primary;
}

function User2() {
    BasicCircles.call(this);
    this.primary = brushColors.green;
    this.secondary = brushColors.blue;
    this.paint = colors.teal;
    
    this.particleTint = this.primary;
}

function User3() {
    BasicCircles.call(this);
    this.primary = brushColors.purple;
    this.secondary = brushColors.dkBlue;
    this.paint = colors.purple;
    
    this.particleTint = this.primary;
}

function User4() {
    BasicCircles.call(this);
    this.primary = brushColors.red;
    this.secondary = brushColors.yellow;
    this.paint = colors.red;
    
    this.particleTint = this.primary;
}


function Fireflies() {
    BasicCircles.call(this);
    this.particleTint = colors.yellow;
    this.primary = colors.yellow;
    this.secondary = colors.red;
}

function Ghostflies() {
    BasicCircles.call(this);
    this.particleTint = colors.green;
    this.primary = colors.green;
    this.secondary = colors.indigo;
}

function Sparks() {
    BasicCircles.call(this);
    this.particleTint = colors.teal;
    this.primary = colors.teal;
    this.secondary = colors.dkBlue;
    this.particleSprite = particleSprites.circle;
}