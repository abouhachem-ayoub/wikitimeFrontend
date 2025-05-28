precision highp float;

uniform sampler2D uAlphaMap;

#define PI 3.14159265359

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  gl_FragColor = vec4(vec3(1.0), a);
}
