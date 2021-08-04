import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { CubeTextureLoader, Geometry, Material, NearestFilter } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { GeometryUtils } from "three";
import * as dat from "dat.gui";

import metalTestTexture from "../textures/MetalFloor/color.jpg";
import colorTexture from "../textures/door/color.jpg";
import alphaTexture from "../textures/door/alpha.jpg";
import heightTexture from "../textures/door/height.jpg";
import normalTexture from "../textures/door/normal.jpg";
import ambientOcclusionTexture from "../textures/door/ambientOcclusion.jpg";
import metalnessTexture from "../textures/door/metalness.jpg";
import roughnessTexture from "../textures/door/roughness.jpg";
import matcapTexture from "../textures/matcaps/3.png";
import gradientTexture from "../textures/gradients/5.jpg";

import env1 from "../textures/environmentMaps/4/px.png"; // positive X
import env3 from "../textures/environmentMaps/4/py.png"; // positive Y
import env2 from "../textures/environmentMaps/4/nx.png"; // negative X
import env4 from "../textures/environmentMaps/4/ny.png"; // negative Y
import env5 from "../textures/environmentMaps/4/pz.png"; // positive Z
import env6 from "../textures/environmentMaps/4/nz.png"; // negative Z

export default function Lesson12() {
  const box = useRef(null);

  useEffect(() => {
    let cursor = {
      x: 0,
      y: 0,
    };
    window.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX / window.innerWidth - 0.5;
      cursor.y = -(e.clientY / window.innerHeight - 0.5);
    });

    let renderer, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, //45 or 75 is the most popular
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.z = 3;

    let aspectRatio = window.innerWidth / window.innerHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    box.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, box.current);
    controls.enableDamping = true;
    const handleResize = () => {
      aspectRatio = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // jeśli użytkownik przeniesie na inny ekran również zmieniamy pixelRatio

      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    };

    //texture load
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const texture1 = textureLoader.load(colorTexture);
    const texture2 = textureLoader.load(alphaTexture);
    const texture3 = textureLoader.load(ambientOcclusionTexture);
    const texture4 = textureLoader.load(metalnessTexture);
    const texture5 = textureLoader.load(roughnessTexture);
    const texture6 = textureLoader.load(normalTexture);
    const texture7 = textureLoader.load(heightTexture);
    const texture8 = textureLoader.load(matcapTexture);
    const texture9 = textureLoader.load(gradientTexture);

    //enviroment map laod
    const enviromentTextures = new THREE.CubeTextureLoader().load([
      env1,
      env2,
      env3,
      env4,
      env5,
      env6,
    ]);
    //Content

    //Basic
    // const mainMaterial = new THREE.MeshBasicMaterial({
    //   //default texture
    //   //   map: texture1,
    //   //   color: 0x00ff00,
    //   //   wireframe: false,
    //   //   transparent: true,
    //   //   opacity: 0.5,

    //   //transparent texture cool effect
    //   //możemy uzyskać np. same drzwi
    //   map: texture1,
    //   alphaMap: texture2,
    //   transparent: true,
    // });
    // //widoczność ścian (face); przydatne do np. plane
    // // mainMaterial.side = THREE.FrontSide;
    // // mainMaterial.side = THREE.BackSide; //w przypadku bryl widzimy ich wnetrze
    // mainMaterial.side = THREE.DoubleSide;

    //Normal
    // const mainMaterial = new THREE.MeshNormalMaterial();
    // mainMaterial.wireframe = true;
    // mainMaterial.flatShading = true;

    //MatcapMaterial
    // const mainMaterial = new THREE.MeshMatcapMaterial();
    // mainMaterial.matcap = texture8;

    //Depth Material npm do mgły
    // const mainMaterial = new THREE.MeshDepthMaterial();

    //Lambert material
    // const mainMaterial = new THREE.MeshLambertMaterial();

    //Phong material
    // const mainMaterial = new THREE.MeshPhongMaterial();
    // mainMaterial.shininess = 100;
    // mainMaterial.specular = new THREE.Color(0x00ff00);

    //Toon material
    // const mainMaterial = new THREE.MeshToonMaterial();
    // mainMaterial.gradientMap = texture9;
    // //aby nie stracić kartonowego efektu
    // texture9.generateMipmaps = false;
    // texture9.minFilter = THREE.NearestFilter;
    // texture9.magFilter = THREE.NearestFilter;

    //Standard material
    const mainMaterial = new THREE.MeshStandardMaterial();
    // mainMaterial.metalness = 0.45;
    // mainMaterial.roughness = 0.45; jesli używamy tekstu z metalem i roughness trzeba to wyłączyć aby było ok
    mainMaterial.map = texture1;
    mainMaterial.aoMap = texture3; //dodajemy teksture zawierającą cienie i uzyskujemy bardzo ciekawy efekt
    mainMaterial.aoMapIntensity = 1;
    mainMaterial.displacementMap = texture7;
    mainMaterial.displacementScale = 0.1;
    mainMaterial.metalnessMap = texture4;
    mainMaterial.roughnessMap = texture5;
    mainMaterial.normalMap = texture6;
    mainMaterial.normalScale.set(0.5, 0.5);
    mainMaterial.transparent = true;
    mainMaterial.alphaMap = texture2;

    // const mainMaterial = new THREE.MeshStandardMaterial();
    // mainMaterial.metalness = 0.7;
    // mainMaterial.roughness = 0.2;
    // mainMaterial.envMap = enviromentTextures;

    //debug panel

    const gui = new dat.GUI();
    gui.add(mainMaterial, "metalness").min(0).max(1).step(0.0001);
    gui.add(mainMaterial, "roughness").min(0).max(1).step(0.0001);
    gui.add(mainMaterial, "aoMapIntensity").min(0).max(5).step(0.0001);
    gui.add(mainMaterial, "displacementScale").min(0).max(1).step(0.0001);

    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      mainMaterial
    );

    //potrzebujemy skopiować koordynaty UV aby zadziałała teksture ambientColor
    cube.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(cube.geometry.attributes.uv.array, 2)
    );

    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 64, 64),
      mainMaterial
    );
    sphere.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );

    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
      mainMaterial
    );
    torus.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    );

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 100, 100),
      mainMaterial
    );
    plane.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );

    cube.position.x = -3;
    sphere.position.x = -1;
    torus.position.x = 3;
    plane.position.x = 0;
    scene.add(cube, sphere, torus, plane);

    //Light
    const AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(AmbientLight);
    const PointLight = new THREE.PointLight(0xffffff, 0.5);
    PointLight.position.x = 2;
    PointLight.position.y = 3;
    PointLight.position.z = 4;
    scene.add(PointLight);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      controls.update();

      cube.rotation.y = elapsedTime * 0.1;
      sphere.rotation.y = elapsedTime * 0.1;
      torus.rotation.y = elapsedTime * 0.1;
      plane.rotation.y = elapsedTime * 0.1;

      cube.rotation.x = elapsedTime * 0.1;
      sphere.rotation.x = elapsedTime * 0.1;
      torus.rotation.x = elapsedTime * 0.1;
      plane.rotation.x = elapsedTime * 0.1;
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("resize", handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
