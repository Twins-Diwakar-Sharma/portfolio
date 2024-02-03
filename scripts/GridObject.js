class GridObject extends Object{

  constructor(mesh) {
		super();
		this.mesh = mesh;
		this.pos = new Vec3(0,0,0);
		this.scl = new Vec3(1,1,1);
		this.spin = new Quat(1,0,0,0);
		this.color = new Vec3(1.0,1.0,1.0);
		this.normal = new Vec3(0,1,0);
        this.upSide = true;
  }
  
  bind =()=> {
		this.mesh.bind();
  }

  unbind =()=> {
		this.mesh.unbind();
  }

  size =()=> {
		return this.mesh.getSize();
  }

  translate =(dx, dy, dz)=> {
		this.pos.data[0] += dx;
		this.pos.data[1] += dy;
		this.pos.data[2] += dz;
  }

  rotate =(x, y, z)=> {
		let rad = Math.PI / 180.0;
		let radx = x/2 * rad, rady = y/2 * rad, radz = z/2 * rad;
		
		let cx = Math.cos(radx), sx = Math.sin(radx);
		let cy = Math.cos(rady), sy = Math.sin(rady);
		let cz = Math.cos(radz), sz = Math.sin(radz);

		this.spin = Quat.multiplyMany(new Quat(cy, 0, sy, 0), new Quat(cx, sx, 0, 0), new Quat(cz, 0, 0, sz), this.spin);
		this.resetNormal();
  }

  scale =(dx, dy, dz)=> {
		this.scl.data[0] += dx;
		this.scl.data[1] += dy;
		this.scl.data[2] += dz;
  }

  setPosition =(x,y,z)=> {
		this.pos.set(0,x);
		this.pos.set(1,y);
		this.pos.set(2,z);
  }

  getPosition =()=> {
		return this.pos;
  }

  setRotation =(x,y,z)=> {
		let rad = Math.PI / 180.0;
		let radx = x/2 * rad, rady = y/2 * rad, radz = z/2 * rad;
		
		let cx = Math.cos(radx), sx = Math.sin(radx);
		let cy = Math.cos(rady), sy = Math.sin(rady);
		let cz = Math.cos(radz), sz = Math.sin(radz);

		this.spin = Quat.multiplyMany(new Quat(cy, 0, sy, 0), new Quat(cx, sx, 0, 0), new Quat(cz, 0, 0, sz));
		this.resetNormal();
  }

  getRotation =()=> {
		return this.spin;
  }

  setScale =(x,y,z)=> {
		this.scl.set(0,x);
		this.scl.set(1,y);
		this.scl.set(2,z);
  }

  getScale =()=> {
		return this.scl;
  }

  getColor =()=> {
		return this.color;
  }

  setColor =(r,g,b)=> {
		this.color.set(0,r);
		this.color.set(1,g);
		this.color.set(2,b);
  }
  
  getNormal =()=> {
		return this.normal;
  }

  resetNormal =()=> {
		let quated = Quat.multiplyMany(this.spin, new Quat(0,0,1,0), this.spin.conjugate());
		this.normal = new Vec3(quated.get(1), quated.get(2), quated.get(3));
		this.normal = this.normal.normal();
  }

  setMesh =(gridMesh)=> {
	  this.mesh = gridMesh;
  }

	
  convertToWorld =(frameOfReference)=> {
		// convert rotation first
		this.spin = Quat.multiply(frameOfReference.spin, this.spin);
		this.pos = frameOfReference.spin.rotateVec3(this.pos);
		this.pos = Vec3.add(this.pos, frameOfReference.pos);
		this.resetNormal();
  }



  // topLeft, topRight, botRight, botLeft
  getCorners =()=> {
		let topLeft = new Vec3(-this.scl.get(0),0,-this.scl.get(2));
		let topRight = new Vec3(this.scl.get(0),0,-this.scl.get(2));
		let botRight = new Vec3(this.scl.get(0),0,this.scl.get(2));
		let botLeft = new Vec3(-this.scl.get(0),0,this.scl.get(2));


		topLeft =  Vec3.add(this.spin.rotateVec3(topLeft),this.pos);
		topRight = Vec3.add(this.spin.rotateVec3(topRight),this.pos);
		botRight = Vec3.add(this.spin.rotateVec3(botRight),this.pos);
		botLeft =  Vec3.add(this.spin.rotateVec3(botLeft),this.pos);


		return {topLeft, topRight, botRight, botLeft};
  }

    
  inRange =(camPos)=> {
    let vec = Vec3.subtract(camPos, this.pos);
    let rotatedVec = (this.spin.conjugate()).rotateVec3(vec);
    rotatedVec.set(1,0);
    rotatedVec.set(0, this.scl.get(0) - Math.abs(rotatedVec.get(0)));
    rotatedVec.set(2, this.scl.get(2) - Math.abs(rotatedVec.get(2)));
    if(rotatedVec.get(0) > 0 && rotatedVec.get(2) > 0){
        return true;
    }
    else{
        return false;
    }
  }


}

