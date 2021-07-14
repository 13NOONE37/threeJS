import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import gsap from 'gsap';
import { DoubleSide, PointLight, SpotLightHelper } from 'three';
import * as dat from 'dat.gui';
import { dir } from 'async';

import texture1 from '../textures/simpleShadow.jpg';

export default function Lesson8() {
  const box = useRef(null);

  useEffect(() => {
    let cursor = {
      x: 0,
      y: 0,
    };
    let rerender, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, //45 or 75 is the most popular
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    );
    camera.position.z = 8;
    camera.position.y = 2;

    let aspectRatio = window.innerWidth / window.innerHeight;
    rerender = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rerender.shadowMap.enabled = false;
    rerender.shadowMap.type = THREE.PCFSoftShadowMap;

    rerender.setSize(window.innerWidth, window.innerHeight);
    rerender.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    box.current.appendChild(rerender.domElement);

    const handleResize = () => {
      aspectRatio = window.innerWidth / window.innerHeight;
      rerender.setSize(window.innerWidth, window.innerHeight);
      rerender.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // jeśli użytkownik przeniesie na inny ekran również zmieniamy pixelRatio
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    };
    const controls = new OrbitControls(camera, box.current);
    controls.enableDamping = true;

    //Debug
    const gui = new dat.GUI();
    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(2, 2, -1);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 7;

    // directionalLight.shadow.radius = 4; // nie dziala z algorytmem PCSoftShadowMap

    // const directionalHelper = new THREE.CameraHelper(
    //   directionalLight.shadow.camera,
    // );
    // scene.add(directionalHelper);

    gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
    scene.add(directionalLight);

    //Spot light
    const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.fov = 30;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 7;

    spotLight.position.set(0, 2, 2);

    scene.add(spotLight, spotLight.target);

    const spotHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    // scene.add(spotHelper);

    //Point light
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.castShadow = true;
    pointLight.position.set(-1, 1, 0);
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 7;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;

    scene.add(pointLight);

    const pointHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    // scene.add(pointHelper);

    /**
     * Materials
     */

    //texture shadow
    const textureLoader = new THREE.TextureLoader();
    const bakedShadow = textureLoader.load(texture1);

    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.7;
    gui.add(material, 'metalness').min(0).max(1).step(0.001);
    gui.add(material, 'roughness').min(0).max(1).step(0.001);

    /**
     * Objects
     */
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 32, 32),
      material,
    );
    sphere.castShadow = true;

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;
    plane.receiveShadow = true;

    scene.add(sphere, plane);

    const sphereShadow = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x6f6f6f,
        alphaMap: bakedShadow,
        transparent: true,
      }),
    );
    sphereShadow.rotation.x = -Math.PI * 0.5;
    sphereShadow.position.y = plane.position.y + 0.01;
    scene.add(sphereShadow);

    //Loop
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();

      sphere.position.x = Math.sin(elapsedTime);
      sphere.position.z = Math.cos(elapsedTime);
      sphere.position.y = Math.abs(Math.cos(elapsedTime) * 3);

      sphereShadow.position.x = Math.sin(elapsedTime) * 1.5;
      sphereShadow.position.z = Math.cos(elapsedTime) * 1.5;
      sphereShadow.material.opacity = 1 - Math.abs(Math.cos(elapsedTime));
      //   sphereShadow. = Math.cos(elapsedTime) + 1;
      controls.update();
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
