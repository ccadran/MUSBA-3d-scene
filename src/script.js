import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper);

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

let mixer = null;

let model;

gltfLoader.load("/models/phone.glb", (gltf) => {
  model = gltf.scene;
  model.scale.set(0.2, 0.2, 0.2);
  model.position.y = 1.5;
  model.position.z = 3;
  model.rotation.y = Math.PI * 1.35;

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
  console.log(model.position);
  tick();

  //   updateAllMaterials();
});

/**
 * Floor
 */

/**
 * Background 1
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

scene.add(backgroundGroup);

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

scene.add(secondBackgroundGroup);

const background = gui.addFolder("background");
background
  .add(backgroundGroup.position, "x", -10, 10, 0.1)
  .name("backgroundGroupX");
background
  .add(backgroundGroup.position, "y", -10, 10, 0.1)
  .name("backgroundGroupY");
background
  .add(backgroundGroup.position, "z", -10, 10, 0.1)
  .name("backgroundGroupZ");

background.addColor(debugObject, "wallColor").onChange((value) => {
  backgroundGroup.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.color.set(debugObject.wallColor);
    }
  });
});

/**
 * Lights
 */

const lights = gui.addFolder("Lights");
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

debugObject.directionalLightColor = "#f4cc7f";

const directionalLight = new THREE.DirectionalLight(
  debugObject.directionalLightColor,
  1.8
);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

lights
  .add(directionalLight.position, "x", 0, 10, 0.1)
  .name("directionnalLightX");
lights
  .add(directionalLight.position, "y", 0, 10, 0.1)
  .name("directionnalLightY");
lights
  .add(directionalLight.position, "z", 0, 10, 0.1)
  .name("directionnalLightZ");

lights.addColor(debugObject, "directionalLightColor").onChange((value) => {
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

spotLight.target.position.set(0, 1.5, 3);
scene.add(spotLight.target);

scene.add(spotLight);

// Helper;
const helper = new THREE.SpotLightHelper(spotLight);
scene.add(helper);

lights.add(spotLight.position, "x", 0, 10, 0.1).name("spotLightX");
lights.add(spotLight.position, "y", 0, 10, 0.1).name("spotLightY");
lights.add(spotLight.position, "z", 0, 10, 0.1).name("spotLightZ");
lights.addColor(debugObject, "spotLightColor").onChange((value) => {
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
scene.add(pointLight1Helper, pointLightHelper2);

lights.add(pointLight1.position, "x", 0, 10, 0.1).name("pointLight1X");
lights.add(pointLight1.position, "y", 0, 10, 0.1).name("pointLight1Y");
lights.add(pointLight1.position, "z", 0, 10, 0.1).name("pointLight1Z");
lights.addColor(debugObject, "pointLight1Color").onChange((value) => {
  pointLight1.color.set(debugObject.pointLight1Color);
});
lights.add(pointLight2.position, "x", 0, 10, 0.1).name("pointLight2X");
lights.add(pointLight2.position, "y", 0, 10, 0.1).name("pointLight2Y");
lights.add(pointLight2.position, "z", 0, 10, 0.1).name("pointLight2Z");
lights.addColor(debugObject, "pointLight2Color").onChange((value) => {
  pointLight2.color.set(debugObject.pointLight2Color);
});
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 3.3, 7.5);
gui.add(camera.position, "x", -20, 20, 0.1).name("cameraPositionX");
gui.add(camera.position, "y", -20, 20, 0.1).name("cameraPositionY");
gui.add(camera.position, "z", -20, 20, 0.1).name("cameraPositionZ");
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

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

  model.rotation.y += deltaTime * 0.8;
  if (isEven(Math.floor(elapsedTime * 2))) {
    pointLight2.intensity = 0;
  } else {
    pointLight2.intensity = 4;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
