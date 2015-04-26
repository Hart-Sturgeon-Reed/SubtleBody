function consume(cell, mote){
    //console.log('nom');
    cell.self.grow(mote.self.energy*0.07);
    cell.self.resetMoons();
    stage.motes.removeChild(mote.self.sprite);
    world.remove(mote);
    motes.splice(motes.indexOf(mote.self),1);
    moteBodies.splice(moteBodies.indexOf(mote),1);
    mote = null;
    deadMotes.push('');
}
function bounce(larger, smaller){
    //console.log('bounce');
    larger.self.resetMoons();
    smaller.self.resetMoons();
    var force = 0.002;// * (larger.self.energy/smaller.self.energy);
    var norm = smaller.state.vel.normalize();
    smaller.applyForce({x:force*norm.x,y:force*-norm.y});
    
    var diff = larger.self.energy-smaller.self.energy;
    larger.self.grow(smaller.self.energy*0.004);
    smaller.self.damage(diff/10);
    //smaller.self.damage(larger.state.vel.norm());
}