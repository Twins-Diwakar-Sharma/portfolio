class GameObject extends Object{

  constructor(mesh, tex) {
    super();
    this.mesh = mesh;
    this.tex = tex;
    this.pos = new Vec3(0,0,0);
    this.rot = new Vec3(0,0,0);
    this.scl = new Vec3(1,1,1);
    this.transform = new Mat4();
    this.sync();
    this.color = new Vec3(1.0,1.0,1.0);
    this.spin = new Quat(1,0,0,0);
  }
  
  sync =()=> {

    let conv = Math.PI / 180.0;
    let radx = this.rot.get(0)*conv , rady = this.rot.get(1)*conv , radz = this.rot.get(2)*conv ;
    let cx = Math.cos(radx), sx = Math.sin(radx);
    let cy = Math.cos(rady), sy = Math.sin(rady);
    let cz = Math.cos(radz), sz = Math.sin(radz);

    this.transform.data[0*4 + 0] = (cy * cz) * this.scl.data[0];							
    this.transform.data[0*4 + 1] = (-sz * cy) * this.scl.data[1];								
    this.transform.data[0*4 + 2] = sy * this.scl.data[2];					
    this.transform.data[0*4 + 3] = this.pos.data[0];

    this.transform.data[1*4 + 0] = (cx * sz + cz * sy * sx) * this.scl.data[0];			
    this.transform.data[1*4 + 1] = (cz * cx - sx * sz * sy) * this.scl.data[1];				
    this.transform.data[1*4 + 2] = -cy * sx * this.scl.data[2];			
    this.transform.data[1*4 + 3] = this.pos.data[1];

    this.transform.data[2*4 + 0] = (sz * sx - cx * cz * sy) * this.scl.data[0];			
    this.transform.data[2*4 + 1] = (cz * sx + sz * sy * cx) * this.scl.data[1];				
    this.transform.data[2*4 + 2] = cx * cy * this.scl.data[2];				
    this.transform.data[2*4 + 3] = this.pos.data[2];

    this.transform.data[3*4 + 0] = 0;											
    this.transform.data[3*4 + 1] = 0;												
    this.transform.data[3*4 + 2] = 0;							
    this.transform.data[3*4 + 3] = 1;

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

    for(let i=0; i<3; i++) {
      this.transform.set(i,3,this.pos.get(i));
    }
  }

  rotate =(dx, dy, dz)=> {
    this.rot.data[0] += dx;
    this.rot.data[1] += dy;
    this.rot.data[2] += dz;

    for(let i=0; i<3; i++) {
      if(this.rot.get(i) > 360.0) {
        this.rot.data[i] -= 360.0;
      }
    }
    this.sync();
  }

  scale =(dx, dy, dz)=> {
    this.scl.data[0] += dx;
    this.scl.data[1] += dy;
    this.scl.data[2] += dz;
    this.sync();
  }

  setPosition =(x,y,z)=> {
    this.pos.set(0,x);
    this.pos.set(1,y);
    this.pos.set(2,z);
    for(let i=0; i<3; i++)
      this.transform.set(i,3,this.pos.get(i));
  }

  setRotation =(x,y,z)=> {
    this.rot.set(0,x);
    this.rot.set(1,y);
    this.rot.set(2,z);
    this.sync();
  }

  setScale =(x,y,z)=> {
    this.scl.set(0,x);
    this.scl.set(1,y);
    this.scl.set(2,z);
    this.sync();
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

  setColor =(r,g,b)=> {
    this.color.set(0,r);
    this.color.set(1,g);
    this.color.set(2,b);
  }

}
