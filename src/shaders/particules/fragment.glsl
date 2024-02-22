varying vec2 vUv;
varying vec3 vColor;
varying float vUtime;



void main() {

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); 
    #include <colorspace_fragment>
}


