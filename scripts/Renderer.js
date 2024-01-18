class ObjectRenderer {
  
  constructor(gl) {
    this.shader = new ShaderProgram(gl, shader_objectVertex, shader_objectFragment);
    this.gl = gl;
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
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, obj.tex.getTextureID());
      this.gl.enableVertexAttribArray(0);
      this.gl.enableVertexAttribArray(1);
      this.gl.enableVertexAttribArray(2);
      this.gl.drawElements(this.gl.TRIANGLES, obj.size(), this.gl.UNSIGNED_BYTE, 0);
      this.gl.disableVertexAttribArray(2);
      this.gl.disableVertexAttribArray(1);
      this.gl.disableVertexAttribArray(0);

      obj.unbind();
    }

    this.shader.unuse();
  }
}
