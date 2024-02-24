const shader_objectVertex=`#version 300 es
struct Camera
{
	vec4 spin;
	vec3 pos;
};

layout (location = 0) in vec3 pos;
layout (location = 1) in vec2 tex;
layout (location = 2) in vec3 nor;

uniform mat4 projection;
uniform vec3 position;
uniform vec3 scale;
uniform vec4 rotation;
uniform Camera cam;

out vec2 fragTex;
out vec3 fragNor;

out vec2 OPos;

vec4 quatMultiply(vec4 action, vec4 victim)
{
	float ar = action.w;	float br = victim.w;
	vec3 av = action.xyz;	vec3 bv = victim.xyz;
	return vec4(ar*bv + br*av + cross(av,bv), ar*br - dot(av,bv));
}

vec3 quatRotate(vec4 quat, vec3 pos)
{
  vec4 invQuat = vec4(-quat.xyz, quat.w);
  vec4 qPos = vec4(pos.xyz,0);
  qPos = quatMultiply(qPos, invQuat);
  qPos = quatMultiply(quat, qPos);

  return qPos.xyz;
}

void main()
{

   vec3 objectPos = vec3(pos);
   vec3 worldPos = scale * objectPos;
   worldPos = quatRotate(rotation, worldPos); 
   worldPos = worldPos + position; 

	vec3 viewPos = worldPos - cam.pos;
	vec4 spinQuat = vec4(-cam.spin.xyz, cam.spin.w);
   viewPos = quatRotate(spinQuat, viewPos);


	vec4 projectedPos = projection * vec4(viewPos,1.0);


	gl_Position = projectedPos;

    fragTex = vec2(tex.x, 1.0 - tex.y);
	vec3 normal = nor;
    fragNor = quatRotate(rotation, normal);

    OPos = objectPos.xz;
}
`;

const shader_objectFragment=`#version 300 es

precision highp float;


in vec2 fragTex;
in vec3 fragNor;

in vec2 OPos;

out vec4 outColor;
uniform sampler2D albedo;
uniform vec3 overlayColor;
uniform float subTexPos;
uniform vec2 colsRows;

uniform int sign;
uniform vec3 scale;

void main()
{

      float row = float(int(subTexPos/colsRows.x));
      float col = mod(subTexPos,colsRows.x);
      vec2 subTexDim = vec2(1.0/colsRows.x, 1.0/colsRows.y);
      vec2 texPosAdd = vec2(col*subTexDim.x, row*subTexDim.y);
      
      vec2 texCoord = fragTex*subTexDim + texPosAdd;
      vec4 colorV4 = texture(albedo,texCoord);
      vec3 color = colorV4.rgb;

   if(sign == 0) { 
      float gamma = color.r * color.g * color.b;
      gamma = gamma * gamma * gamma;
      color = (1.0 - gamma)*color  + gamma*color*overlayColor;
      outColor = vec4(color,colorV4.a);
    }  
    else {
     vec2 uv = OPos + vec2(1.);
     
     uv *= 0.5;

     vec2 d = (uv*scale.xz);
     d = 0.01/d;
      
      vec2 d1 = vec2(1.0)*scale.xz - vec2(uv*scale.xz);
      d1 = fract(d1);
      d1 = 0.01/d1;

      float res = d.x + d.y + d1.x + d1.y;
      outColor = vec4(color*overlayColor, colorV4.a); 
      outColor += res*vec4(overlayColor, 0.5);
     
    }

}`;


const shader_gridVertex=`#version 300 es
struct Camera
{
	vec4 spin;
	vec3 pos;
};

layout (location = 0) in vec2 pos;

uniform mat4 projection;
uniform Camera cam;
uniform vec3 scale;
uniform vec3 position;
uniform vec4 rotation;

out vec2 scaledPos;
out vec2 OPos;

vec4 quatMultiply(vec4 action, vec4 victim)
{
	float ar = action.w;	float br = victim.w;
	vec3 av = action.xyz;	vec3 bv = victim.xyz;
	return vec4(ar*bv + br*av + cross(av,bv), ar*br - dot(av,bv));
}

vec3 quatRotate(vec4 quat, vec3 pos)
{
  vec4 invQuat = vec4(-quat.xyz, quat.w);
  vec4 qPos = vec4(pos.xyz,0);
  qPos = quatMultiply(qPos, invQuat);
  qPos = quatMultiply(quat, qPos);

  return qPos.xyz;
}


void main()
{
	vec3 objectPos = vec3(pos.x, 0, pos.y);
  vec3 worldPos = scale * objectPos;
  worldPos = quatRotate(rotation, worldPos); 
  worldPos = worldPos + position; 

  scaledPos = scale.xz * (pos + vec2(1.0));

	vec3 viewPos = worldPos - cam.pos;
	vec4 spinQuat = vec4(-cam.spin.xyz, cam.spin.w);
  viewPos = quatRotate(spinQuat, viewPos);


	vec4 projectedPos = projection * vec4(viewPos,1.0);

    OPos = objectPos.xz ;
	gl_Position = projectedPos;

}
`;

const shader_gridFragment=`#version 300 es

precision highp float;

in vec2 scaledPos;

out vec4 outColor;

in vec2 OPos;

uniform vec3 color;

uniform int special;

uniform float uTime;

uniform float texAlpha;

void main()
{

 if(special == 0)
 {
      vec2 d = (scaledPos);
      d = fract(d); 
      d = 0.005/d;
      
         
      vec2 d1 = vec2(1.0) - vec2(scaledPos);
      d1 = fract(d1); 
      d1 = 0.005/d1;

      float res = d.x + d.y + d1.x + d1.y;
      vec3 modifiedColor = color * res;

      outColor = vec4(modifiedColor,texAlpha);  

  }
  else {
   
     vec2 uv = OPos + vec2(1.);
     
     uv *= 0.5;

     vec2 d = (uv);
     d = 0.005/d;
      
      vec2 d1 = vec2(1.0) - vec2(uv);
      d1 = fract(d1);
      d1 = 0.005/d1;

      float res = d.x + d.y + d1.x + d1.y;
        
      vec2 lenVec = abs(OPos) - vec2(1.0);
      float gol = max(lenVec.x, lenVec.y);
      
      gol = sin(gol*8.0 + uTime)/8.0;
      gol = 0.005/gol;
      gol = abs(gol);
      
      res = gol+res;

      vec3 modifiedColor = color * res;
      

      outColor = vec4(modifiedColor,texAlpha);

  }

} 
`;
