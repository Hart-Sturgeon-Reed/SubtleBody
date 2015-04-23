function drawFrame(){
    for (var cursor of cursors){
        if(cursor.draw){
            drawRadialStrokes(8, {x:cursor.x,y:cursor.y},cursor.brush.paint,cursor.getDelta(10),center);
//            var markers = getRadialSym(8,cursor.position,center);
//            for (var marker of markers){
//                drawRadialStrokes(8, {x:marker.x,y:marker.y},cursor.brush.paint,cursor.getDelta(10),center);
//            }
        }
    }
}

function drawRadialStrokes(sym, pos, color, delta, center){
    var oldPos = new Physics.vector(pos.x,pos.y);
    var dist = oldPos.dist(new Physics.vector(center.x,center.y));
    var scale = 2+((dist/800)*12);
    var offset = ((dist/800)*120);
    var newPos = oldPos.clone().add(0,offset);
    var markers = getRadialSym(sym,newPos,oldPos);
    for (var marker of markers){
        var circle = new PIXI.Sprite(particleSprites.circle);
        circle.width = scale;
        circle.height = scale;
        circle.position = { x:marker.x, y:marker.y}
        circle.anchor = {x:0.5,y:0.5};
        circle.alpha = 0.8;
        circle.tint = color;
        circle.blendMode = PIXI.blendModes.SCREEN;
        
        stage.drawing.addChild(circle);
    }
}