class ObjectMesh extends Mesh{

  constructor(name) {
    super();
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
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8*4, 0*4);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 8*4, 3*4);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 8*4, 5*4);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
