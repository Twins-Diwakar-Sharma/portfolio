class Vec3 {

  constructor(x,y,z){
    this.data = [x,y,z];
  }

  get =(i)=> {

    if(i >= 0 && i < 3) {
      return this.data[i];
    }else{
      console.error("ERROR: for Vec3 index "+ i +" out of range");
    }

  }

  set =(i, val)=> {
    if ( i >=0 && i< 3) {
      this.data[i] = val;
    }else{
      console.error("ERROR: for Vec3 index "+ i +" out of range");
    }
  }

  static add =(veca, vecb)=> {
    return new Vec3(
        veca.data[0] + vecb.data[0],
        veca.data[1] + vecb.data[1],
        veca.data[2] + vecb.data[2],
    );
  }

  static addMany =(...args)=> {
    let ret = new Vec3(0,0,0);
    for(const arg of args) {
      for(let i=0; i<3; i++){
        ret.data[i] += arg.data[i];
      }
    }
    return ret;
  }

  static subtract =(veca, vecb)=> {
    return new Vec3(
        veca.data[0] - vecb.data[0],
        veca.data[1] - vecb.data[1],
        veca.data[2] - vecb.data[2],
    );
  }

  static scale =(fl, vec)=> {
    return new Vec3(
      fl * vec.data[0],
      fl * vec.data[1],
      fl * vec.data[2],
    );
  }

  length =()=> {
    return Math.sqrt( 
        this.data[0] * this.data[0]
      + this.data[1] * this.data[1]
      + this.data[2] * this.data[2]
    );
  }

  static dot =(veca, vecb)=> {
    return veca.data[0]*vecb.data[0] + veca.data[1]*vecb.data[1] + veca.data[2]*vecb.data[2];
  }


  normal =()=> {
    const inv = 1.0/(this.length());
    return Vec3.scale(inv, this);
  }

}

class Vec4 {

  constructor(x, y, z, w) {
    this.data = [x,y,z,w];
  }

  get =(i)=> {
    if(i >= 0 && i < 4) {
      return this.data[i];
    }else{
      console.error("ERROR: for Vec4 index "+ i +" out of range");
    }
  }

  set =(i, val)=> {
    if(i >= 0 && i < 4) {
      this.data[i] = val;
    }else{
      console.error("ERROR: for Vec4 index "+ i +"out of range");
    }
  } 

  static add =(veca, vecb)=> {
    return new Vec4(
      veca.data[0] + vecb.data[0],
      veca.data[1] + vecb.data[1],
      veca.data[2] + vecb.data[2],
      veca.data[3] + vecb.data[3],
    );
  }


  static addMany =(...args)=> {
    let ret = new Vec4(0,0,0,0);
    for(const arg of args) {
      for(let i=0; i<3; i++){
        ret.data[i] += arg.data[i];
      }
    }
    return ret;
  }

  static subtract =(veca, vecb)=> {
    return new Vec4(
      veca.data[0] - vecb.data[0],
      veca.data[1] - vecb.data[1],
      veca.data[2] - vecb.data[2],
      veca.data[3] - vecb.data[3],
    );
  }

  static scale =(fl, vec)=> {
    return new Vec4(
       fl * vec.data[0],
       fl * vec.data[1],
       fl * vec.data[2],
       fl * vec.data[3],

    )
  }

  length =()=> {
    return Math.sqrt( 
        this.data[0] * this.data[0]
      + this.data[1] * this.data[1]
      + this.data[2] * this.data[2]
      + this.data[3] * this.data[3]
    );
  }

}

class Mat4 {

  constructor() {
    this.data = Array(16).fill(0);
  }

  get =(i,j)=> {
    if(i >=0 && i<4 && j >= 0 && j <4)
      return this.data[i*4 + j];
    else
      console.error("indices ["+ i +","+ j +"] for Mat4 is out of bounds");
  }

  set =(i,j, val)=> {
    if(i>=0 && i<4 && j>=0 && j<4)
      this.data[i*4 + j] = val;
    else
      console.error("indices ["+ i +","+ j +"] for Mat4 is out of bounds");
  }

  static multiplyVec =(m,v)=> {
    return new Vec4(
        v[0]*m.data[0*4 + 0] + v[1]*m.data[0*4 + 1] + v[2]*m.data[0*4 + 2] + v[3]*m.data[0*4 + 3],
        v[0]*m.data[1*4 + 0] + v[1]*m.data[1*4 + 1] + v[2]*m.data[1*4 + 2] + v[3]*m.data[1*4 + 3],
        v[0]*m.data[2*4 + 0] + v[1]*m.data[2*4 + 1] + v[2]*m.data[2*4 + 2] + v[3]*m.data[2*4 + 3],
        v[0]*m.data[3*4 + 0] + v[1]*m.data[3*4 + 1] + v[2]*m.data[3*4 + 2] + v[3]*m.data[3*4 + 3]
    );
  }

  static multiplyMat =(m, w)=> {
    let ret = new Mat4();
    ret.data = [
         m.data[0*4 + 0]*w.data[0*4 + 0] + m.data[0*4 + 1]*w.data[1*4 + 0] + m.data[0*4 + 2]*w.data[2*4 + 0] + m.data[0*4 + 3]*w.data[3*4 + 0],
         m.data[0*4 + 0]*w.data[0*4 + 1] + m.data[0*4 + 1]*w.data[1*4 + 1] + m.data[0*4 + 2]*w.data[2*4 + 1] + m.data[0*4 + 3]*w.data[3*4 + 1],
         m.data[0*4 + 0]*w.data[0*4 + 2] + m.data[0*4 + 1]*w.data[1*4 + 2] + m.data[0*4 + 2]*w.data[2*4 + 2] + m.data[0*4 + 3]*w.data[3*4 + 2],
         m.data[0*4 + 0]*w.data[0*4 + 3] + m.data[0*4 + 1]*w.data[1*4 + 3] + m.data[0*4 + 2]*w.data[2*4 + 3] + m.data[0*4 + 3]*w.data[3*4 + 3],

         m.data[1*4 + 0]*w.data[0*4 + 0] + m.data[1*4 + 1]*w.data[1*4 + 0] + m.data[1*4 + 2]*w.data[2*4 + 0] + m.data[1*4 + 3]*w.data[3*4 + 0],
         m.data[1*4 + 0]*w.data[0*4 + 1] + m.data[1*4 + 1]*w.data[1*4 + 1] + m.data[1*4 + 2]*w.data[2*4 + 1] + m.data[1*4 + 3]*w.data[3*4 + 1],
         m.data[1*4 + 0]*w.data[0*4 + 2] + m.data[1*4 + 1]*w.data[1*4 + 2] + m.data[1*4 + 2]*w.data[2*4 + 2] + m.data[1*4 + 3]*w.data[3*4 + 2],
         m.data[1*4 + 0]*w.data[0*4 + 3] + m.data[1*4 + 1]*w.data[1*4 + 3] + m.data[1*4 + 2]*w.data[2*4 + 3] + m.data[1*4 + 3]*w.data[3*4 + 3],

         m.data[2*4 + 0]*w.data[0*4 + 0] + m.data[2*4 + 1]*w.data[1*4 + 0] + m.data[2*4 + 2]*w.data[2*4 + 0] + m.data[2*4 + 3]*w.data[3*4 + 0],
         m.data[2*4 + 0]*w.data[0*4 + 1] + m.data[2*4 + 1]*w.data[1*4 + 1] + m.data[2*4 + 2]*w.data[2*4 + 1] + m.data[2*4 + 3]*w.data[3*4 + 1],
         m.data[2*4 + 0]*w.data[0*4 + 2] + m.data[2*4 + 1]*w.data[1*4 + 2] + m.data[2*4 + 2]*w.data[2*4 + 2] + m.data[2*4 + 3]*w.data[3*4 + 2],
         m.data[2*4 + 0]*w.data[0*4 + 3] + m.data[2*4 + 1]*w.data[1*4 + 3] + m.data[2*4 + 2]*w.data[2*4 + 3] + m.data[2*4 + 3]*w.data[3*4 + 3],

         m.data[3*4 + 0]*w.data[0*4 + 0] + m.data[3*4 + 1]*w.data[1*4 + 0] + m.data[3*4 + 2]*w.data[2*4 + 0] + m.data[3*4 + 3]*w.data[3*4 + 0],
         m.data[3*4 + 0]*w.data[0*4 + 1] + m.data[3*4 + 1]*w.data[1*4 + 1] + m.data[3*4 + 2]*w.data[2*4 + 1] + m.data[3*4 + 3]*w.data[3*4 + 1],
         m.data[3*4 + 0]*w.data[0*4 + 2] + m.data[3*4 + 1]*w.data[1*4 + 2] + m.data[3*4 + 2]*w.data[2*4 + 2] + m.data[3*4 + 3]*w.data[3*4 + 2],
         m.data[3*4 + 0]*w.data[0*4 + 3] + m.data[3*4 + 1]*w.data[1*4 + 3] + m.data[3*4 + 2]*w.data[2*4 + 3] + m.data[3*4 + 3]*w.data[3*4 + 3]

    ];
    return ret;
  }
}

class Quat{
    
  constructor(r, x, y, z) {
    this.data = [r, x, y, z];
  }

  get =(i)=> {
    if( i >= 0 && i < 4) {
      return this.data[i];
    }else{
      console.error("ERROR: for Quat index "+ i +"out of range");
    }
  }

  set =(i, val)=> {
    if(i >=0 && i < 4) {
        this.data[i] = val;
    }else{
      console.error("ERROR: for Quat index "+ i +" out of range");
    }
  }

  static add =(quata, quatb)=> {
    return new Quat(
      quata.data[0] + quatb.data[0],
      quata.data[1] + quatb.data[1],
      quata.data[2] + quatb.data[2],
      quata.data[3] + quatb.data[3],
    );
  }


  static addMany =(...args)=> {
    let ret = new Quat(0,0,0,0);
    for(const arg of args) {
      for(let i=0; i<3; i++){
        ret.data[i] += arg.data[i];
      }
    }
    return ret;
  }

  static subtract =(quata, quatb)=> {
    return new Quat(
      quata.data[0] - quatb.data[0],
      quata.data[1] - quatb.data[1],
      quata.data[2] - quatb.data[2],
      quata.data[3] - quatb.data[3],
    );
  }

  static scale =(fl, quat)=> {
    return new Quat(
       fl * quat.data[0],
       fl * quat.data[1],
       fl * quat.data[2],
       fl * quat.data[3],
    );
  }

  static multiply =(q, p)=> {
    return new Quat(
        q.data[0]*p.data[0] - q.data[1]*p.data[1] - q.data[2]*p.data[2] - q.data[3]*p.data[3],
        q.data[0]*p.data[1] + q.data[1]*p.data[0] + q.data[2]*p.data[3] - q.data[3]*p.data[2],
        q.data[0]*p.data[2] - q.data[1]*p.data[3] + q.data[2]*p.data[0] + q.data[3]*p.data[1],
        q.data[0]*p.data[3] + q.data[1]*p.data[2] - q.data[2]*p.data[1] + q.data[3]*p.data[0]
    );
  }

  static multiplyMany =(a,b,...args)=> {
    let ret = Quat.multiply(a,b);
    for(const arg of args) {
      ret = Quat.multiply(ret, arg);
    }
    return ret;
  }

  length =()=> {
    return Math.sqrt( 
        this.data[0] * this.data[0]
      + this.data[1] * this.data[1]
      + this.data[2] * this.data[2]
      + this.data[3] * this.data[3]
    );
  }

  normal =()=> {
    const inv = 1.0/(this.length());
    return Quat.scale(inv, this);
  }

  conjugate =()=> {
    return new Quat( this.data[0], -this.data[1], -this.data[2], -this.data[3]);
  }

  rotateVec3 =(vec)=> {
    let invQuat = this.conjugate();
    let qVec = new Quat(0, vec.get(0), vec.get(1), vec.get(2));
    qVec = Quat.multiplyMany(this, qVec, invQuat);
    return new Vec3(qVec.get(1), qVec.get(2), qVec.get(3));
  }

}


/*  static slerp =(q, p, t)=> {
    
    let slerp_dot_threshHold = 0.9995;

    let cosA = (q.data[0] * p.data[0] + q.data[1] * p.data[1] + q.data[2] * p.data[2] + q.data[3] * p.data[3]) / ( q.length() * p.length() );
	if (cosA < 0.0)
	{
		p = p.conjugate();
		p.data[0] = -p.data[0];
		cosA = -cosA;
	}

	if (cosA > slerp_dot_threshHold)
	{
    let result = Quat.add( Quat.scale(1.0 - t, q), Quat.scale(t, p) );
		result = result.normal();
		return result;
	}
	let alpha = Math.acos(cosA);

  let scaQ = (Math.sin((1.0 - t) * alpha) / Math.sin(alpha));
  let scaP = (Math.sin(t * alpha) / Math.sin(alpha)) 
  let res = Quat.add( Quat.scale(scaQ,q), Quat.scale(scaP,p) );
	res = res.normal();
	return res;
	
  }

  */
