precision highp float;

attribute vec3 seed;
attribute float size;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uSize;
uniform float uRadius;

#define PI  3.14159265359
#define PI2 6.28318530718

#include <random, scatter>

// Universe size factor
const float r = 3.0;
// Scale universe sphere 
const vec3 s = vec3(2.1, 1.3, 2.1);



void main() {

  vec3 p = scatter(seed) * r * s;

  // Sweep to center
  float q = random(seed.zx);
  for (int i = 0; i < 3; i++) q *= q;
  p *= q;

  // Sweep to surface
  float l = length(p) / (s.x * r);
  p = l < 0.001 ? (p / l) : p;

  // Rotate (center faster)
  vec3 temp = p;
  float ql = 1.0 - l;
  for (int i = 0; i < 3; i++) ql *= ql;
  float ac = cos(-uTime * ql);
  float as = sin(-uTime * ql);
  p.x = temp.x * ac - temp.z * as;
  p.z = temp.x * as + temp.z * ac;



  vec4 mvp = modelViewMatrix * vec4(p * uRadius, 1.0);
  gl_Position = projectionMatrix * mvp;

  // Scale up core stars
  l = (2.0 - l) * (2.0 - l);

  gl_PointSize = (r * size * uSize * l) / -mvp.z;
}
