class Engine {
  
  constructor(width, height) {

    this.canvasWidth = width;
    this.canvasHeight = height;

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.04, 0.04, 0.04, 1);
    gl.viewport(0,0,width,height); 

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
    this.mouseSpeed = 0.1;
    this.pause = false;

    this.cam.setPosition(0,1,0);

    this.gridMesh = new GridMesh();  
    this.gridRenderer = new GridRenderer();

    this.objectRenderer = new ObjectRenderer();
    this.objects = [];
	
    createWorld(this.gridMesh);
    this.selectedVertex = worldGraph.vertices[0];
		//this.cam.setPosition(0,4,-3);

    this.prevCamPos = new Vec3(this.cam.pos.get(0), this.cam.pos.get(1), this.cam.pos.get(2));


    this.parametricT = 0;
    this.parametricTDelta = 0.05;

  }

  loop =()=> {
//  /*
    const ticks = 1000.0/60.0;
    setInterval( ()=> {
      if(! this.pause){
        this.update();
        this.render();
      }
    }, ticks);
//*/		
//		this.update();
//		this.render();
  }

  render =()=> {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.gridRenderer.render(this.selectedVertex, this.cam);
        this.objectRenderer.render(this.objects, this.cam, this.sun);
  }


  updateDefault =()=> {
    this.cam.rotateGravity(this.rotx, this.roty, this.selectedVertex.gridObject.getNormal());
    for(let i=0; i<3; i++){
        this.prevCamPos.data[i] = this.cam.pos.data[i];
    }
    this.cam.translateGravity(this.forward, this.strafe, this.selectedVertex.gridObject.getNormal());

    let inRange = this.selectedVertex.gridObject.inRange(this.cam.pos); 
    this.objects = this.selectedVertex.gridObject.objects;
        
    if(!inRange){
        for(let i=0; i<3; i++){
            this.cam.pos.data[i] = this.prevCamPos.data[i];
        }
    }
		let dotThresh = -0.0;
		let perpThresh = 1.5;
		let gridChange = false;
		let newIndex = 0;
        let changeEdge = null;
		for(let i=1; i<this.selectedVertex.list.length; i++){
			// velocity towards edge, distance
			let edge = worldGraph.getEdge(this.selectedVertex, this.selectedVertex.list[i]);
			let walkingToGrid = this.cam.isWalkingToGrid(edge, this.selectedVertex.list[i].gridObject,this.selectedVertex.gridObject, dotThresh, perpThresh);

			if(walkingToGrid){
                gridChange = true;
                newIndex = i;
                changeEdge = edge;
			}

		}

        if(gridChange){
            gridChange = false;
            this.cam.orientWithGrid(this.selectedVertex.list[newIndex].gridObject, this.selectedVertex.gridObject, changeEdge);
            this.selectedVertex = this.selectedVertex.list[newIndex];
            this.cam.animate = true;
        }
  }

  updateCameraAnimate =()=> {
    this.cam.linearInterpolate(this.parametricT);
    this.parametricT += this.parametricTDelta;
    if(this.parametricT > 1.0){
        this.parametricT = 0;
        this.cam.animate = false;
        this.cam.pos = this.cam.nextPos;
        this.cam.spin = this.cam.nextSpin;
    }
  }

  update =()=> {
    
    if(!this.cam.animate){
        this.updateDefault();
    }else{
        this.updateCameraAnimate();
    }

    console.log("abada   ", this.objects.length);

    
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
