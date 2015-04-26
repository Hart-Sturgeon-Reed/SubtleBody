function LightBody(skeleton){
    var self = this;
    this.skeleton = skeleton;
    console.log('LightBody created');
    this.update = function(data){
        if(self.skeleton) {
            self.skeleton.update(data);
            if(useWind){
                var delta = self.skeleton.torso.getDelta(1);
                var force = {x:delta.x*0.001,y:delta.y*-0.001};

                console.log(delta);
                applyFlow(force);
            }
        }
    }
    
}

function createLightBody(skeleton){
    lightBody = new LightBody(skeleton);
    lightBodyCreated = true;
    lightBodyVisible = true;
}

function hideLightBody(){
    lightBodyVisible = false;
}