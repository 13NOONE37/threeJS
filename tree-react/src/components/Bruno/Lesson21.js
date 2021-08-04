import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Color, Geometry, MeshBasicMaterial, PointsMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import gsap from "gsap";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";

import texturePx from "../textures/environmentMaps2/0/px.png";
import textureNx from "../textures/environmentMaps2/0/nx.png";
import texturePy from "../textures/environmentMaps2/0/py.png";
import textureNy from "../textures/environmentMaps2/0/ny.png";
import texturePz from "../textures/environmentMaps2/0/pz.png";
import textureNz from "../textures/environmentMaps2/0/nz.png";

import sound1 from "../textures/hit.mp3";

export default function Lesson8() {
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
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let aspectRatio = window.innerWidth / window.innerHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    box.current.appendChild(renderer.domElement);

    const handleResize = () => {
      aspectRatio = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // jeśli użytkownik przeniesie na inny ekran również zmieniamy pixelRatio

      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    };
    const controls = new OrbitControls(camera, box.current);
    controls.enableDamping = true;

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    //Models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/"); //workery skopiowane do public

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let mixer = null;
    gltfLoader.load(
      "./models/Fox/glTF/Fox.gltf",
      // './models/FlightHelmet/glTF/FlightHelmet.gltf',
      // './models/Fox/glTF/Fox.gltf',
      (model) => {
        console.log(model);
        console.log("success");
        mixer = new THREE.AnimationMixer(model.scene);

        const action = mixer.clipAction(model.animations[2]);
        const action2 = mixer.clipAction(model.animations[0]);
        action.play();
        action2.play();

        model.scene.scale.set(0.025, 0.025, 0.025);
        // while (model.scene.children.length) {
        //   scene.add(model.scene.children[0]);
        // }
        scene.add(model.scene);
      },
      () => {
        console.log("progress");
      },
      (error) => {
        console.log("error", error);
      }
    );

    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.61);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    /**
     * Debug
     */
    const gui = new dat.GUI();
    const debugObject = {};

    //Animation
    const clock = new THREE.Clock();

    let previousTime = 0;
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      //Update controls
      controls.update();

      //Update mixer
      mixer && mixer.update(deltaTime);

      //Render
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("resize", handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
