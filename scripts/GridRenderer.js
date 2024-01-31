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

  render =(adjacencyList, cam)=> {
    this.shader.use();
    this.shader.setUniformMat4("projection", proj_perspective);
    this.shader.setUniformCam("cam", cam);
    
    adjacencyList[0].gridObject.bind();
    for(const vertex of adjacencyList){
      this.shader.setUniformVec3("scale", vertex.gridObject.getScale());
      this.shader.setUniformVec3("position", vertex.gridObject.getPosition());
      this.shader.setUniformQuat("rotation", vertex.gridObject.getRotation());
      this.shader.setUniformVec3("color", vertex.gridObject.getColor());
      this.gl.enableVertexAttribArray(0);
      this.gl.drawElements(this.gl.TRIANGLE_STRIP, vertex.gridObject.size(), this.gl.UNSIGNED_BYTE, 0);
      this.gl.disableVertexAttribArray(0);
    }

    adjacencyList[0].gridObject.unbind();

    this.shader.unuse();
  }
}
