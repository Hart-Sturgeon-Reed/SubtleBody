function Brain(self){
    var brain = this;
    this.idleDur = 0;
    this.movingLeft = Math.random()>0.5;
    this.movingUp = Math.random()>0.5;
    
    var move = self.moveSpeed;
    var jump = self.jumpSpeed;
    
    this.meander = function(){
        if(frame%18==0){
            if(Math.random()>0.95){
                self.body.applyForce({x:equalDist(jump*2),y:equalDist(jump*2)});
            }
            if (Math.random()>0.7){
                self.brain.movingLeft = !self.brain.movingLeft;
            }
            if (Math.random()>0.7){
                self.brain.movingUp = !self.brain.movingUp;
            }
            if (Math.random()>0.6){
                if (self.brain.movingLeft){
                    self.body.applyForce({x:move,y:0});
                }else {
                    self.body.applyForce({x:-move,y:0});
                }
            }else if (Math.random()>0.6){
                if (self.brain.movingUp){
                    self.body.applyForce({x:0.0,y:move});
                }else{
                    self.body.applyForce({x:0.0,y:-move});
                }
            }
        }
    }
}