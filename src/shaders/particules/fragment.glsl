uniform sampler2D uTexture;
uniform vec3 uColor;

varying vec3 color;

void main()
{
  

  float textureAlpha = texture(uTexture, gl_PointCoord).r;

  //Final color
  gl_FragColor = vec4(color, textureAlpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}