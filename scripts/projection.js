const proj_perspective = new Mat4();

const setProjection =(near, far, fov, width, height)=> {
  
  let aspectRatio = parseFloat(width)/parseFloat(height);
  let radfov = fov * Math.PI / 180.0;
  let d = 1.0/( Math.tan(radfov/2.0) );

  proj_perspective.set(0,0, d/aspectRatio);
  proj_perspective.set(1,1, d);
  proj_perspective.set(2,2, (near+far)/(near-far));
  proj_perspective.set(2,3, (2*near*far)/(near-far));
  proj_perspective.set(3,2, -1.0);

}
