class Camera {

  constructor() {
    this.spin = new Quat(1,0,0,0);
    this.pos = new Vec3(0,0,0);
    this.velocity = new Vec3(0,0,-1);
    this.rot = new Vec3(0,0,0);


  }

  setPosition =(x,y,z)=> {
    this.pos.set(0,x);
    this.pos.set(1,y);
    this.pos.set(2,z);
  }

  getPosition =()=> {
    return this.pos;
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
  }

  translate =(forward, strafe)=> {
    let mv = new Quat(0, strafe, 0, -1.0 * forward);
    mv = Quat.multiplyMany(this.spin, mv, this.spin.conjugate());
    this.velocity.set(0, mv.get(1));
    this.velocity.set(1, mv.get(2));
    this.velocity.set(2, mv.get(3));
    this.pos = Vec3.add(this.pos, new Vec3(mv.get(1), mv.get(2), mv.get(3)));
  }

  translateGravity =(forward, strafe, gridNormal)=> { 
		if(forward == 0 && strafe == 0){
			return;
		}
    let mv = new Quat(0, strafe, 0, -1.0 * forward);
    mv = Quat.multiplyMany(this.spin, mv, this.spin.conjugate());
    let motion = new Vec3(mv.get(1), mv.get(2), mv.get(3));
    let dotted = Vec3.dot(motion, gridNormal);  
    let motionInGridNormalDirection = Vec3.scale(dotted, gridNormal);
    let adder = Vec3.subtract(motion,motionInGridNormalDirection);
    this.pos = Vec3.add(this.pos, adder);
		adder = adder.normal();

    this.velocity.set(0, adder.get(0));
    this.velocity.set(1, adder.get(1));
    this.velocity.set(2, adder.get(2));
		
  }


  getVelocity =()=> {
    return this.velocity;
  }

	isWalkingToGrid =(edge, dotThresh, perpThresh)=> {
		let p_e0 = Vec3.subtract(this.pos, edge.p0);
		let e1_e0 = Vec3.subtract(edge.p1, edge.p0);
		let dotPE = Vec3.dot(p_e0, e1_e0);
		let projPtoE = Vec3.scale(dotPE, e1_e0.normal());
		let perpPtoE = Vec3.subtract(p_e0, projPtoE);
		let perpPtoE_nor = perpPtoE.normal();
		let dotToVelocity = Vec3.dot(perpPtoE_nor, this.velocity);
		if(dotToVelocity > dotThresh){ // not walking towards plane
			console.log("dot Vectors ", perpPtoE_nor, this.velocity);
			return false;
		}
		let normalizedDot = dotPE / e1_e0.length(); 
		if(normalizedDot <= 0 || normalizedDot >= 1){ // should be between 0 && 1
			console.log("normalizedDot " + normalizedDot);
			return false;
		}
		if(perpPtoE.length() > perpThresh){
			console.log("perpLength " + perpPtoE.length());
			return false;
		}

		return true;
	}


  orientWithGrid =(grid, edge)=> {

    let rad = Math.PI / 180.0;
    let radx = this.rot.get(0)/2.0 * rad, rady = this.rot.get(1)/2.0 * rad;
    
    let cx = Math.cos(radx), sx = Math.sin(radx);
    let cy = Math.cos(rady), sy = Math.sin(rady);
    
    let rotatedY = new Quat(cy, sy*grid.getNormal().get(0), sy*grid.getNormal().get(1), sy*grid.getNormal().get(2));
		let rotation = edge.relativeUp ? grid.getRotation() : grid.getRotation().conjugate();
    this.spin = Quat.multiplyMany(rotatedY, rotation, new Quat(cx, sx, 0, 0));

		let e1_e0 = Vec3.subtract(edge.p1, edge.p0);
		let p_e0 = Vec3.subtract(this.pos, edge.p0);
		let dotPE = Vec3.dot(e1_e0, p_e0);
		let e1_e0_nor = e1_e0.normal();
		let proj = Vec3.scale(dotPE, e1_e0_nor);
		let edgeCenter = Vec3.scale(0.5, Vec3.add(edge.p0,edge.p1));
		let forward = (Vec3.subtract(grid.pos, edgeCenter)).normal();
		let dotForE = Vec3.dot( e1_e0_nor, forward );
		let perpForw = Vec3.scale(dotForE, e1_e0_nor);
		forward = Vec3.subtract(forward, perpForw);
		let up = edge.relativeUp ? grid.getNormal() : Vec3.scale(-1.0, grid.getNormal());
		this.pos = Vec3.add(proj, edgeCenter);
		this.pos = Vec3.add(this.pos, up); 
		this.pos = Vec3.add(this.pos, edge.p0);

  }



}
