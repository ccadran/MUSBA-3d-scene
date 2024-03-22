import * as THREE from "three";
// import particulesVertexShader from "./shaders/particules/vertex.glsl";
// import particulesFragmentShader from "./shaders/particules/fragment.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import fireworkVertexShader from "./shaders/particules/vertex.glsl";
import fireworkFragmentShader from "./shaders/particules/fragment.glsl";

import gsap from "gsap";
import GUI from "lil-gui";

/**
 * Basic animations
 */

const loader = document.querySelector(".loader");
const htmlContainer = document.querySelector(".html-3d-scene");
const enterExperience = document.querySelector(".enter");
const cursorFollow = document.querySelector(".cursor");
const cursorFollow2 = document.querySelector(".cursor2");

enterExperience.addEventListener("click", () => {
  gsap.set(htmlContainer, {
    display: "flex",
  });
  gsap.to(htmlContainer, {
    opacity: "100%",
    delay: 1,
  });
  gsap.set(cursorFollow, {
    display: "none",
  });
  gsap.set(cursorFollow2, {
    display: "none",
  });
  gsap.to(loader, {
    maskImage:
      "radial-gradient(circle at center  bottom , transparent 0%, transparent 100%, black 100%)",
    ease: "power3.inOut",
    duration: 1,
  });
});

setTimeout(() => {
  gsap.set(enterExperience, {
    cursor: "pointer",
    pointerEvents: "auto",
  });
  enterExperience.innerHTML = "<h4>Enter</h4>";
}, [3500]);

window.addEventListener("mousemove", (e) => {
  gsap.set(cursorFollow, {
    display: "block",
  });
  gsap.set(cursorFollow2, {
    display: "block",
  });

  gsap.to(cursorFollow, {
    left: e.x,
    top: e.y,
    duration: 0.3,
  });
  gsap.to(cursorFollow2, {
    left: e.x,
    top: e.y,
    duration: 0.4,
  });
});

/**
 * Three.js
 */

const nextButton = document.querySelector(".right-arrow");
const prevButton = document.querySelector(".left-arrow");
/**
 * Base
 */
// Debug
const gui = new GUI({
  title: "Debug Panel",
});

gui.hide();

window.addEventListener("keydown", (e) => {
  if (e.key == "h") {
    gui.show(gui._hidden);
  }
});
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);

// scene.add(axesHelper);

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const finalScene = new THREE.Group();

//World1
const world1 = new THREE.Group();

//World2
const world2 = new THREE.Group();

let mixer = null;

let phone;

gltfLoader.load("/models/phone.glb", (gltf) => {
  phone = gltf.scene;
  phone.scale.set(0.2, 0.2, 0.2);
  phone.position.y = 1.5;
  phone.position.z = 3;
  phone.rotation.y = Math.PI * 1.35;

  phone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  world1.add(phone);
  tick();
});

let paint;
gltfLoader.load("/models/paint.glb", (gltf) => {
  paint = gltf.scene;
  paint.scale.set(0.4, 0.4, 0.4);
  paint.position.y = -2.5;
  paint.position.z = 3;
  paint.rotation.y = Math.PI * 1.35;
  paint.rotation.x = Math.PI * 0.65;

  paint.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  world2.add(paint);
  tick();
});

/**
 * Particles
 */

/**
 * New particle
 */

const textures = [
  textureLoader.load("./particles/1.png"),
  textureLoader.load("./particles/2.png"),
  textureLoader.load("./particles/3.png"),
  textureLoader.load("./particles/4.png"),
  textureLoader.load("./particles/5.png"),
  textureLoader.load("./particles/6.png"),
  textureLoader.load("./particles/7.png"),
  textureLoader.load("./particles/8.png"),
];
const colors = [
  0, // Rouge
  240 / 360, // Bleu
  60 / 360, // Jaune
  120 / 360, // Vert
  300 / 360, // Violet
  30 / 360, // Orange
  180 / 360, // Cyan
];
let particles = null;
const createFirework = (count, position, size, texture, radius, color) => {
  //Geometry
  const positionsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const timeMultipliers = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const spherical = new THREE.Spherical(
      radius * ((0.75 + Math.random() * 0.25) * 3.5),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );

    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positionsArray[i3 + 0] = position.x;
    positionsArray[i3 + 1] = position.y;
    positionsArray[i3 + 2] = position.z;

    sizesArray[i] = Math.random();

    timeMultipliers[i] = 1 + Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionsArray, 3)
  );
  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizesArray, 1)
  );
  geometry.setAttribute(
    "aTimeMultiplier",
    new THREE.Float32BufferAttribute(timeMultipliers, 1)
  );

  //Material
  texture.flipY = false;
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworkVertexShader,
    fragmentShader: fireworkFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  //Points
  particles = new THREE.Points(geometry, material);
  particles.position.copy(position);
  particles.position.z = 4;
  particles.position.y = 0.5;
  scene.add(particles);

  //Destroy
  const destroy = () => {
    scene.remove(firework);
    geometry.dispose();
    material.dispose();
  };

  //Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 4,
    ease: "linear",
    // onComplete: destroy,
  });
};
const createRandomFirework = (x) => {
  const count = Math.round(400 + Math.random() * 2000);

  const position = new THREE.Vector3(0, 0.5, 2);
  const size = 0.075;
  const texture = textures[5];
  const radius = 1.05;
  const color = new THREE.Color();
  color.setHSL(colors[Math.floor(Math.random() * colors.length)], 1, 0.7);
  createFirework(count, position, size, texture, radius, color);
};

// window.addEventListener("click", (e) => {
//   const x = e.clientX / sizes.width;
//   createRandomFirework(x);
// });
/**
 * Og particle
 */
// const uniformsOfParticles = {
//   uTime: { value: 0 },
// };

// let particles = null;

// const particulesExplosion = () => {
//   //Geometry
//   const particlesGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
//   const count = 150;

//   const positions = new Float32Array(count * 3);
//   const finalPositions = new Float32Array(count * 3);
//   const colors = new Float32Array(count * 3);

//   // Initialisation des positions à (0, 0, 0)
//   for (let i = 0; i < count; i++) {
//     const i3 = i * 3;

//     positions[i3] = (Math.random() - 0.5) * 6;
//     positions[i3 + 1] = (Math.random() - 0.5) * 6;
//     positions[i3 + 2] = (Math.random() - 0.5) * 6;

//     colors[i3] = Math.random();
//     colors[i3 + 1] = Math.random();
//     colors[i3 + 2] = Math.random();
//   }

//   particlesGeometry.setAttribute(
//     "position",
//     new THREE.BufferAttribute(positions, 3)
//   );
//   particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

//   //Material
//   const particlesMaterial = new THREE.ShaderMaterial({
//     depthWrite: true,
//     blending: THREE.AdditiveBlending,
//     vertexColors: true,
//     vertexShader: particulesVertexShader,
//     fragmentShader: particulesFragmentShader,
//     uniforms: uniformsOfParticles,
//     blending: THREE.AdditiveBlending,
//   });

//   //Points
//   particles = new THREE.Points(particlesGeometry, particlesMaterial);
//   particles.position.y = 1.5;
//   particles.position.z = 3.5;
//   scene.add(particles);
// };
// particulesExplosion();

/**
 * Background 1
 */

/**
 * Floor
 */

const backgroundGroup = new THREE.Group();

debugObject.wallColor = "#010A0C";

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
backgroundGroup.add(floor);

const roof = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
roof.receiveShadow = true;
roof.rotation.x = -Math.PI * 0.5;
roof.position.y = 5;
backgroundGroup.add(roof);

const wall1 = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
wall1.rotation.z = Math.PI;
wall1.position.z = -2.5;
wall1.position.y = 2.5;
backgroundGroup.add(wall1);

const wall2 = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
wall2.rotation.z = Math.PI;
wall2.position.z = 2.5;
wall2.position.y = 2.5;
backgroundGroup.add(wall2);

const wall3 = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
wall3.rotation.y = Math.PI * 0.5;
wall3.position.y = 2.5;
wall3.position.x = 2.5;
backgroundGroup.add(wall3);

backgroundGroup.rotation.y = Math.PI * 0.5;
backgroundGroup.position.y = -1;
backgroundGroup.position.z = 3;

world1.add(backgroundGroup);

/**
 * Background 2
 */
const secondBackgroundGroup = new THREE.Group();

debugObject.wallColor = "#010A0C";

const secondFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
secondFloor.receiveShadow = true;
secondFloor.rotation.x = -Math.PI * 0.5;
secondBackgroundGroup.add(secondFloor);

const secondRoof = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
secondRoof.receiveShadow = true;
secondRoof.rotation.x = -Math.PI * 0.5;
secondRoof.position.y = 5;
secondBackgroundGroup.add(secondRoof);

const secondWall1 = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
secondWall1.rotation.z = Math.PI;
secondWall1.position.z = -2.5;
secondWall1.position.y = 2.5;
secondBackgroundGroup.add(secondWall1);

const secondWall2 = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
secondWall2.rotation.z = Math.PI;
secondWall2.position.z = 2.5;
secondWall2.position.y = 2.5;
secondBackgroundGroup.add(secondWall2);

const secondWall3 = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({
    color: debugObject.wallColor,
    metalness: 0,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
);
secondWall3.rotation.y = Math.PI * 0.5;
secondWall3.position.y = 2.5;
secondWall3.position.x = 2.5;
secondBackgroundGroup.add(secondWall3);

secondBackgroundGroup.rotation.y = Math.PI * 1.5;
secondBackgroundGroup.rotation.x = Math.PI;
secondBackgroundGroup.position.y = -1;
secondBackgroundGroup.position.z = 3;

world2.add(secondBackgroundGroup);

// const background = gui.addFolder("background");
gui.add(backgroundGroup.position, "x", -10, 10, 0.01).name("backgroundGroupX");
gui.add(backgroundGroup.position, "y", -10, 10, 0.01).name("backgroundGroupY");
gui.add(backgroundGroup.position, "z", -10, 10, 0.01).name("backgroundGroupZ");

gui.addColor(debugObject, "wallColor").onChange((value) => {
  backgroundGroup.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.color.set(debugObject.wallColor);
    }
  });
});

/**
 * Lights 1
 */

// const lights = gui.addFolder("Lights");
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

debugObject.directionalLightColor = "#f4cc7f";

const directionalLight = new THREE.DirectionalLight(
  debugObject.directionalLightColor,
  1.8
);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
directionalLight.shadow.bias = -0.015;
scene.add(directionalLight);

gui.add(directionalLight.position, "x", 0, 10, 0.01).name("directionnalLightX");
gui.add(directionalLight.position, "y", 0, 10, 0.01).name("directionnalLightY");
gui.add(directionalLight.position, "z", 0, 10, 0.01).name("directionnalLightZ");

gui.addColor(debugObject, "directionalLightColor").onChange((value) => {
  directionalLight.color.set(debugObject.directionalLightColor);
});

//SpotLight

debugObject.spotLightColor = "#ffa200";
const spotLight = new THREE.SpotLight(
  debugObject.spotLightColor,
  10.5,
  10,
  Math.PI * 0.2,
  0.25,
  0.5
);
spotLight.position.y = 8;
spotLight.position.z = 5.5;
spotLight.castShadow = true;
spotLight.shadow.bias = -0.005;

spotLight.target.position.set(0, 1.5, 3);
scene.add(spotLight.target);

scene.add(spotLight);

gui.add(spotLight.position, "x", 0, 10, 0.01).name("spotLightX");
gui.add(spotLight.position, "y", 0, 10, 0.01).name("spotLightY");
gui.add(spotLight.position, "z", 0, 10, 0.01).name("spotLightZ");
gui.addColor(debugObject, "spotLightColor").onChange((value) => {
  spotLight.color.set(debugObject.spotLightColor);
});

//PointsLight
debugObject.pointLight1Color = "#e5cc2a";
debugObject.pointLight2Color = "#ff0033";
const pointLight1 = new THREE.PointLight(
  debugObject.pointLight1Color,
  3.5,
  3,
  3
);
pointLight1.position.y = 1;
pointLight1.position.z = 3.7;
pointLight1.position.x = 1;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(
  debugObject.pointLight2Color,
  3.5,
  3,
  3
);
pointLight2.position.y = 2.5;
pointLight2.position.z = 4;
pointLight2.position.x = -1;
scene.add(pointLight2);

const pointLight1Helper = new THREE.PointLightHelper(pointLight1);
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);
// scene.add(pointLight1Helper, pointLightHelper2);

gui.add(pointLight1.position, "x", 0, 10, 0.01).name("pointLight1X");
gui.add(pointLight1.position, "y", 0, 10, 0.01).name("pointLight1Y");
gui.add(pointLight1.position, "z", 0, 10, 0.01).name("pointLight1Z");
gui.addColor(debugObject, "pointLight1Color").onChange((value) => {
  pointLight1.color.set(debugObject.pointLight1Color);
});

gui.add(pointLight2.position, "x", 0, 10, 0.01).name("pointLight2X");
gui.add(pointLight2.position, "y", 0, 10, 0.01).name("pointLight2Y");
gui.add(pointLight2.position, "z", 0, 10, 0.01).name("pointLight2Z");
gui.addColor(debugObject, "pointLight2Color").onChange((value) => {
  pointLight2.color.set(debugObject.pointLight2Color);
});

/**
 * Worlds
 */

// world1.rotation.z = Math.PI;
// world2.rotation.z = Math.PI;

finalScene.add(world1, world2);
// finalScene.position.y = 1;
scene.add(finalScene);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(
  sizes.width * sizes.pixelRatio,
  sizes.height * sizes.pixelRatio
);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});
/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group();

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 10.3, 3.5);

enterExperience.addEventListener("click", () => {
  gsap.to(camera.position, {
    x: 0,
    y: 3.3,
    z: 7.5,
    delay: 0.5,
    onComplete: createRandomFirework,
  });
});

cameraGroup.add(camera);
scene.add(cameraGroup);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ReinhardToneMapping;

/**
 * Post processing
 */

const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);
/**
 * Animate
 */

const moveSceneRight = () => {
  gsap.to(finalScene.rotation, {
    z: finalScene.rotation.z - Math.PI,
    duration: 2,
    ease: "power3.inOut",
  });
  glitchPass.enabled = true;

  // uniformsOfParticles.startTime.value = Date.now();
  if (particles !== null) {
    particles.geometry.dispose();
    particles.material.dispose();
    scene.remove(particles);
  }

  setTimeout(() => {
    glitchPass.enabled = false;
    createRandomFirework();
  }, 1600);
};

const moveSceneLeft = () => {
  gsap.to(finalScene.rotation, {
    z: finalScene.rotation.z + Math.PI,
    duration: 2,
    ease: "power3.inOut",
  });
  glitchPass.enabled = true;
  // uniformsOfParticles.startTime.value = Date.now();

  if (particles !== null) {
    particles.geometry.dispose();
    particles.material.dispose();
    scene.remove(particles);
  }
  setTimeout(() => {
    glitchPass.enabled = false;
    createRandomFirework();
  }, 1600);
};

nextButton.addEventListener("click", () => {
  moveSceneRight();
});
prevButton.addEventListener("click", () => {
  moveSceneLeft();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    moveSceneRight();
  } else if (e.key === "ArrowLeft") {
    moveSceneLeft();
  }
});

const cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});
//is number even(pair)
const isEven = (number) => {
  return number % 2 === 0;
};

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    mixer.update(deltaTime);
  }
  if (phone) {
    phone.rotation.y += deltaTime * 0.8;
  }
  if (paint) {
    paint.rotation.y += deltaTime * 0.3;
    paint.rotation.x += deltaTime * 0.2;
  }
  if (isEven(Math.floor(elapsedTime * 2))) {
    pointLight2.intensity = 0;
  } else {
    pointLight2.intensity = 4;
  }
  // finalScene.rotation.z = Math.PI * (elapsedTime * 0.1);

  //Animate Camera

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
  // Update controls
  controls.update();

  // uniformsOfParticles.uTime.value = elapsedTime;

  // console.log("date now", Date.now(), "uTime", elapsedTime);
  // console.log(elapsedTime - Date.now());

  // Render
  // renderer.render(scene, camera);
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
