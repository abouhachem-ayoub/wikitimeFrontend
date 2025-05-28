precision highp float;

uniform vec3 uColorInn;
uniform vec3 uColorOut;
uniform sampler2D uAlphaMap;

varying float vDistance;

#define PI 3.14159265359

void main() {
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    float a = texture2D(uAlphaMap, uv).g;
    if (a < 0.1) discard;

    vec3 color = mix(uColorInn, uColorOut, vDistance);
    float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);
    color = max(color, vec3(c));

    gl_FragColor = vec4(color, a);
}
