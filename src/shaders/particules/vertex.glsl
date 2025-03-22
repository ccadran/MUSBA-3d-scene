uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;



#include ../includes/remap.glsl

void main()
{

  vec3 newPosition = position;
  float progress = uProgress * aTimeMultiplier;

  //Exploding
  float explodingProgress = remap(progress, 0.0, 0.4, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  explodingProgress = 1.0 - (pow(1.0 - explodingProgress, 3.0));
  newPosition = mix(vec3(0.0), newPosition, explodingProgress);

  //Falling
  float fallingPorgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  fallingPorgress = clamp(fallingPorgress, 0.0, 1.0);
  fallingPorgress = 1.0 - pow(1.0 - fallingPorgress, 3.0);
  newPosition.y -= fallingPorgress * 0.2;

  //Scaling
  float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
   float sizeProgress = clamp(sizeOpeningProgress, 0.0, 1.0);

  //Twinkling
  float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
  twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
  float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
  sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

  //Final position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0); 
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

//   Final size
  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress ;
  gl_PointSize *= 1.0 /- viewPosition.z;

  if(gl_PointSize < 1.0)
  {
    gl_Position = vec4(9999.9);
  }
  }




  