class ObjectRenderer {
  
  constructor() {
    this.shader = new ShaderProgram(shader_objectVertex, shader_objectFragment);
    this.shader.mapUniform("projection");
    this.shader.mapUniform("position");
    this.shader.mapUniform("rotation");
    this.shader.mapUniform("scale");
    this.shader.mapUniform("albedo");
    this.shader.mapCameraUniform("cam");
    this.shader.mapUniform("overlayColor");
    this.shader.mapUniform("subTexPos");
    this.shader.mapUniform("colsRows");
    this.shader.mapUniform("sign");
  }

  render =(objects, cam, texture)=> {
    if(objects.length <= 0)
        return;
    this.shader.use();
    this.shader.setUniformMat4("projection", proj_perspective);
    this.shader.setUniformI1("albedo", 0);
    this.shader.setUniformCam("cam", cam);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.getTextureID());
    this.shader.setUniformVec2("colsRows", texture.getColsRows());
    

    for(const obj of objects){
      this.shader.setUniformVec3("scale", obj.getScale());
      this.shader.setUniformVec3("position", obj.getPosition());
      this.shader.setUniformQuat("rotation", obj.getRotation());
      this.shader.setUniformVec3("overlayColor", obj.getColor());
      this.shader.setUniformF1("subTexPos", obj.subTexPos);
      this.shader.setUniformI1("sign", obj.sign);

      obj.bind();
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


