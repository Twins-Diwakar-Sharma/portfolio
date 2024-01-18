class Texture {

  constructor(gl, name) {
    this.texID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texID);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    gl.bindTexture(gl.TEXTURE_2D, null);

    let image =  new Image();
    image.src = "inventory/textures/" + name + ".png";

    image.addEventListener('load', ()=> {
      gl.bindTexture(gl.TEXTURE_2D, this.texID);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      console.log("source : " + image.src + " is laoded ");
      gl.bindTexture(gl.TEXTURE_2D, null);
            
    });
  }

  getTextureID =()=> {
    return this.texID;
  }
}
