import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import gsap from "gsap";
import { DoubleSide, PointLight, SpotLightHelper } from "three";
import * as dat from "dat.gui";

import grass1 from "../textures/house/grass/ambientOcclusion.jpg";
import grass2 from "../textures/house/grass/color.jpg";
import grass3 from "../textures/house/grass/normal.jpg";
import grass4 from "../textures/house/grass/roughness.jpg";

import brick1 from "../textures/house/bricks/ambientOcclusion.jpg";
import brick2 from "../textures/house/bricks/color.jpg";
import brick3 from "../textures/house/bricks/normal.jpg";
import brick4 from "../textures/house/bricks/roughness.jpg";

import door1 from "../textures/house/door/ambientOcclusion.jpg";
import door2 from "../textures/house/door/color.jpg";
import door3 from "../textures/house/door/normal.jpg";
import door4 from "../textures/house/door/roughness.jpg";
import door5 from "../textures/house/door/alpha.jpg";
import door6 from "../textures/house/door/height.jpg";
import door7 from "../textures/house/door/metalness.jpg";

import lamp1 from "../textures/MetalFloor/ambientOcclusion.jpg";
import lamp2 from "../textures/MetalFloor/color.jpg";
import lamp3 from "../textures/MetalFloor/normal.jpg";
import lamp4 from "../textures/MetalFloor/roughness.jpg";
import lamp5 from "../textures/MetalFloor/height.png";
import lamp6 from "../textures/MetalFloor/metallic.jpg";

import ghastModel from "../textures/minecraft-ghast/source/ghast.obj";
import ghastTexture from "../textures/minecraft-ghast/textures/ghast.png";

export default function Lesson8() {
  const box = useRef(null);

  useEffect(() => {
    let cursor = {
      x: 0,
      y: 0,
    };
    let renderer, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, //45 or 75 is the most popular
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.z = 18;
    camera.position.y = 9;

    let aspectRatio = window.innerWidth / window.innerHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor("#262837");

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    box.current.appendChild(renderer.domElement);

    const handleResize = () => {
      aspectRatio = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // jeśli użytkownik przeniesie na inny ekran również zmieniamy pixelRatio
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    };

    const controls = new OrbitControls(camera, box.current);
    controls.minDistance = 4;
    controls.maxDistance = 35;
    controls.enableDamping = true;

    //models
    const modelLoader = new THREE.ObjectLoader();
    const ghost = modelLoader.load(ghastModel);
    console.log(ghost);

    //Textures
    const loaderManager = new THREE.LoadingManager();
    loaderManager.onStart = () => {
      console.log("start");
    };
    loaderManager.onProgress = () => {
      console.log("loading...");
    };
    loaderManager.onLoad = () => {
      console.log("loaded");
    };
    loaderManager.onError = () => {
      console.log("something went wrong");
    };
    const textureLoader = new THREE.TextureLoader(loaderManager);

    const grassAmbient = textureLoader.load(grass1);
    const grassColor = textureLoader.load(grass2);
    const grassNormal = textureLoader.load(grass3);
    const grassRough = textureLoader.load(grass4);

    grassAmbient.repeat.set(8, 8);
    grassColor.repeat.set(8, 8);
    grassNormal.repeat.set(8, 8);
    grassRough.repeat.set(8, 8);

    grassAmbient.wrapS = THREE.RepeatWrapping;
    grassAmbient.wrapT = THREE.RepeatWrapping;

    grassColor.wrapS = THREE.RepeatWrapping;
    grassColor.wrapT = THREE.RepeatWrapping;

    grassNormal.wrapS = THREE.RepeatWrapping;
    grassNormal.wrapT = THREE.RepeatWrapping;

    grassRough.wrapS = THREE.RepeatWrapping;
    grassRough.wrapT = THREE.RepeatWrapping;

    const brickAmbient = textureLoader.load(brick1);
    const brickColor = textureLoader.load(brick2);
    const brickNormal = textureLoader.load(brick3);
    const brickRough = textureLoader.load(brick4);

    const doorAmbient = textureLoader.load(door1);
    const doorColor = textureLoader.load(door2);
    const doorNormal = textureLoader.load(door3);
    const doorRough = textureLoader.load(door4);
    const doorAlpha = textureLoader.load(door5);
    const doorHeight = textureLoader.load(door6);
    const doorMetalness = textureLoader.load(door7);

    const lampAmbient = textureLoader.load(lamp1);
    const lampColor = textureLoader.load(lamp2);
    const lampNormal = textureLoader.load(lamp3);
    const lampRough = textureLoader.load(lamp4);
    const lampHeight = textureLoader.load(lamp5);
    const lampMetalness = textureLoader.load(lamp6);
    //Config
    const moonColor = new THREE.Color("hsl(235, 51%, 40%)");

    //Lights
    const ambientLight = new THREE.AmbientLight(moonColor, 0.2); //TODO zmienić na 0.1
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(moonColor, 0.7);
    pointLight.position.set(8, 10, 8);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 256;
    pointLight.shadow.mapSize.height = 256;
    pointLight.shadow.camera.far = 7;

    scene.add(pointLight);
    //shadows

    //shapes

    //grass
    const grassGroup = new THREE.Group();

    const planeGeometry = new THREE.PlaneBufferGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({
      aoMap: grassAmbient,
      normalMap: grassNormal,
      roughnessMap: grassRough,
      map: grassColor,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -Math.PI * 0.5;
    plane.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );
    grassGroup.add(plane);

    //fog
    scene.fog = new THREE.Fog(0xefd1b5, 1, 45);

    //graves
    const gravesGrup = new THREE.Group();

    const graveGeometry = new THREE.BoxBufferGeometry(0.5, 0.6, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3.2 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.castShadow = true;
      grave.position.set(x, 0.3, z);
      grave.rotation.z = z;
      gravesGrup.add(grave);
    }
    grassGroup.add(gravesGrup);

    //ghosts

    scene.add(grassGroup);
    //house
    const houseGroup = new THREE.Group();

    //walls
    const houseWallsGeometry = new THREE.BoxBufferGeometry(5, 3, 5);
    const houseWallsMaterial = new THREE.MeshStandardMaterial({
      aoMap: brickAmbient,
      normalMap: brickNormal,
      roughnessMap: brickRough,
      map: brickColor,
    });
    const houseWalls = new THREE.Mesh(houseWallsGeometry, houseWallsMaterial);
    houseWalls.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        houseWalls.geometry.attributes.uv.array,
        2
      )
    );
    houseWalls.castShadow = true;
    houseWalls.position.y += 1.5;
    houseGroup.add(houseWalls);

    //door
    const doorGeometry = new THREE.PlaneBufferGeometry(1.5, 2, 50, 50);
    const doorMaterial = new THREE.MeshStandardMaterial({
      map: doorColor,
      aoMap: doorAmbient,
      displacementMap: doorHeight,
      displacementScale: 0.1,
      metalnessMap: doorMetalness,
      roughnessMap: doorRough,
      normalMap: doorNormal,
      transparent: true,
      alphaMap: doorAlpha,
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
    );
    door.position.set(0, 1, 2.5);
    houseGroup.add(door);
    //roof
    const roofGeometry = new THREE.ConeBufferGeometry(4.25, 2, 4);

    const roofMaterial = new THREE.MeshStandardMaterial({
      aoMap: brickAmbient,
      normalMap: brickNormal,
      roughnessMap: brickRough,
      map: brickColor,
      aoMapIntensity: 1.6,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    // roof.castShadow = true;

    roof.position.y = 4;
    roof.rotation.y = Math.PI * 0.25;
    houseGroup.add(roof);

    //house lamp
    const houseLight = new THREE.PointLight(0x00ffff, 1, 7);
    houseLight.position.set(0, 3, 3);
    houseLight.castShadow = true;
    houseGroup.add(houseLight);
    // scene.add(new THREE.PointLightHelper(houseLight));

    scene.add(houseGroup);

    //ghosts
    const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
    const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
    const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
    ghost1.castShadow = true;
    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 7;

    ghost2.castShadow = true;
    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 7;

    ghost3.castShadow = true;
    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 7;

    scene.add(ghost1, ghost2, ghost3);

    //control
    const gui = new dat.GUI();
    gui.add(doorMaterial, "metalness").min(0).max(1).step(0.0001);
    gui.add(doorMaterial, "roughness").min(0).max(1).step(0.0001);
    gui.add(doorMaterial, "aoMapIntensity").min(0).max(5).step(0.0001);
    gui.add(doorMaterial, "displacementScale").min(0).max(1).step(0.0001);

    gui.add(pointLight.position, "x").min(0).max(10).step(0.0001);
    gui.add(pointLight.position, "y").min(0).max(10).step(0.0001);
    gui.add(pointLight.position, "z").min(0).max(10).step(0.0001);

    //Loop
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();

      const ghost1Angle = elapsedTime * 0.5;

      ghost1.position.x = Math.sin(ghost1Angle) * 4;
      ghost1.position.z = Math.cos(ghost1Angle) * 4;
      ghost1.position.y =
        Math.cos(elapsedTime * 3) + Math.cos(elapsedTime * 0.5);

      const ghost2Angle = -elapsedTime * 0.3;

      ghost2.position.x =
        Math.sin(ghost2Angle) * (7 + Math.sin(elapsedTime * 0.32));
      ghost2.position.z =
        Math.cos(ghost2Angle) * (7 + Math.sin(elapsedTime * 0.5));
      ghost2.position.y =
        Math.cos(elapsedTime * 4) + Math.cos(elapsedTime * 1.5);

      const ghost3Angle = elapsedTime * 0.4;

      ghost3.position.x = Math.sin(ghost3Angle) * 5;
      ghost3.position.z = Math.cos(ghost3Angle) * 5;
      ghost3.position.y =
        Math.cos(elapsedTime * 5) + Math.cos(elapsedTime * 2.5);

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("resize", handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
