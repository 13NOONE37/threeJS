import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Color, Geometry, MeshBasicMaterial, PointsMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import CANNON from 'cannon';

import texturePx from '../textures/environmentMaps2/0/px.png';
import textureNx from '../textures/environmentMaps2/0/nx.png';
import texturePy from '../textures/environmentMaps2/0/py.png';
import textureNy from '../textures/environmentMaps2/0/ny.png';
import texturePz from '../textures/environmentMaps2/0/pz.png';
import textureNz from '../textures/environmentMaps2/0/nz.png';

export default function Lesson8() {
  const box = useRef(null);

  useEffect(() => {
    let cursor = {
      x: 0,
      y: 0,
    };
    window.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX / window.innerWidth - 0.5;
      cursor.y = -(e.clientY / window.innerHeight - 0.5);
    });

    let rerender, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, //45 or 75 is the most popular
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    );
    camera.position.z = 4;

    let aspectRatio = window.innerWidth / window.innerHeight;
    rerender = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rerender.setSize(window.innerWidth, window.innerHeight);
    rerender.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    rerender.shadowMap.enabled = true;
    rerender.shadowMap.type = THREE.PCFSoftShadowMap;

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

    /**
     * Debug
     */
    const gui = new dat.GUI();

    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector('canvas.webgl');

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      texturePx,
      textureNx,

      texturePy,
      textureNy,

      texturePz,
      textureNz,
    ]);

    /**
     * Test sphere
     */
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
      }),
    );
    sphere.castShadow = true;
    sphere.position.y = 0.5;
    scene.add(sphere);

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
      }),
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();

      controls.update();
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
