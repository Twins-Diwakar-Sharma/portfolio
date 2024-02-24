const start =()=> {
  
  let canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl2');

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

  let engine = new Engine(canvas.width, canvas.height); 
  engine.loop();

};

