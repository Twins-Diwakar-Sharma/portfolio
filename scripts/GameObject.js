class GameObject extends Object{

  constructor(mesh, tex) {
    super();
    this.mesh = mesh;
    this.tex = tex;
    this.pos = new Vec3(0,0,0);
    this.scl = new Vec3(1,1,1);
    this.color = new Vec3(1.0,1.0,1.0);
    this.spin = new Quat(1,0,0,0);
    this.normal = new Vec3(0,1,0);
    this.animate = true;
    this.parametricT = 0;
    this.parametricTDelta = 0.02;
    this.originalScl = new Vec3(1,1,1);
    this.subTexPos = 0;
    this.sign = 0;
    this.originalColor = new Vec3(1.0, 1.0, 1.0);
  }
  

  bind =()=> {
    this.mesh.bind();
  }

  unbind =()=> {
    this.mesh.unbind();
  }

  getTextureID =()=> {
    return this.tex.getTextureID();
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
    Vec3.equal(this.originalScl,this.scl);
  }

  setPosition =(x,y,z)=> {
    this.pos.set(0,x);
    this.pos.set(1,y);
    this.pos.set(2,z);
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

  setScale =(x,y,z)=> {
    this.scl.set(0,x);
    this.scl.set(1,y);
    this.scl.set(2,z);
    Vec3.equal(this.originalScl, this.scl);
  }

  getTransform =()=> {
    return this.transform;
  }

  getScale =()=> {
    return this.scl;
  }

  getColor =()=> {
    return this.color;
  }

  getPosition =()=> {
    return this.pos;
   } 

  getRotation =()=> {
    return this.spin;
  }

  setColor =(r,g,b)=> {
    this.color.set(0,r);
    this.color.set(1,g);
    this.color.set(2,b);

    Vec3.equal(this.originalColor, this.color);
  }

  setColorHDR =(r,g,b)=> {
    let mx = Math.max(r,g,b);
    this.color.set(0,r/mx);
    this.color.set(1,g/mx);
    this.color.set(2,b/mx);

    Vec3.equal(this.originalColor, this.color);
  }


  setColorVec =(colorVec)=> {
    let mx = Math.max(colorVec.get(0), colorVec.get(1), colorVec.get(2));
    this.color.set(0,colorVec.get(0)/mx);
    this.color.set(1,colorVec.get(1)/mx);
    this.color.set(2,colorVec.get(2)/mx);

    Vec3.equal(this.originalColor, this.color);
  }

  getNormal =()=> {
    return this.normal;
  }

  convertToWorld =(frameOfReference)=> {

		this.spin = Quat.multiply(frameOfReference.spin, this.spin);
		this.pos = frameOfReference.spin.rotateVec3(this.pos);
		this.pos = Vec3.add(this.pos, frameOfReference.pos);
		this.resetNormal();
  }


  resetNormal =()=> {
		let quated = Quat.multiplyMany(this.spin, new Quat(0,0,1,0), this.spin.conjugate());
		this.normal = new Vec3(quated.get(1), quated.get(2), quated.get(3));
		this.normal = this.normal.normal();
  }
    
  update =()=> {
    if(this.parametricT > 1){
        this.animate = false; 
        return;
    }

  //  this.scl.set(0, this.parametricT * this.originalScl.get(0));
  //  this.scl.set(1, this.parametricT * this.originalScl.get(1));

    if(this.sign == 0){
        this.scl.set(2, this.parametricT * this.originalScl.get(2));
        this.parametricT += this.parametricTDelta;
   }
    else {
        let factor = Math.cos(this.parametricT * Math.PI * 2.0 );
        this.color = Vec3.scale(Math.abs(factor), this.originalColor);
        this.parametricT += this.parametricTDelta;
    }
   }

  startAnimation =()=> {
    this.animate = true;
    this.parametricT = 0;
  }

}
