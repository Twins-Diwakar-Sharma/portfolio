class GridRenderer {
  
  constructor(gl) {
    this.shader = new ShaderProgram(gl, shader_gridVertex, shader_gridFragment);
    this.gl = gl;
    this.shader.mapUniform("projection");
    this.shader.mapCameraUniform("cam");
    this.shader.mapUniform("scale");
    this.shader.mapUniform("position");
    this.shader.mapUniform("rotation");
    this.shader.mapUniform("color");
  }

  render =(objects, cam)=> {
    this.shader.use();
    this.shader.setUniformMat4("projection", proj_perspective);
    this.shader.setUniformCam("cam", cam);
    
    objects[0].bind();
    for(const obj of objects){
      this.shader.setUniformVec3("scale", obj.getScale());
      this.shader.setUniformVec3("position", obj.getPosition());
      this.shader.setUniformQuat("rotation", obj.getRotation());
      this.shader.setUniformVec3("color", obj.getColor());
      this.gl.enableVertexAttribArray(0);
      this.gl.drawElements(this.gl.TRIANGLE_STRIP, obj.size(), this.gl.UNSIGNED_BYTE, 0);
      this.gl.disableVertexAttribArray(0);
    }
    objects[0].unbind();

    this.shader.unuse();
  }
}
