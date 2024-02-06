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

function createWorld(gridMesh){
    let radConv = Math.PI / 180.0;


    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    worldGraph.vertices[0].gridObject.setPosition(0,0,0);
    worldGraph.vertices[0].gridObject.setScale(2,2,4);
    worldGraph.vertices[0].gridObject.setColor(1.1,2.1,1.8);

    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    worldGraph.vertices[1].gridObject.setRotation(-30, 0, 0);
    worldGraph.vertices[1].gridObject.setScale(1,1,4);
    worldGraph.vertices[1].gridObject.setPosition(0,0,-4);
    let g1SclZ = worldGraph.getGridObject(1).scl.get(2);
    let g1AddAngle = 30 * radConv;
    let addG1 = new Vec3(0,-g1SclZ*Math.sin(g1AddAngle), -g1SclZ*Math.cos(g1AddAngle));
    worldGraph.getGridObject(1).pos = Vec3.add(worldGraph.getGridObject(1).pos, addG1);
    worldGraph.vertices[1].gridObject.setColor(1.0, 0.59, 0.11);

    let corners = worldGraph.getGridObject(1).getCorners();
    let edge01 = new GraphEdge(corners.botLeft, corners.botRight, false);
    worldGraph.makeAdjacent(0, 1, edge01);
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    worldGraph.getGridObject(2).setRotation(90,0,0);
    worldGraph.getGridObject(2).setScale(3,1,3);
    worldGraph.getGridObject(2).setPosition(0,3,-4);
    worldGraph.getGridObject(2).setColor(0.2, 2.0, 0.2);
    worldGraph.getGridObject(2).convertToWorld(worldGraph.getGridObject(1));

    corners = worldGraph.getGridObject(2).getCorners();
    let edge12 = new GraphEdge(corners.botLeft, corners.botRight, true);

    worldGraph.makeAdjacent(1, 2, edge12);

    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    worldGraph.getGridObject(3).setColor(3.1, 1.1, 1.5);
    worldGraph.getGridObject(3).setScale(1,1,2);
    worldGraph.getGridObject(3).setRotation(0,90,0);
    worldGraph.getGridObject(3).rotate(0, 0, 45);
    worldGraph.getGridObject(3).setPosition(2,0,0);
    let len = worldGraph.getGridObject(3).scl.data[2];
    let angle = 45.0 * radConv;
    let toAdd = new Vec3( len * Math.cos(angle), len * Math.sin(angle), 0);
    worldGraph.getGridObject(3).pos = Vec3.add(worldGraph.getGridObject(3).pos, toAdd);


    corners = worldGraph.getGridObject(3).getCorners();
    let edge03 = new GraphEdge(corners.topLeft, corners.topRight, true);
    worldGraph.makeAdjacent(0, 3, edge03);

    ///////////////////////////
    worldGraph.vertices.push(new GraphVertex(new GridObject(gridMesh)));
    worldGraph.getGridObject(4).special = true;
    worldGraph.getGridObject(4).setColor(2.0, 1.0, 2.0);
    worldGraph.getGridObject(4).setScale(1,1,1);
    // lagaing in the chutad
    worldGraph.getGridObject(4).setPosition(0,0,2);
    worldGraph.getGridObject(4).setRotation(-60,0,0);
    angle = 60 * radConv;
    toAdd = new Vec3( 0,  1.0 * Math.sin(angle), 1.0 * Math.cos(angle));
    worldGraph.getGridObject(4).pos = Vec3.add(worldGraph.getGridObject(4).pos, toAdd);
    worldGraph.getGridObject(4).convertToWorld(worldGraph.getGridObject(3));

    let planeObject = new GameObject(new ObjectMesh(), new Texture("woodBox"));
    let poss = worldGraph.getGridObject(4).pos;

    worldGraph.getGridObject(4).setObjects([planeObject]);
    let edge34 = new GraphEdge(corners.botLeft, corners.botRight, true);
    worldGraph.makeAdjacent(3, 4, edge34);
}


