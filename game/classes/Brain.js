function Brain(self,ai){
    var brain = this;
    this.ai = ai;
    this.idleDur = 0;
    this.movingLeft = Math.random()>0.5;
    this.movingUp = Math.random()>0.5;
    
    var move = self.moveSpeed;
    var sprint = self.sprintSpeed;
    var jump = self.jumpSpeed;
    var dodge = self.dodgeSpeed;
    
    this.move = function(accel){
        if(self.sprinting){
            self.body.applyForce({x:accel.xTilt*sprint,y:-accel.yTilt*sprint});
        }else{
            self.body.applyForce({x:accel.xTilt*move,y:-accel.yTilt*move});
        }
        
    }
    
    this.dodge = function(accel){
        //console.log('trying to dodge');
        if(self.canDodge){
            //console.log('dodging');
            self.canDodge = false;
            self.timeSinceDodge = 0;
            self.body.applyForce({x:accel.xTilt*dodge,y:-accel.yTilt*dodge});
            var prevEnergy = self.energy;
            self.energy -= self.dodgeCost;
            self.setEnergy(prevEnergy);
        }
    }
    
    this.sprint = function(accel){
        if(!self.sprinting && self.energy>cellMin+self.sprintCost){
            console.log('sprinting');
            self.sprinting = true;
            self.sprintTime = 0;
            var prevEnergy = self.energy;
            self.energy -= self.sprintCost;
            self.setEnergy(prevEnergy);
        }
    }
    
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
                }else{
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