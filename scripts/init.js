const start =()=> {
  
  let canvas = document.getElementById('canvas');
  let gl = canvas.getContext('webgl2');

  if(!gl)
  {
    gl = canvas.getContext('webgl-experimental');
  }

  if(!gl)
  {
    console.log("Your browser does not support webgl");
    alert("Oops!! Browser does not support Webgl");
  }

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  console.log(canvas.width  + " : " + canvas.height);

  let engine = new Engine(gl,  canvas.width, canvas.height); 
  engine.loop();

};

