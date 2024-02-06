class Camera {

  constructor() {
    this.spin = new Quat(1,0,0,0);
    this.pos = new Vec3(0,0,0);
    this.velocity = new Vec3(0,0,-1);
    this.rot = new Vec3(0,0,0);
    
    this.animate = false;

    this.prevPos = new Vec3(0,0,0);
    this.prevSpin = new Quat(1,0,0,0);

    this.nextPos = new Vec3(0,0,0);
    this.nextSpin = new Quat(1,0,0,0);

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

  isWalkingToGrid =(edge, grid, currentGrid, dotThresh, perpThresh)=> {
        
        let e1_e0 = Vec3.subtract(edge.p1, edge.p0);
        let e1_e0_nor = e1_e0.normal();
        let p_e0 = Vec3.subtract(this.pos, edge.p0);
        let dotPE = Vec3.dot(p_e0, e1_e0_nor);
        let prlToEdge = Vec3.scale(dotPE, e1_e0_nor);
        let pplToEdge = Vec3.subtract(p_e0, prlToEdge);
        let pplDistance = pplToEdge.length();
        let dotPplVelocity = Vec3.dot(pplToEdge, this.velocity);
        let normalizedDotPE = dotPE / e1_e0.length();  

        if(pplDistance > perpThresh){
            return false;
        }

        if(normalizedDotPE <= 0.0 || normalizedDotPE >= 1.0){
            return false;
        }

        if(dotPplVelocity > dotThresh){
            return false;
        }

        return true;


    }


  orientWithGrid =(newGrid, prevGrid, edge)=> {
    Vec3.equal(this.prevPos, this.pos);
    Quat.equal(this.prevSpin, this.spin);
    this.animate = true;

    // normals always in direction plane to camPos
    let newGridNormal = newGrid.normal;
    let prevGridNormal = prevGrid.normal; 
    
    // outside or inside
    let outside = !edge.relativeUp;
    
    // pos in the plane
    let squishedPos = Vec3.subtract(this.pos, prevGridNormal); // height is 1 no need to multiply normal with height
    
    // angle between normals
    let angleBetweenNormals = Math.acos(Vec3.dot(newGridNormal,prevGridNormal));
    let angle = Math.PI - angleBetweenNormals;
    if(outside){
        angle = 2*Math.PI - angle;
    }
     
    // perpendicular to edge
    let p_e0 = Vec3.subtract(squishedPos, edge.p0);
    let e1_e0_nor = (Vec3.subtract(edge.p1, edge.p0)).normal();
    let dotPE = Vec3.dot(p_e0, e1_e0_nor);
    let prlToEdge = Vec3.scale(dotPE, e1_e0_nor);
    let pplToEdge = Vec3.subtract(p_e0, prlToEdge);

    // rotation quaternion
    let cosAngle = Math.cos(angle/2.0);
    let sinAngle = Math.sin(angle/2.0);

    // get correct right hand rule position shit as rotation should be from prevGrid to newGrid only
    let cross = Vec3.cross(e1_e0_nor, pplToEdge.normal());
    let dotCrossNor = Vec3.dot(cross, prevGridNormal);
    if(dotCrossNor < 0.0){ // not good sir
        e1_e0_nor = Vec3.scale(-1, e1_e0_nor);
    }
    
    let edgeSpin = new Quat(cosAngle, sinAngle*e1_e0_nor.get(0), sinAngle*e1_e0_nor.get(1), sinAngle*e1_e0_nor.get(2)); 


    let pplToEdgeRotated = edgeSpin.rotateVec3(pplToEdge);



    // new pos
    this.pos = Vec3.add(edge.p0,  prlToEdge); // pivot in world space
    this.pos = Vec3.add(this.pos, pplToEdgeRotated); // the rotation
    this.pos = Vec3.add(this.pos, newGridNormal); // height wrt new plane

    this.velocity = pplToEdgeRotated.normal();
    
    // new spin 
    if(outside){
        let cosAngle1 = Math.cos(angleBetweenNormals/2.0);
        let sinAngle1 = Math.sin(angleBetweenNormals/2.0);
        let edgeSpin1 = new Quat(cosAngle1,sinAngle1*e1_e0_nor.get(0),sinAngle1*e1_e0_nor.get(1),sinAngle1*e1_e0_nor.get(2));
        this.spin = Quat.multiply(edgeSpin1, this.spin);
    }else{
        let angle1 = -(Math.PI - angle);
        let cosAngle1 = Math.cos(angle1/2.0);
        let sinAngle1 = Math.sin(angle1/2.0);
        let edgeSpin1 = new Quat(cosAngle1,sinAngle1*e1_e0_nor.get(0),sinAngle1*e1_e0_nor.get(1),sinAngle1*e1_e0_nor.get(2));
        this.spin = Quat.multiply(edgeSpin1, this.spin);
    }
    
    Vec3.equal(this.nextPos, this.pos);
    Vec3.equal(this.pos, this.prevPos);
    Quat.equal(this.nextSpin, this.spin);
    Quat.equal(this.spin, this.prevSpin);

  }


  linearInterpolate =(parametricT)=> {
    this.pos = Vec3.add( 
                    Vec3.scale(1.0-parametricT,this.prevPos),
                    Vec3.scale(parametricT, this.nextPos)
                    );
    this.spin = Quat.add(
                    Quat.scale(1.0-parametricT, this.prevSpin),
                    Quat.scale(parametricT, this.nextSpin)
                    );
  }

}
