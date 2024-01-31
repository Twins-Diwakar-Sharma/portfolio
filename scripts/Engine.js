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
		
		worldGraph.setMesh(this.gridMesh);
		this.selectedVertex = worldGraph.vertices[0];
		//this.cam.setPosition(0,4,-3);


		console.log("length : " + this.selectedVertex.list.length);

  }

  loop =()=> {
    const ticks = 1000.0/60.0;
    setInterval( ()=> {
      if(! this.pause){
        this.update();
        this.render();
      }
    }, ticks);
		
	//	this.update();
//		this.render();
  }

  render =()=> {

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gridRenderer.render(this.selectedVertex.list, this.cam);
 
  }

  update =()=> {

    this.cam.rotateGravity(this.rotx, this.roty, this.selectedVertex.gridObject.getNormal());
    this.cam.translateGravity(this.forward, this.strafe, this.selectedVertex.gridObject.getNormal());
    //this.cam.translate(this.forward, this.strafe);
    //this.cam.rotate(this.rotx, this.roty, 0);
		
		let dotThresh = -0.6;
		let perpThresh = 1;
		let gridChange = true;
		let newIndex = 0;
		for(let i=1; i<this.selectedVertex.list.length; i++){
			// velocity towards edge, distance
			let edge = worldGraph.getEdge(this.selectedVertex, this.selectedVertex.list[i]);
			let walkingToGrid = this.cam.isWalkingToGrid(edge, dotThresh, perpThresh);

			console.log(walkingToGrid);			
			if(walkingToGrid){
				//this.selectedVertex = this.selectedVertex.list[i];
				//this.cam.orientWithGrid(this.selectedVertex.gridObject, edge);
			}

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
