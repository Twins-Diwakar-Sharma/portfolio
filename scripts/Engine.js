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
    this.objectsTexture = null;
	
    createWorld(this.gridMesh);
    this.selectedVertex = worldGraph.vertices[0];
    this.prevSelectedVertex = this.selectedVertex;
		//this.cam.setPosition(0,4,-3);

    this.prevCamPos = new Vec3(this.cam.pos.get(0), this.cam.pos.get(1), this.cam.pos.get(2));


    this.parametricT = 0;
    this.parametricTDelta = 0.05;

    gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    this.fadeOutIndices = [];
    this.fadeInIndices = [];
    this.renderIndices = [];

    for(let i=0; i<this.selectedVertex.list.length; i++){
        this.renderIndices.push(this.selectedVertex.list[i].num);
        for(let j=1; j<this.selectedVertex.list[i].list.length; j++){
            if(this.selectedVertex.list[i].list[j] == this.selectedVertex){
                continue;
            }
            this.renderIndices.push(this.selectedVertex.list[i].list[j].num);
        }
    }


    this.animationStart = false;
    this.gridAnimT = 0.0;
    this.gridAnimTDelta = 0.01;

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
    //this.gridRenderer.render(this.selectedVertex, this.cam);
    this.gridRenderer.renderGraphIndices(worldGraph, this.renderIndices, this.cam);
    this.gridRenderer.renderGraphIndices(worldGraph, this.fadeInIndices, this.cam);
    this.gridRenderer.renderGraphIndices(worldGraph, this.fadeOutIndices, this.cam);
    this.objectRenderer.render(this.objects, this.cam, this.objectsTexture);
  }


  updateCameraDefault =()=> {


    this.cam.rotateGravity(this.rotx, this.roty, this.selectedVertex.gridObject.getNormal());
    for(let i=0; i<3; i++){
        this.prevCamPos.data[i] = this.cam.pos.data[i];
    }
    this.cam.translateGravity(this.forward, this.strafe, this.selectedVertex.gridObject.getNormal());

    let inRange = this.selectedVertex.gridObject.inRange(this.cam.pos); 
        
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
            this.animationStart = true;
            gridChange = false;
            this.cam.orientWithGrid(this.selectedVertex.list[newIndex].gridObject, this.selectedVertex.gridObject, changeEdge);
            this.prevSelectedVertex = this.selectedVertex;
            this.selectedVertex = this.selectedVertex.list[newIndex];
            this.cam.animate = true;
            this.objects = this.selectedVertex.gridObject.objects;
            this.objectsTexture = this.selectedVertex.gridObject.objectsTexture;
            for(const obj of this.objects){
                obj.startAnimation();
            }

            this.updateAnimationStates();
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
        this.updateCameraDefault();
    }else{
        this.updateCameraAnimate();
    }
    
    for(let obj of this.objects){
        obj.update();
    }
    
    for(let i=0; i<this.fadeOutIndices.length; i++){
        worldGraph.vertices[this.fadeOutIndices[i]].gridObject.alpha = 1.0 - this.gridAnimT;
    }

    for(let i=0; i<this.fadeInIndices.length; i++){
        worldGraph.vertices[this.fadeInIndices[i]].gridObject.alpha = this.gridAnimT;
    }
    
    if(this.animationStart){
        this.gridAnimT += this.gridAnimTDelta;
    }
    
    if(this.gridAnimT >= 1.0){
        this.gridAnimationCompleteAftermath();
        this.animationStart = false;
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

    if("e" === event.key) {
        if(this.selectedVertex.gridObject.special == true && !!this.selectedVertex.gridObject.link){
            window.open(this.selectedVertex.gridObject.link, '_blank');
        }
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
    }else{
      document.removeEventListener("mousemove", this.mouseMove, false);
      this.pause = true;
    }
  }
    
  updateAnimationStates =()=> {
    this.fadeOutIndices = [];
    this.fadeInIndices = [];
    this.renderIndices = [];
    this.animationStart = true;
    this.gridAnimT = 0.0;
    for(let i=0; i<this.selectedVertex.list.length; i++){
        this.renderIndices.push(this.selectedVertex.list[i].num);
        this.selectedVertex.list[i].gridObject.animationState = 3;
    }
    for(let i=1; i<this.prevSelectedVertex.list.length; i++){
        if(this.prevSelectedVertex.list[i] == this.selectedVertex)
            continue;
        this.renderIndices.push(this.prevSelectedVertex.list[i].num);
        this.prevSelectedVertex.list[i].gridObject.animationState = 3;
    }


    // bring new gradChildren
    for(let i=1; i<this.selectedVertex.list.length; i++){
        for(let j=1; j<this.selectedVertex.list[i].list.length; j++){
            if(this.selectedVertex.list[i].list[j] == this.selectedVertex){
                continue;
            }
            
            if(this.selectedVertex.list[i].list[j].gridObject.animationState != 3){
                this.selectedVertex.list[i].list[j].gridObject.animationState = 1;
                this.fadeInIndices.push(this.selectedVertex.list[i].list[j].num);
            }
        }
    }

    // remove old grandChildren
    for(let i=1; i<this.prevSelectedVertex.list.length; i++){
        for(let j=1; j<this.prevSelectedVertex.list[i].list.length; j++){
            if(this.prevSelectedVertex.list[i].list[j] == this.prevSelectedVertex){
                continue;
            }
            
            if(this.prevSelectedVertex.list[i].list[j].gridObject.animationState != 3){
                this.prevSelectedVertex.list[i].list[j].gridObject.animationState = 2;
                this.fadeOutIndices.push(this.prevSelectedVertex.list[i].list[j].num);
            }
        }
    }


  }

  gridAnimationCompleteAftermath =()=> {
    if(!this.animationStart){
        return;
    }
    this.animationStart = false;
    for(let i=0; i<this.fadeOutIndices.length; i++){
        worldGraph.vertices[this.fadeOutIndices[i]].gridObject.animationState = 0;
        worldGraph.vertices[this.fadeOutIndices[i]].gridObject.alpha = 1.0;
    }
    this.renderIndices = this.renderIndices.concat(this.fadeInIndices);
    for(let i=0; i<this.renderIndices.length; i++){
        worldGraph.vertices[this.renderIndices[i]].gridObject.animationState = 0;
        worldGraph.vertices[this.renderIndices[i]].gridObject.alpha = 1.0;
    }

    this.fadeOutIndices = [];
    this.fadeInIndices = [];
  }
	
}
