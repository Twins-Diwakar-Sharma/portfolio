class GraphEdge {
  constructor(p0, p1, relativeUp){
    this.p0 = p0;
    this.p1 = p1;
	this.relativeUp = relativeUp;
  }
};

class GraphVertex {
	
	static counter = 0;

  constructor(go){
		this.gridObject = go;
		this.list = [this];
		this.num = GraphVertex.counter++;
  }


  insert =(graphVertex)=> {
		this.list.push(graphVertex);
  }

  getList =()=> {
	  return list;
  }

};

class Graph {

		
	edgeMap = new Map();

	/*    GraphObject go1, go2;   Edge e1, e2;   
	 *	  GrpahVertex gv1(go1), gv2(go2);
	 *	  map.set({gv1,gv2}, e1 )
	 *
	 *
	 * 
	 */

	vertices = []; // make it easy at render function, remember 0 always me


	hash =(gv0, gv1)=> {
		return 1000 * (gv0.num * gv1.num) + (gv0.num + gv1.num);
	}

	setEdge =(gv0, gv1, e)=> {
		let hashnum = this.hash(gv0, gv1);
		this.edgeMap.set(hashnum, e);
	}

	getEdge =(gv0, gv1)=> {
		let hashnum = this.hash(gv0, gv1);
		return this.edgeMap.get(hashnum);
	}

	makeAdjacent =(i,j, edge)=> {
		this.vertices[i].insert(this.vertices[j]);
		this.vertices[j].insert(this.vertices[i]);
		this.setEdge(this.vertices[i], this.vertices[j], edge);
	}

	getGridObject =(i)=> {
		return this.vertices[i].gridObject;	
	}
};



let worldGraph = new Graph();
let radConv = Math.PI / 180.0;

function createWorld(gridMesh){ // at each new gridObject, keep normal in mind
    let radConv = Math.PI / 180.0;
    let angle = 0;
    let parentGrid = null;
    let grid = null;
    let corners = null;
    let adder = null;
    let edge = null;
    let proj_desc = null;
    let proj_thumb = null;
    let proj_skills = null;

    // 0 start 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    grid = worldGraph.getGridObject(0);
    grid.setColor(1.1, 1.8, 2.2);
    grid.setScale(2,1,4);
    grid.setPosition(0,0,-grid.scl.get(2) + 1);
    grid.setObjectsTexture(new Texture("tutorial"));
    grid.objectsTexture.setColsRows(1.0,1.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,-90,0);
    proj_desc.setPosition(grid.scl.get(0)+1, 1, -4.5);
    proj_desc.parametricT = -2;
    proj_desc.setColorVec(grid.getColor());
    grid.setObjects([proj_desc]);


    // 1 main
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(0);
    grid = worldGraph.getGridObject(1);
    grid.setColor(1.6, 1.5, 2.5);
    grid.setScale(2,1,5);
    angle = 35;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(0,1, edge);

    // 2 base purple
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(1);
    grid = worldGraph.getGridObject(2);
    grid.setColor(2.1, 1.2, 2.8);
    grid.setScale(3,1,6);
    angle = -15;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, false);
    worldGraph.makeAdjacent(1,2, edge);
    grid.setObjectsTexture(new Texture("sign"));
    grid.objectsTexture.setColsRows(3.0,1.0);
    //proj 
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.sign = 1;
    proj_desc.setScale(1,1,0.25);
    proj_desc.setRotation(90,90,0);
    proj_desc.setPosition(-grid.scl.get(0),2,2);
    proj_desc.setColorHDR(2.5, 2.0, 0.6);
    proj_desc.convertToWorld(grid);
   //xp 
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.sign = 1;
    proj_thumb.setScale(1,1,0.25);
    proj_thumb.rotate(90,0,0);
    proj_thumb.setColorHDR(1.1, 2.2, 1.8);
    proj_thumb.setPosition(0,1,-grid.scl.get(2));
    proj_thumb.convertToWorld(grid);
   //research 
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.sign = 1;
    proj_skills.setScale(1,1,0.25);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(0),0.5,-3);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorHDR(3.1, 1.2, 2.0);
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    // 3 green XP 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(2);
    grid = worldGraph.getGridObject(3);
    grid.setColor(1.1, 2.2, 1.8);
    grid.setScale(1,1,5);
    angle = 20;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(2,3, edge);

    // 4 orange Projects 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(2);
    grid = worldGraph.getGridObject(4);
    grid.setColor(2.5, 2.0, 0.6);
    grid.setScale(1,1,6);
    angle = 60;
    grid.rotate(angle,90,0);
    angle = angle * radConv;
    grid.setPosition(-parentGrid.scl.get(0),0,2);
    adder = new Vec3(- grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(2,4, edge);

    // 5 pink research 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(2);
    grid = worldGraph.getGridObject(5);
    grid.setColor(3.1, 1.2, 2.0);
    grid.setScale(1,1,10);
    angle = -15;
    grid.rotate(angle,-90,0);
    angle = angle * radConv;
    grid.setPosition(parentGrid.scl.get(0),0,-3);
    adder = new Vec3(grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(2,5, edge);

    ///////////////////////////////////////////////////////////////////////////////////
    /************************************ PROJECTS **********************************/
    //////////////////////////////////////////////////////////////////////////////////

    // 6 Base Project lane
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(4);
    grid = worldGraph.getGridObject(6);
    grid.setColor(3.0, 1.8, 0.6);
    grid.setScale(4,1,8);
    angle = -20;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, false);
    worldGraph.makeAdjacent(4,6, edge);


    // 7 Skeletal Engine
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(6);
    grid = worldGraph.getGridObject(7);
    grid.setColor(3.5, 0.7, 0.7);
    grid.setScale(1,1,4);
    angle = 30;
    grid.rotate(angle,90,0);
    angle = angle * radConv;
    grid.setPosition(-parentGrid.scl.get(0),0,5);
    adder = new Vec3(- grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(6,7, edge);
   
    //8 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(7);
    grid = worldGraph.getGridObject(8);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://github.com/Twins-Diwakar-Sharma/SkeletalEngine";
    angle = 30;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(7,8, edge);
    grid.setObjectsTexture(new Texture("skeletalEngine"));
    grid.objectsTexture.setColsRows(2.0,2.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.setScale(2,1,1);
    proj_thumb.rotate(90,90,0);
    proj_thumb.setColorVec(parentGrid.getColor());
    proj_thumb.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_thumb.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    // 9 HEX
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(6);
    grid = worldGraph.getGridObject(9);
    grid.setColor(2.1, 1.2, 2.8);
    grid.setScale(1,1,4);
    angle = 15;
    grid.rotate(-angle,-90,0);
    angle = angle * radConv;
    grid.setPosition(parentGrid.scl.get(0),0,6);
    adder = new Vec3(grid.scl.get(2) * Math.cos(angle), -grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(6,9, edge);
   
    // 10
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(9);
    grid = worldGraph.getGridObject(10);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://github.com/Twins-Diwakar-Sharma/Hex";
    angle = 60;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(9,10, edge);
    grid.setObjectsTexture(new Texture("hex"));
    grid.objectsTexture.setColsRows(2.0,2.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.setScale(2,1,1);
    proj_thumb.rotate(90,90,0);
    proj_thumb.setColorVec(parentGrid.getColor());
    proj_thumb.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_thumb.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    //11 Complex Plane 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(6);
    grid = worldGraph.getGridObject(11);
    grid.setColor(0.8, 2.2, 2.8);
    grid.setScale(1,1,4);
    angle = 30;
    grid.rotate(-angle,90,0);
    angle = angle * radConv;
    grid.setPosition(-parentGrid.scl.get(0),0,2);
    adder = new Vec3(- grid.scl.get(2) * Math.cos(angle),- grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(6,11, edge);
   
    //12 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(11);
    grid = worldGraph.getGridObject(12);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://github.com/Twins-Diwakar-Sharma/ComplexPlane";
    angle = 90;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(11,12, edge);
    grid.setObjectsTexture(new Texture("complexPlane"));
    grid.objectsTexture.setColsRows(2.0,2.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.setScale(2,1,1);
    proj_thumb.rotate(90,90,0);
    proj_thumb.setColorVec(parentGrid.getColor());
    proj_thumb.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_thumb.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    // 13 Neural Network 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(6);
    grid = worldGraph.getGridObject(13);
    grid.setColor(0.5, 0.5, 0.5);
    grid.setScale(1,1,4);
    angle = 5;
    grid.rotate(angle,-90,0);
    angle = angle * radConv;
    grid.setPosition(parentGrid.scl.get(0),0,2);
    adder = new Vec3(grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(6,13, edge);
   
    // 14
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(13);
    grid = worldGraph.getGridObject(14);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://github.com/Twins-Diwakar-Sharma/Neural-Network";
    angle = 60;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(13,14, edge);
    grid.setObjectsTexture(new Texture("neuralNetwork"));
    grid.objectsTexture.setColsRows(2.0,2.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.setScale(2,1,1);
    proj_thumb.rotate(90,90,0);
    proj_thumb.setColorVec(parentGrid.getColor());
    proj_thumb.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_thumb.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    // 15 Final Valley 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(6);
    grid = worldGraph.getGridObject(15);
    grid.setColor(2.1, 4.2, 2.8);
    grid.setScale(1,1,4);
    angle = 90;
    grid.rotate(angle,90,0);
    angle = angle * radConv;
    grid.setPosition(-parentGrid.scl.get(0),0,-1);
    adder = new Vec3(- grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(6,15, edge);
   
    //16 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(15);
    grid = worldGraph.getGridObject(16);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://github.com/Twins-Diwakar-Sharma/FinalValley";
    angle = 90;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(15,16, edge);
    grid.setObjectsTexture(new Texture("finalValley"));
    grid.objectsTexture.setColsRows(2.0,2.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.setScale(2,1,1);
    proj_thumb.rotate(90,90,0);
    proj_thumb.setColorVec(parentGrid.getColor());
    proj_thumb.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_thumb.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    // 17 Mathril 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(6);
    grid = worldGraph.getGridObject(17);
    grid.setColor(2.8, 1.2, 1.4);
    grid.setScale(1,1,4);
    angle = 30;
    grid.rotate(angle,-90,0);
    angle = angle * radConv;
    grid.setPosition(parentGrid.scl.get(0),0,-2);
    adder = new Vec3(grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(6,17, edge);
   
    // 18
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(17);
    grid = worldGraph.getGridObject(18);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://github.com/Twins-Diwakar-Sharma/Mathril";
    angle = 60;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(17,18, edge);
    grid.setObjectsTexture(new Texture("mathril"));
    grid.objectsTexture.setColsRows(2.0,2.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.setScale(2,1,1);
    proj_thumb.rotate(90,90,0);
    proj_thumb.setColorVec(parentGrid.getColor());
    proj_thumb.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_thumb.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    //19 Website Manager  //zeus
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(6);
    grid = worldGraph.getGridObject(19);
    grid.setColor(2.2, 0.9, 2.8);
    grid.setScale(1,1,4);
    angle = 5;
    grid.rotate(-angle,90,0);
    angle = angle * radConv;
    grid.setPosition(-parentGrid.scl.get(0),0,-4);
    adder = new Vec3(- grid.scl.get(2) * Math.cos(angle),- grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(6,19, edge);
   
    //20 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(19);
    grid = worldGraph.getGridObject(20);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://github.com/Twins-Diwakar-Sharma/WebsitePasswordManager";
    angle = 90;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(19,20, edge);
    grid.setObjectsTexture(new Texture("websitePasswordManager"));
    grid.objectsTexture.setColsRows(2.0,2.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_thumb = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_thumb.subTexPos = 1;
    proj_thumb.setScale(2,1,1);
    proj_thumb.rotate(90,90,0);
    proj_thumb.setColorVec(parentGrid.getColor());
    proj_thumb.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_thumb.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 2;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_thumb, proj_skills]);


    ///////////////////////////////////////////////////////////////////////////////////
    /*************************************** XP *************************************/
    //////////////////////////////////////////////////////////////////////////////////

    // 21 wipro 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(3);
    grid = worldGraph.getGridObject(21);
    grid.setColor(1.6, 1.5, 2.5);
    grid.setScale(1,1,5);
    angle = -5;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0,grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(3,21, edge);

    //22
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(21);
    grid = worldGraph.getGridObject(22);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    angle = 1;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(21,22, edge);
    grid.setObjectsTexture(new Texture("wipro"));
    grid.objectsTexture.setColsRows(2.0,1.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 1;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,90,0);
    proj_skills.setPosition(-grid.scl.get(0)-1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_skills]);

    //23 mettle intern
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(22);
    grid = worldGraph.getGridObject(23);
    grid.setColor(2.6, 1.5, 0.5);
    grid.setScale(1,1,5);
    angle = 30;
    grid.rotate(angle,-90,0);
    angle = angle * radConv;
    adder = new Vec3(grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0 );
    grid.setPosition(parentGrid.scl.get(2),0,0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(22,23, edge);


    //24
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(23);
    grid = worldGraph.getGridObject(24);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    angle = -15;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, false);
    worldGraph.makeAdjacent(23,24, edge);
    grid.setObjectsTexture(new Texture("mettl-intern"));
    grid.objectsTexture.setColsRows(2.0,1.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,90,0);
    proj_desc.setPosition(-grid.scl.get(2)-1, 1, 0);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 1;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_skills]);
    
    //25 Mettl
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(24);
    grid = worldGraph.getGridObject(25);
    grid.setColor(2.6, 0.5, 1.5);
    grid.setScale(1,1,5);
    angle = 30;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0,grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(24,25, edge);

    //26 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(25);
    grid = worldGraph.getGridObject(26);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    angle = -15;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, false);
    worldGraph.makeAdjacent(25,26, edge);
    grid.setObjectsTexture(new Texture("mettl"));
    grid.objectsTexture.setColsRows(2.0,1.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    proj_skills = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_skills.subTexPos = 1;
    proj_skills.setScale(2,1,1);
    proj_skills.setRotation(90,-90,0);
    proj_skills.setPosition(grid.scl.get(2)+1, 1, 0);
    proj_skills.convertToWorld(grid);
    proj_skills.setColorVec(parentGrid.getColor());
    grid.setObjects([proj_desc, proj_skills]);

    ///////////////////////////////////////////////////////////////////////////////////
    /********************************** RESEARCH ***********************************/
    //////////////////////////////////////////////////////////////////////////////////

    // 27 Base Research
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(5);
    grid = worldGraph.getGridObject(27);
    grid.setColor(0.6, 2.5, 2.0);
    grid.setScale(3,1,5);
    angle = 30;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0,grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(5,27, edge);

    // 28 Vector
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(27);
    grid = worldGraph.getGridObject(28);
    grid.setColor(2.6, 2.2, 1.0);
    grid.setScale(1,1,3);
    angle = -15;
    grid.rotate(angle,-90,0);
    angle = angle * radConv;
    grid.setPosition(parentGrid.scl.get(0),0,3);
    adder = new Vec3(grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(27, 28, edge);

    // 29
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(28);
    grid = worldGraph.getGridObject(29);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://link.springer.com/chapter/10.1007/978-3-031-07012-9_2";
    angle = 30;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(28,29, edge);
    grid.setObjectsTexture(new Texture("vector"));
    grid.objectsTexture.setColsRows(1.0,1.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    grid.setObjects([proj_desc]);

    // 30 Moment Of Inertia 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(27);
    grid = worldGraph.getGridObject(30);
    grid.setColor(0.6, 1.5, 2.5);
    grid.setScale(1,1,3);
    angle = -15;
    grid.rotate(angle,-90,0);
    angle = angle * radConv;
    grid.setPosition(parentGrid.scl.get(0),0,-3);
    adder = new Vec3(grid.scl.get(2) * Math.cos(angle), grid.scl.get(2) * Math.sin(angle), 0);
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = grid.getCorners();
    edge = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(27, 30, edge);

    // 31 
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    parentGrid = worldGraph.getGridObject(30);
    grid = worldGraph.getGridObject(31);
    grid.setColorVec(parentGrid.getColor());
    grid.setScale(2,1,2);
    grid.special = true;
    grid.link = "https://link.springer.com/chapter/10.1007/978-3-031-07012-9_6";
    angle = 30;
    grid.rotate(angle,0,0);
    angle = angle * radConv;
    grid.setPosition(0,0,-parentGrid.scl.get(2));
    adder = new Vec3(0, grid.scl.get(2) * Math.sin(angle), - grid.scl.get(2) * Math.cos(angle));
    grid.pos = Vec3.add(grid.pos, adder); 
    grid.convertToWorld(parentGrid);
    corners = parentGrid.getCorners();
    edge = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(30,31, edge);
    grid.setObjectsTexture(new Texture("inertia"));
    grid.objectsTexture.setColsRows(1.0,1.0);
    proj_desc = new GameObject(new ObjectMesh(), grid.objectsTexture);
    proj_desc.subTexPos = 0;
    proj_desc.setScale(2,1,1);
    proj_desc.setRotation(90,0,0);
    proj_desc.setPosition(0, 1, -grid.scl.get(2)-1);
    proj_desc.setColorVec(parentGrid.getColor());
    proj_desc.convertToWorld(grid);
    grid.setObjects([proj_desc]);


}

