class ObjectRenderer {
  
  constructor() {
    this.shader = new ShaderProgram(shader_objectVertex, shader_objectFragment);
    this.shader.mapUniform("projection");
    this.shader.mapUniform("transform");
    this.shader.mapUniform("albedo");
    this.shader.mapCameraUniform("cam");
    this.shader.mapDirectionalLightUniform("sun");
  }

  render =(objects, cam, sun)=> {
    this.shader.use();
    this.shader.setUniformMat4("projection", proj_perspective);
    this.shader.setUniformI1("albedo", 0);
    this.shader.setUniformCam("cam", cam);
    this.shader.setUniformDirectionalLight("sun", sun);

    for(const obj of objects){
      this.shader.setUniformMat4("transform", obj.getTransform());
      obj.bind();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, obj.tex.getTextureID());
      gl.enableVertexAttribArray(0);
      gl.enableVertexAttribArray(1);
      gl.enableVertexAttribArray(2);
      gl.drawElements(gl.TRIANGLES, obj.size(), gl.UNSIGNED_BYTE, 0);
      gl.disableVertexAttribArray(2);
      gl.disableVertexAttribArray(1);
      gl.disableVertexAttribArray(0);

      obj.unbind();
    }

    this.shader.unuse();
  }
}


