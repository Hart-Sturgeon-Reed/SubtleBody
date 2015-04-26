function consume(cell, mote){
    //console.log('nom');
    cell.self.grow(mote.self.energy/12);
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
    smaller.applyForce({x:larger.state.vel.x*-0.4,y:larger.state.vel.y*-0.4});
    
    var diff = larger.self.energy-smaller.self.energy;
    larger.self.grow(smaller.self.energy*0.007);
    smaller.self.damage(diff/12);
    //smaller.self.damage(larger.state.vel.norm());
}