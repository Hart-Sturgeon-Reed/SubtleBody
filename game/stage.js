function TestStage(){
    var stage = new PIXI.DisplayObjectContainer();
    var mandala = new PIXI.DisplayObjectContainer();
    var motes = new PIXI.DisplayObjectContainer();
    var ents = new PIXI.DisplayObjectContainer();
    var ui = new PIXI.DisplayObjectContainer();
    var parallax = new PIXI.DisplayObjectContainer();
    var background = new PIXI.DisplayObjectContainer();
    var foreground = new PIXI.DisplayObjectContainer();
    var drawing = new PIXI.DisplayObjectContainer();
    renderer.stage.addChild(stage);
    stage.addChild(parallax);
    stage.addChild(background);
    stage.addChild(drawing);
    stage.addChild(mandala);
    stage.addChild(motes);
    stage.addChild(ents);
    stage.addChild(ui);
    stage.addChild(foreground);
    stage.parallax = parallax;
    stage.drawing = drawing;
    stage.background = background;
    stage.mandala = mandala;
    stage.motes = motes;
    stage.ents = ents;
    stage.ui = ui;
    stage.foreground = foreground;
    
    if(widescreen){
        stageWidth = renderer.width*2;
        stageHeight = renderer.height*2;
    }else{
        stageWidth = renderer.width;
        stageHeight = renderer.height;
    }
    
    
    //Parallax
    if(useParallax){
        skyScroll = -0.08;
        m1Scroll = 0.01;
        m2Scroll = 0.04;

        mountain1 = new ParallaxLayer(mountain1tex,m1Scroll);
        mountain2 = new ParallaxLayer(mountain2tex,m2Scroll);
        sky = new ParallaxLayer(skytex,skyScroll,'ver');
        //sky.tint = 0xEEEEEE;
        sky.tilePosition.y -= 1800;

        m = new PIXI.Sprite(mountain2tex)
        m.anchor = {
            x:0,
            y:-1.3
        }
        m2 = new PIXI.Sprite(mountain1tex);
        m2.anchor = {
            x:0,
            y:-1.1
        }

        stage.parallax.addChild(sky);
        //stage.parallax.addChild(m2);
        stage.background.addChild(m);
        stage.parallax.addChild(mountain1);
        stage.parallax.addChild(mountain2);
    }
    
    dotFilter = new PIXI.DotScreenFilter();
    pixelFilter = new PIXI.PixelateFilter();
    invertFilter = new PIXI.InvertFilter();
    pixelFilter.size.x = 2;
    pixelFilter.size.y = 2;
    blurFilter = new PIXI.BlurFilter();
    //blurFilter.blur = 2;
//    stage.filters = [invertFilter];
    
    center = Physics.vector(stageWidth/2,stageHeight/2);
    
    console.log("Stage is "+stageWidth+"px wide & "+stageHeight+"px high");
    
    stage.scale = {x:0.5, y:0.5};
    
    return stage;
}

function ParallaxLayer(texture,scrollSpeed,scrollDir,scale){
    var tex;
    if(typeof texture == 'string'){
        tex = PIXI.Texture.fromImage(texture);
    }else{
        tex = texture;
    }
    var sprite = new PIXI.TilingSprite(tex,stageWidth,stageHeight);
    sprite.anchor = {
        x: 0,
        y: 0
    }
    sprite.scrollSpeed = scrollSpeed;
    if (scrollDir == 'hor' || scrollDir == null){
        sprite.scroll = function(){
            sprite.tilePosition.x -= sprite.scrollSpeed;
        }
    }else{
        sprite.scroll = function(){
            sprite.tilePosition.y -= sprite.scrollSpeed;
        }
    }
    if(scale != null){
        sprite.tileScale = {
            x:scale,
            y:scale
        }
    }
    return sprite;
}