class ShaderProgram {

  constructor (gl, vertexFile, fragmentFile) {
    this.gl = gl;
    this.uniformMap = new Map();
    this.vertexID = 0;
    this.fragmentID = 0;
    this.programID = 0;
    this.programID = this.gl.createProgram();
    this.vertexID = this.createShader(this.gl.VERTEX_SHADER, vertexFile);
    this.fragmentID = this.createShader(this.gl.FRAGMENT_SHADER, fragmentFile);

    this.gl.attachShader(this.programID, this.vertexID);
    this.gl.attachShader(this.programID, this.fragmentID);
    this.gl.linkProgram(this.programID);

    if(!this.gl.getProgramParameter(this.programID, this.gl.LINK_STATUS)) {
      console.log("Unable to link shader program");
      console.log(this.gl.getProgramInfoLog(this.programID));
    }

    this.gl.deleteShader(this.vertexID);
    this.gl.deleteShader(this.fragmentID);
  }

  createShader =(shaderType, source)=> {
    let shaderID = this.gl.createShader(shaderType);
    this.gl.shaderSource(shaderID, source);
    this.gl.compileShader(shaderID);

    if(!this.gl.getShaderParameter(shaderID, this.gl.COMPILE_STATUS)) {
      console.log("An error occured compiling shader\n");
      console.log(this.gl.getShaderInfoLog(shaderID));
      this.gl.deleteShader(shaderID);
    }
    return shaderID;
  }

  use =()=> {
    this.gl.useProgram(this.programID);
  }

  unuse =()=> {
    this.gl.useProgram(null);
  }

  mapUniform =(name)=> {
    let uniformLoc = this.gl.getUniformLocation(this.programID, name);
    this.uniformMap.set(name, uniformLoc);
  }

  mapCameraUniform =(name)=> {
    let camSpin = name + ".spin";
    let camPos = name + ".pos";
    let spinLoc = this.gl.getUniformLocation(this.programID, camSpin);
    let posLoc = this.gl.getUniformLocation(this.programID, camPos);
    this.uniformMap.set(camSpin, spinLoc);
    this.uniformMap.set(camPos, posLoc);
  }

  mapDirectionalLightUniform =(lightName)=> {
    let dirName = lightName + ".direction";
    let colName = lightName + ".color";
    this.mapUniform(dirName);
    this.mapUniform(colName);
  }

  setUniformI1 =(name,val)=> {
    let uniformLoc = this.uniformMap.get(name);
    this.gl.uniform1i(uniformLoc, val);
  }

  setUniformF1 =(name,val)=> {
    let uniformLoc = this.uniformMap.get(name);
    this.gl.uniform1f(uniformLoc,val);
  }

  setUniformVec3 =(name,vec)=> {
    let uniformLoc = this.uniformMap.get(name);
    this.gl.uniform3f(uniformLoc, vec.data[0], vec.data[1], vec.data[2]);
  }

  setUniformQuat =(name,quat)=> {
    let uniformLoc = this.uniformMap.get(name);
    this.gl.uniform4f(uniformLoc, quat.get(1), quat.get(2), quat.get(3), quat.get(0));
  }

  setUniformMat4 =(name,mat)=> {
    let uniformLoc = this.uniformMap.get(name);
    this.gl.uniformMatrix4fv(uniformLoc, true, mat.data);
  }

  setUniformCam =(name,cam)=> {
    let camSpin = name + ".spin";
    let camPos = name + ".pos";

    this.gl.uniform4f(this.uniformMap.get(camSpin), cam.spin.get(1), cam.spin.get(2), cam.spin.get(3), cam.spin.get(0));
    this.gl.uniform3f(this.uniformMap.get(camPos), cam.position.get(0), cam.position.get(1), cam.position.get(2));
  }

  setUniformDirectionalLight =(name,directionalLight)=> {
    let dirName = name + ".direction";
    let colName = name + ".color";

    this.setUniformVec3(dirName, directionalLight.getDirection());
    this.setUniformVec3(colName, directionalLight.getColor());
  }

}
