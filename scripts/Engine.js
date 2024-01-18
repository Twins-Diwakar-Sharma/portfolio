class Engine {
  
  constructor(gl, width, height) {

    this.canvasWidth = width;
    this.canvasHeight = height;



    this.gl = gl;
    this.gl.enable(gl.DEPTH_TEST);
    this.gl.clearColor(0.04, 0.04, 0.04, 1);
    this.gl.viewport(0,0,width,height); 

    document.addEventListener("keydown", this.keyDown, false);
    document.addEventListener("pointerlockchange", this.pointerLockChange, false);
    document.addEventListener("mozpointerlockchange", this.pointerLockChange, false);
    document.addEventListener("webkitpointerlockchange", this.pointerLockChange, false);
    document.getElementById("canvas").onclick = document.body.requestPointerLock ||
                                                document.body.mozRequestPointerLock ||
                                                document.body.webkitRequestPointerLock;

    setProjection(0.1, 1000.0, 60.0, width, height);

    this.cam = new Camera();
    this.sun = new DirectionalLight(new Vec3(0,-1,-1), new Vec3(1,1,0.7));

    this.forward = 0;
    this.strafe = 0;
    this.speed = 0.1;
    this.rotx = 0;
    this.roty = 0;
    this.mouseSpeed = 0.5;
    this.pause = false;

    this.cam.setPosition(0,1,0);

    this.gridMesh = new GridMesh(gl);  
    this.gridRenderer = new GridRenderer(gl);
    this.grids = [];
    this.grids.push(new GridObject(this.gridMesh));
    this.grids[0].setPosition(0,0,-2);
    this.grids[0].setScale(2,2,4);
    this.grids[0].setColor(1.1,2.1,1.8);

    this.grids.push(new GridObject(this.gridMesh));
    this.grids[1].setColor(1.0,0.59,0.11);
    this.grids[1].setRotation(0,0,-90);
    this.grids[1].setScale(3,1,2);
    this.grids[1].setPosition(-2,3,-4);

    this.grids.push(new GridObject(this.gridMesh));
    this.grids[2].setPosition(0,2,-6);
    this.grids[2].setColor(3.0,1.3,1.3);
    this.grids[2].setScale(2,1,2);
    this.grids[2].setRotation(90,0,0);

    
    this.selectedGrid = this.grids[0];
    this.distThresh = 1.1;
    this.sgi = 0;
    this.oldSgi = 0;
  }

  loop =()=> {
    const ticks = 1000.0/60.0;
    setInterval( ()=> {
      if(! this.pause){
        this.update();
        this.render();
      }
    }, ticks);

  }

  render =()=> {

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gridRenderer.render(this.grids, this.cam);
 
  }

  update =()=> {

    this.cam.rotateGravity(this.rotx, this.roty, this.selectedGrid.getNormal());
    this.cam.translateGravity(this.forward, this.strafe, this.selectedGrid.getNormal());
    //this.cam.translate(this.forward, this.strafe);
    //this.cam.rotate(this.rotx, this.roty, 0);
    
    let mostNegative = 0;
    for(let i=0; i<this.grids.length; i++){
      let dotProduct = Vec3.dot(this.grids[i].getNormal(), this.cam.getMoveDirection());
      if(dotProduct < mostNegative && 
          this.grids[i].perpendicularDistance(this.cam.getPosition()) < this.distThresh &&
          this.grids[i].inRange(this.cam.getPosition())) { 
        this.sgi = i;
        mostNegative = dotProduct;
      } 
    }
    
    if(this.oldSgi != this.sgi){
      this.oldSgi = this.sgi;
      this.selectedGrid = this.grids[this.sgi];
      this.cam.orientWithGrid(this.selectedGrid);
    }

    this.roty = 0;
    this.rotx = 0;
    this.forward = 0;
    this.strafe = 0;

  }

  keyDown =(event)=> {

    if(this.pause)
      return;

    if("w" === event.key){
      this.forward += this.speed;
    }else if("s" === event.key) {
      this.forward -= this.speed;
    }

    if("a" === event.key) {
      this.strafe -= this.speed;
    }else if("d" === event.key) {
      this.strafe += this.speed;
    }


  }

  mouseMove =(event)=> {

    let x = event.movementX;
    let y = event.movementY;
    this.rotx += (-y) * this.mouseSpeed;
    this.roty += (-x) * this.mouseSpeed;
    
  }

  pointerLockChange =(event)=> {

    let requestedElement = document.getElementById("canvas");
    if(document.pointerLockElement === requestedElement || 
       document.mozPointerLockElement === requestedElement || 
       document.webkitPointerLockElement === requestedElement) {
                document.addEventListener("mousemove", this.mouseMove, false);
                this.pause = false;
                console.log("unpuased");
    }else{
      document.removeEventListener("mousemove", this.mouseMove, false);
      this.pause = true;
      console.log("paused");
    }
  }

}
