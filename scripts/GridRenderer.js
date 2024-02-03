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

  render =(selectedVertex, cam)=> {
    this.shader.use();
    this.shader.setUniformMat4("projection", proj_perspective);
    this.shader.setUniformCam("cam", cam);
    
    selectedVertex.gridObject.bind();
    this.drawVertex(selectedVertex);
    for(let i=1; i<selectedVertex.list.length; i++){
        this.drawVertex(selectedVertex.list[i]);
        for(let j=1; j<selectedVertex.list[i].list.length; j++){
            if(selectedVertex.list[i].list[j] == selectedVertex){
                continue;
            }
            this.drawVertex(selectedVertex.list[i].list[j]);
        }
    }
    
    selectedVertex.gridObject.unbind();


    this.shader.unuse();
  }

  drawVertex =(vertex)=> {
      this.shader.setUniformVec3("scale", vertex.gridObject.getScale());
      this.shader.setUniformVec3("position", vertex.gridObject.getPosition());
      this.shader.setUniformQuat("rotation", vertex.gridObject.getRotation());
      this.shader.setUniformVec3("color", vertex.gridObject.getColor());
      this.gl.enableVertexAttribArray(0);
      this.gl.drawElements(this.gl.TRIANGLE_STRIP, vertex.gridObject.size(), this.gl.UNSIGNED_BYTE, 0);
      this.gl.disableVertexAttribArray(0);
  }
}
