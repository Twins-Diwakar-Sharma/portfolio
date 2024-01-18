class Camera {

  constructor() {
    this.spin = new Quat(1,0,0,0);
    this.position = new Vec3(0,0,0);
    this.mvDir = new Vec3(0,0,0);
    this.rot = new Vec3(0,0,0);
  }

  setPosition =(x,y,z)=> {
    this.position.set(0,x);
    this.position.set(1,y);
    this.position.set(2,z);
  }

  getPosition =()=> {
    return this.position;
  }

  rotate =(x,y,z)=> {
    this.rot.data[0] += x;
    this.rot.data[1] += y;
    this.rot.data[2] += z;
    for(let i=0; i<3; i++){
      if(this.rot.data[i] > 360.0){
        this.rot.data[i] -= 360.0;
      }
    }

    let rad = Math.PI / 180.0;
    let radx = x/2 * rad, rady = y/2 * rad, radz = z/2 * rad;
    
    let cx = Math.cos(radx), sx = Math.sin(radx);
    let cy = Math.cos(rady), sy = Math.sin(rady);
    let cz = Math.cos(radz), sz = Math.sin(radz);


    this.spin = Quat.multiplyMany(new Quat(cy, 0, sy, 0), this.spin, new Quat(cx, sx, 0, 0), new Quat(cz, 0, 0, sz));
  }

  rotateGravity =(x,y, gridNormal)=> {
    this.rot.data[0] += x;
    this.rot.data[1] += y;
    for(let i=0; i<2; i++){
      if(this.rot.data[i] > 360.0){
        this.rot.data[i] -= 360.0;
      }
    }

    let rad = Math.PI / 180.0;
    let radx = x/2.0 * rad, rady = y/2.0 * rad;
    
    let cx = Math.cos(radx), sx = Math.sin(radx);
    let cy = Math.cos(rady), sy = Math.sin(rady);
    
    let rotatedY = new Quat(cy, sy*gridNormal.get(0), sy*gridNormal.get(1), sy*gridNormal.get(2));
    this.spin = Quat.multiplyMany(rotatedY, this.spin, new Quat(cx, sx, 0, 0));
    //this.spin = Quat.multiplyMany(this.spin, new Quat(cx, sx, 0, 0));
  }

  translate =(forward, strafe)=> {
    let mv = new Quat(0, strafe, 0, -1.0 * forward);
    mv = Quat.multiplyMany(this.spin, mv, this.spin.conjugate());
    this.mvDir.set(0, mv.get(1));
    this.mvDir.set(1, mv.get(2));
    this.mvDir.set(2, mv.get(3));
    this.position = Vec3.add(this.position, new Vec3(mv.get(1), mv.get(2), mv.get(3)));
  }

  translateGravity =(forward, strafe, gridNormal)=> { 
    let mv = new Quat(0, strafe, 0, -1.0 * forward);
    mv = Quat.multiplyMany(this.spin, mv, this.spin.conjugate());
    let motion = new Vec3(mv.get(1), mv.get(2), mv.get(3));
    let dotted = Vec3.dot(motion, gridNormal);  
    let motionInGridNormalDirection = Vec3.scale(dotted, gridNormal);
    let adder = Vec3.subtract(motion,motionInGridNormalDirection);
    this.mvDir.set(0, adder.get(0));
    this.mvDir.set(1, adder.get(1));
    this.mvDir.set(2, adder.get(2));
    this.position = Vec3.add(this.position, adder);
  }

  orientWithGrid =(grid)=> {

    let rad = Math.PI / 180.0;
    let radx = this.rot.get(0)/2.0 * rad, rady = this.rot.get(1)/2.0 * rad;
    
    let cx = Math.cos(radx), sx = Math.sin(radx);
    let cy = Math.cos(rady), sy = Math.sin(rady);
    
    let rotatedY = new Quat(cy, sy*grid.getNormal().get(0), sy*grid.getNormal().get(1), sy*grid.getNormal().get(2));
    this.spin = Quat.multiplyMany(rotatedY, grid.getRotation(), new Quat(cx, sx, 0, 0));
  }

  getMoveDirection =()=> {
    return this.mvDir;
  }

}
