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

function avg(one,two){
    return (one+two)/2;
}

function clamp(value, min, max){
  if(value>max){
    return max;
  }else if(value<min){
    return min;
  }
  return value;
}

function wrap(value, min, max){
  if(value>max){
    return min + (value-max);
  }else if(value<min){
    return max - (min-value);
  }
  return value;
}

function clampNorm(vector, min, max){
  var norm = vector.clone().norm()
  if (norm>max){
    return vector.normalize().mult(max);
  }else if (norm<min){
    return vector.normalize().mult(min);
  }
  return vector;
}

function range(min, max){
    return min + Math.random()*(max-min);
}
function equalDist(range){
    return (Math.random()*range)-(range/2);
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

function getRadialSym(sym, root, origin, rotation){
    var points = [];
    if(sym==0) return points;
    var root = new Physics.vector(root.x,root.y);
    var origin = new Physics.vector(origin.x,origin.y);
    if(rotation!=null) root = root.rotate(rotation,origin).clone();
    var shift = (2*Math.PI)/sym;
    points.push(root.clone());
    for (var i=1;i<sym;i++){
        points.push(root.rotate(shift,origin).clone());
    }
    return points;
}