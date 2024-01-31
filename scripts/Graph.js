class GraphEdge {
  constructor(p0, p1, relativeUp){
    this.p0 = p0;
    this.p1 = p1;
		this.relativeUp = relativeUp;
  }
};

class GraphVertex {
	
	static counter = 0;

  constructor(){
		this.gridObject = new GridObject(null);
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

	setMesh =(gridMesh)=> {
		for(let i=0; i<this.vertices.length; i++){
			this.vertices[i].gridObject.setMesh(gridMesh);
		}
	}

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
worldGraph.vertices.push(new GraphVertex());
worldGraph.vertices[0].gridObject.setPosition(0,0,0);
worldGraph.vertices[0].gridObject.setScale(2,2,4);
worldGraph.vertices[0].gridObject.setColor(1.1,2.1,1.8);

worldGraph.vertices.push(new GraphVertex());
worldGraph.vertices[1].gridObject.setRotation(90, 0, 0);
worldGraph.vertices[1].gridObject.setScale(1,1,4);
worldGraph.vertices[1].gridObject.setPosition(0,4,-4);
worldGraph.vertices[1].gridObject.setColor(1.0, 0.59, 0.11);

let corners = worldGraph.getGridObject(1).getCorners();
let edge01 = new GraphEdge(corners.botLeft, corners.botRight, true);
worldGraph.makeAdjacent(0, 1, edge01);

worldGraph.vertices.push(new GraphVertex());
worldGraph.getGridObject(2).setRotation(90,0,0);
worldGraph.getGridObject(2).setScale(1,1,1);
worldGraph.getGridObject(2).setPosition(0,1,-4);
worldGraph.getGridObject(2).convertToWorld(worldGraph.getGridObject(1));

corners = worldGraph.getGridObject(2).getCorners();
let edge12 = new GraphEdge(corners.botLeft, corners.botRight, true);

worldGraph.makeAdjacent(1, 2, edge12);

worldGraph.vertices.push(new GraphVertex());
worldGraph.getGridObject(3).setColor(0.8, 2.1, 1.3);
worldGraph.getGridObject(3).setScale(1,1,2);
worldGraph.getGridObject(3).setRotation(0,90,0);
worldGraph.getGridObject(3).rotate(0, 0, 45);
worldGraph.getGridObject(3).setPosition(2,0,0);
let len = worldGraph.getGridObject(3).scl.data[2];
let radConv = Math.PI / 180.0;
let angle = 45.0 * radConv;
let toAdd = new Vec3( len * Math.cos(angle), len * Math.sin(angle), 0);
worldGraph.getGridObject(3).pos = Vec3.add(worldGraph.getGridObject(3).pos, toAdd);


corners = worldGraph.getGridObject(3).getCorners();
let edge03 = new GraphEdge(corners.botLeft, corners.botRight, true);

worldGraph.makeAdjacent(0, 3, edge03);


