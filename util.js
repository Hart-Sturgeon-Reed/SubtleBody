function getRandomProperty(obj, exclude) {
    var result = randProp(obj);
    if(exclude != null)
        while (arrayContains(exclude,result))
            result = randProp(obj);
    
    return obj[result];
}

function randProp(obj){
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function contains(obj, exclude) {
    for (var prop in obj) {
        if (prop === exclude) {
            return true;
        }
    }
    return false;
}

function arrayContains(array, element) {
    for (var exclude of array) {
        if (element === exclude) {
            return true;
        }
    }
    return false;
}

function range(min, max){
    return min + Math.random()*max-min;
}
function equalDist(range){
    return (Math.random()*range)-(Math.random()*(range/2));
}

function animTo(target,tween,time)
{if(!tween){tween={}}if(!time){time=1}
    new TweenLite.to(target,time,tween).play();
}
function animFrom(target,tween,time)
{if(!tween){tween={}}if(!time){time=1}
    new TweenLite.from(target,time,tween).play();
}
function animFromTo(target,from,to,time)
{if(!from){from={}}{if(!to){to={}}if(!time){time=1}}
    new TweenLite.to(target,time,from,to).play();
}

function TexturePack(){
    var self = this;
    this.tex = 0;
    this.add = function(label,src){
        self[label] = PIXI.Texture.fromFrame(src);
        self.tex++;
    }
}

function getRadialSym(sym, root, origin, offset){
    var points = [];
    var root = new Physics.vector(root.x,root.y);
    var shift = (2*Math.PI)/sym;
    points.push(root.clone());
    for (var i=1;i<sym;i++){
        points.push(root.rotate(shift,origin).clone());
    }
    return points;
}