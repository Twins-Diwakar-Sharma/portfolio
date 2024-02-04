 class GridMesh extends Mesh{

  constructor() {
    super();

    let vertexData = [-1,-1, -1,1, 1,-1, 1,1];
    let indices = [0,1,2,3];
    this.generate(vertexData,indices);
    this.size = indices.length;
  }

  generate =(vertexData, indices)=> {
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2*4, 0*4);
    this.ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    this.size = indices.length;
  }

  bind =()=> {
    gl.bindVertexArray(this.vao);
  }

  unbind =()=> {
    gl.bindVertexArray(null);
  }

  getSize =()=> {
    return this.size;
  }

}
