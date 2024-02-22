uniform float uTime;
uniform float duration;
uniform float startTime;


varying vec2 vUv;
varying vec3 vColor;
varying float vUtime;




void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = 1.5;

    vUv=uv;
    vColor=color;
    vUtime= uTime;
}
