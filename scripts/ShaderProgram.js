class ShaderProgram {

  constructor (vertexFile, fragmentFile) {
    this.uniformMap = new Map();
    this.vertexID = 0;
    this.fragmentID = 0;
    this.programID = 0;
    this.programID = gl.createProgram();
    this.vertexID = this.createShader(gl.VERTEX_SHADER, vertexFile);
    this.fragmentID = this.createShader(gl.FRAGMENT_SHADER, fragmentFile);

    gl.attachShader(this.programID, this.vertexID);
    gl.attachShader(this.programID, this.fragmentID);
    gl.linkProgram(this.programID);

    if(!gl.getProgramParameter(this.programID, gl.LINK_STATUS)) {
      console.log("Unable to link shader program");
      console.log(gl.getProgramInfoLog(this.programID));
    }

    gl.deleteShader(this.vertexID);
    gl.deleteShader(this.fragmentID);
  }

  createShader =(shaderType, source)=> {
    let shaderID = gl.createShader(shaderType);
    gl.shaderSource(shaderID, source);
    gl.compileShader(shaderID);

    if(!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
      console.log("An error occured compiling shader\n");
      console.log(gl.getShaderInfoLog(shaderID));
      gl.deleteShader(shaderID);
    }
    return shaderID;
  }

  use =()=> {
    gl.useProgram(this.programID);
  }

  unuse =()=> {
    gl.useProgram(null);
  }

  mapUniform =(name)=> {
    let uniformLoc = gl.getUniformLocation(this.programID, name);
    this.uniformMap.set(name, uniformLoc);
  }

  mapCameraUniform =(name)=> {
    let camSpin = name + ".spin";
    let camPos = name + ".pos";
    let spinLoc = gl.getUniformLocation(this.programID, camSpin);
    let posLoc = gl.getUniformLocation(this.programID, camPos);
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
    gl.uniform1i(uniformLoc, val);
  }

  setUniformF1 =(name,val)=> {
    let uniformLoc = this.uniformMap.get(name);
    gl.uniform1f(uniformLoc,val);
  }

  setUniformVec3 =(name,vec)=> {
    let uniformLoc = this.uniformMap.get(name);
    gl.uniform3f(uniformLoc, vec.data[0], vec.data[1], vec.data[2]);
  }

  setUniformQuat =(name,quat)=> {
    let uniformLoc = this.uniformMap.get(name);
    gl.uniform4f(uniformLoc, quat.get(1), quat.get(2), quat.get(3), quat.get(0));
  }

  setUniformMat4 =(name,mat)=> {
    let uniformLoc = this.uniformMap.get(name);
    gl.uniformMatrix4fv(uniformLoc, true, mat.data);
  }

  setUniformCam =(name,cam)=> {
    let camSpin = name + ".spin";
    let camPos = name + ".pos";

    gl.uniform4f(this.uniformMap.get(camSpin), cam.spin.get(1), cam.spin.get(2), cam.spin.get(3), cam.spin.get(0));
    gl.uniform3f(this.uniformMap.get(camPos), cam.pos.get(0), cam.pos.get(1), cam.pos.get(2));
  }

  setUniformDirectionalLight =(name,directionalLight)=> {
    let dirName = name + ".direction";
    let colName = name + ".color";

    this.setUniformVec3(dirName, directionalLight.getDirection());
    this.setUniformVec3(colName, directionalLight.getColor());
  }

}
