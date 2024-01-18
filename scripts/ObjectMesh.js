class ObjectMesh extends Mesh{

  constructor(gl, name) {
    super();
    this.gl = gl;
    const path = "inventory/models/"+ name +".stc";
   this.size = 0; 

    fetch(path)
      .then(response => response.text())
      .then((data) => {
        let arrays = data.split("\n"); 
        let vertexData = (arrays[0].split(" ")).map(Number);
        let indices = (arrays[1].split(" ")).map(Number);
        this.generate(vertexData,indices);
        this.size = indices.length;
      }) ;
  }

  generate =(vertexData, indices)=> {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);
    this.vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 8*4, 0*4);
    this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 8*4, 3*4);
    this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 8*4, 5*4);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
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
