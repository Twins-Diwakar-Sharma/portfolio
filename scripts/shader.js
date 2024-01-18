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
uniform mat4 transform;
uniform Camera cam;

out vec2 fragTex;
out vec3 fragNor;

vec4 quatRotate(vec4 action, vec4 victim)
{
	float ar = action.w;	float br = victim.w;
	vec3 av = action.xyz;	vec3 bv = victim.xyz;
	return vec4(ar*bv + br*av + cross(av,bv), ar*br - dot(av,bv));
}


void main()
{
	vec3 position = pos;
    vec4 objectPos = vec4(position,1);
    vec4 worldPos = transform * objectPos;
  

	vec3 viewPos = worldPos.xyz - cam.pos;
	vec4 quatView = vec4(viewPos,0);
	vec4 spinQuat = vec4(-cam.spin.xyz, cam.spin.w);
	vec4 spinQuatInv = vec4(cam.spin);

	quatView = quatRotate(quatView, spinQuatInv);
	quatView = quatRotate(spinQuat, quatView);

	vec4 projectedPos = projection * vec4(quatView.xyz,1.0);


	gl_Position = projectedPos;

  fragTex = vec2(tex.x, 1.0 - tex.y);
	vec3 normal = nor;
	fragNor = normalize((transform * vec4(normal,0.0) ).xyz) ;
}
`;

const shader_objectFragment=`#version 300 es

precision highp float;

struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};

in vec2 fragTex;
in vec3 fragNor;

out vec4 outColor;
uniform sampler2D albedo;
uniform DirectionalLight sun;

void main()
{
  
  vec4 colorV4 = texture(albedo,fragTex);
  if(colorV4.a < 0.1)
    discard;
  vec3 color = colorV4.rgb;
  vec3 toLight = -normalize(sun.direction);	
	float diffuse = max(dot(toLight,fragNor),0.1);
	vec3 diffuseColor = diffuse*sun.color;
  color = diffuseColor * color;
  outColor = vec4(color,1.0);
  

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


	gl_Position = projectedPos;

}
`;

const shader_gridFragment=`#version 300 es

precision highp float;

in vec2 scaledPos;

out vec4 outColor;

uniform vec3 color;

void main()
{
  vec2 d = (scaledPos);
  d = fract(d); 
  d = 0.005/d;
  
  
  vec2 d1 = vec2(1.0) - vec2(scaledPos);
  d1 = fract(d1); 
  d1 = 0.005/d1;

  float res = d.x + d.y + d1.x + d1.y;
  vec3 modifiedColor = color * res;
  
  //modifiedColor = smoothstep(0.0,1.0,modifiedColor);

  outColor = vec4(modifiedColor,1.0);  

} 
`;
