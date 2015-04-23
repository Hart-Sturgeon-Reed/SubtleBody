function LightBody(skeleton){
    var self = this;
    this.skeleton = skeleton;
    this.update = function(data){
        self.skeleton.update(data);
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