import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import vertexWater from "./shaders/water/vertex.glsl";
import fragmentWater from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(2, 2, 256, 256);

const debugObject = {
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
};
// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexWater,
  fragmentShader: fragmentWater,
  uniforms: {
    uTime: { value: 0 },
    seaSpeed: { value: 1 },
    uBigWavesElevations: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    colorOffset: { value: 0.08 },
    colorMultiplier: { value: 5 },
    uMicroWaveIterations: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
  },
});

gui
  .add(waterMaterial.uniforms.uBigWavesElevations, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevations");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uBigWavesFrequency X");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uBigWavesFrequency Y");
gui
  .add(waterMaterial.uniforms.seaSpeed, "value")
  .min(0)
  .max(3)
  .step(0.01)
  .name("Sea speed");

gui
  .addColor(debugObject, "depthColor")
  .name("Depth color")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });
gui
  .addColor(debugObject, "surfaceColor")
  .name("Surface color")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });

gui
  .add(waterMaterial.uniforms.colorOffset, "value")
  .min(0)
  .max(3)
  .step(0.01)
  .name("Color offset");

gui
  .add(waterMaterial.uniforms.colorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("Color multiplier");

gui
  .add(waterMaterial.uniforms.uMicroWaveIterations, "value")
  .min(1)
  .max(30)
  .step(1)
  .name("microWaveIterations");

gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(30)
  .step(0.01)
  .name("uSmallWavesSpeed");

gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(1)
  .max(10)
  .step(1)
  .name(" uSmallWavesFrequency");

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uSmallWavesElevation");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  waterMaterial.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
