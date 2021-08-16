// https://discoverthreejs.com/
// Dobre źródło wiedzy

// Uruchamiamy przeglądarkę bez limitu fps aby nie było aż tak wielkiej potrzeby testowania na różnych urządzeniach

// Spector.js

// Dobry kod JS - w szczególności w tick function poniważ wykonuje się ona aż 60 razy na sekundę

// Usuwamy obiekty gdy nie będą już używane https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
// obiekt.remove()
// obiekt.geometry.dispose();
// obiekt.material.dispose();

// Staramy się unikać świateł chyba, że to naprawdę konieczne. W sceneriach które tego nie wymagają możemy je poprostu wypikać (backing technics). Jeśli musimy już używać świateł to AmbientLight, HemisphereLight, DirectionalLight (najmniej kosztowne).

// Unikamy dodawania i usuwania świateł

// Unikamy cieni jeśli to możliwe możemy je wypiekać

// Optymulizajemy cienie: shadowmap(mapSize), camera(przy użyciu cameraHelper)

// używajmy reciveShadow i castShadow mądrze tj. kiedy obiekt nie otrzymuje żadnych cieni nie dodawajmy reciveShadow itd.

// Kiedy scena nie zmienia swojego oświetlenia i cieni tj. nie ma żadnych obiektów poruszających się rzucających cień możemy wyłączyć updateowanie cieni przez renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true;(aby pojawił się na początku)
// nawet jeśli mamy np. samochodzik który ma wypiekany cień i tak możemy to wyłączyć

// Staramy się zmniejszyć rozdzielczość tekstur na ile to możliwe
// Rozdzielczość jako potęga liczby 2

// Jeśli tekstura nie wymaga przezroczystości używamy jpg bo jest mniejszy; możemy użyć basis format który psuje jakość mocno ale jest bardzo wydajny

// Kompresujemy pliki tekstur na ile to możliwe

// Używamy draco compression

// Używamy BufferGeometry

// Nie zmieniamy vertexów na geometriach

// Nie tworzymy geometri w pętlach tylko poza nią; to samo z materiałem

// Mergujemy geomertrie przy użyciu BufferGeometryUtils - przykład na githubie lekcja 30 - przykład 18; pozwala to obniżyć rendery ogromnie; przydatne do np generowania dużej ilości takich samych obiektów;

// Używamy tanich materiałów kiedy możemy np. Basic, Lambert czy Phong

// Jeśli checmy renderować wiele takich samych obiektów z wyjeciem materiału i geometri poza pętle nie możemy sterować każdą z osobna chyba że użyjemy InstancedMesh co jest ok; przykład 22
// Dodajemy też to do obiektu mesh -
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); //informujemy, że ten obiekt będzie zmieniany

// Konfigurejmy gzip na serwerze aby działał dla plików z obiektami 3d jak .glb itd.
// jest to kompresowanie plików aby były lżejsze i odpakowywanie je u klienta)

// Możemy zredukować fov ale zmieni to wydajność jedynie o tyle o ile mniej obiektów trzeba wyrenderować

// Regulujemy near and far kamery

// Używajmy pixelRatio z limitem do 2 - Math.min(window.devicePixelRation, 2)

// Możemy użyż w parametrach renderer  powerPreference: 'high-performance'

// Kiedy pixelRatio jest powyżej 2 możemy pozbyć się antialiasingu ale to zależy już od modeli trzeba ocenić na bieżąco

// Używajmy jak najmniej passów(efektów na ekranie) jak to możliwe lub poprostu scalajmy je w jedno

// SHADERY

// W własnych shaderach kiedy to możliwe używajmy precision: 'lowp'

// W shaderach nie używajmy ifów a zastępujmy to funkcjami matematycznymi o ile to możliwe np.

// elevation = clamp(elevation, 0.5, 1.0); //używamy tego zamiast ifa będzie to samo a uzyskamy lepszą wydajność

// f(elevation < 0.5)
//  {
//    elevation = 0.5;
//  }

// Kiedy chcemy wygenrować np. góry czy chmury zamiast używaż pering noise możemy użyć tekstury będzie to dużo lepsze dla wydajności

// Dla stałych używajmy define
// Define możemy dostarczyć już w threejs jako parametr tak samo jak uniforms - nie zmieniamy ich w js ani w ogóle jest to bardzo złe dla wydajności

// Jeśli to możliwe obliczenia wykonujmy w vertexShader a wynik przesyłajmy w postaci varying chodź możemy przy tym stracić trochę detali

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import Stats from "stats.js";
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const displacementTexture = textureLoader.load("/textures/displacementMap.png");

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
camera.position.set(2, 2, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  powerPreference: "high-performance",
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;

/**
 * Test meshes
 */
const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial()
);
cube.castShadow = true;
cube.receiveShadow = false;
cube.position.set(-5, 0, 0);
// scene.add(cube);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotBufferGeometry(1, 0.4, 128, 32),
  new THREE.MeshStandardMaterial()
);
torusKnot.castShadow = true;
torusKnot.receiveShadow = false;
// scene.add(torusKnot);

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial()
);
sphere.position.set(5, 0, 0);
sphere.castShadow = true;
sphere.receiveShadow = false;
// scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  new THREE.MeshStandardMaterial()
);
floor.position.set(0, -2, 0);
floor.rotation.x = -Math.PI * 0.5;
floor.castShadow = true;
floor.receiveShadow = true;
// scene.add(floor);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, 2.25);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const tick = () => {
  stats.begin();
  const elapsedTime = clock.getElapsedTime();

  // Update test mesh
  torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();

/**
 * Tips
 */

// // Tip 4
console.log(renderer.info);

// // Tip 6
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// // Tip 10
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.left = - 6
// directionalLight.shadow.camera.bottom = - 3
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.mapSize.set(1024, 1024)

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// // Tip 11
// cube.castShadow = true
// cube.receiveShadow = false

// torusKnot.castShadow = true
// torusKnot.receiveShadow = false

// sphere.castShadow = true
// sphere.receiveShadow = false

// floor.castShadow = false
// floor.receiveShadow = true

// // Tip 12
// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// // Tip 18
// const geometries = [];
// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);

//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );

//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);
//   geometries.push(geometry);
// }

// const mergedGeomtry = BufferGeometryUtils.mergeBufferGeometries(geometries);
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh(mergedGeomtry, material);

// scene.add(mesh);

// // Tip 19
// const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);

// const material = new THREE.MeshNormalMaterial();

// for (let i = 0; i < 50; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

// // Tip 20
// const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5)

// for(let i = 0; i < 50; i++)
// {
//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 22
// const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);

// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.InstancedMesh(geometry, material, 50);
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
// scene.add(mesh);

// for (let i = 0; i < 50; i++) {
//   const position = new THREE.Vector3(
//     (Math.random() - 0.5) * Math.PI * 2,
//     (Math.random() - 0.5) * Math.PI * 2,
//     0
//   );
//   const quaternion = new THREE.Quaternion();
//   quaternion.setFromEuler(
//     new THREE.Euler(
//       (Math.random() - 0.5) * Math.PI * 2,
//       (Math.random() - 0.5) * Math.PI * 2,
//       0
//     )
//   );

//   //Tworzymy matrycje
//   const matrix = new THREE.Matrix4();
//   matrix.makeRotationFromQuaternion(quaternion);
//   matrix.setPosition(position);

//   mesh.setMatrixAt(i, matrix);
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.x = (Math.random() - 0.5) * 10;
// mesh.position.y = (Math.random() - 0.5) * 10;
// mesh.position.z = (Math.random() - 0.5) * 10;
// mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
// mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
// }

// // Tip 29
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// // Tip 31, 32, 34 and 35
const shaderGeometry = new THREE.PlaneBufferGeometry(10, 10, 256, 256);

const shaderMaterial = new THREE.ShaderMaterial({
  precision: "lowp",
  defines: {
    DISPLACMENT_STRENGTH: 1.5,
  },
  uniforms: {
    uDisplacementTexture: { value: displacementTexture },
    uDisplacementStrength: { value: 1.5 },
  },
  vertexShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec3 finalColor;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
           elevation = clamp(elevation, 0.5, 1.0); //używamy tego zamiast ifa będzie to samo a uzyskamy lepszą wydajność
           
            // if(elevation < 0.5)
            // {
            //     elevation = 0.5;
            // }

            modelPosition.y += elevation * DISPLACMENT_STRENGTH;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

        

            //color calc

            float elevationColor = texture2D(uDisplacementTexture, uv).r;
            elevationColor = max(elevation, 0.25); //ograniczamy do 0.25
            // if(elevationColor < 0.25)
            // {
            //     elevationColor = 0.25;
            // }

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            // vec3 finalColor = vec3(0.0);
            // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevationColor;
            // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevationColor;
            // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevationColor;
             finalColor = mix(depthColor, surfaceColor, elevationColor); //zamiast tego co powyżej
        }
    `,
  fragmentShader: `
        varying vec3 finalColor;

        void main()
        {

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);
