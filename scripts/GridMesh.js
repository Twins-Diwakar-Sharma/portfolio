 class GridMesh extends Mesh{

  constructor(gl) {
    super();
    this.gl = gl;

    let vertexData = [-1,-1, -1,1, 1,-1, 1,1];
    let indices = [0,1,2,3];
    this.generate(vertexData,indices);
    this.size = indices.length;
  }

  generate =(vertexData, indices)=> {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);
    this.vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 2*4, 0*4);
    this.ebo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), this.gl.STATIC_DRAW);
    this.gl.bindVertexArray(null);
    this.size = indices.length;
  }

  bind =()=> {
    this.gl.bindVertexArray(this.vao);
  }

  unbind =()=> {
    this.gl.bindVertexArray(null);
  }

  getSize =()=> {
    return this.size;
  }

}
