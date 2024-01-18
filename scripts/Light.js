class DirectionalLight {

  constructor(direction, color){
    this.direction = direction;
    this.color = color;
  }

  setDirection =(dir)=> {
    this.direction = dir;
  }

  setColor =(col)=> {
    this.color = col;
  }

  getDirection =()=> {
    return this.direction;
  }

  getColor =()=> {
    return this.color;
  }
}
