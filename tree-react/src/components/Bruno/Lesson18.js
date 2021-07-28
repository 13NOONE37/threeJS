import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Color, Geometry, MeshBasicMaterial, PointsMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';

import texture1 from '../textures/particles/1.png';
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
    camera.position.z = 10;

    let aspectRatio = window.innerWidth / window.innerHeight;
    rerender = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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

    //textture
    const textureLoader = new THREE.TextureLoader();
    const star = textureLoader.load(texture1);

    //Galaxy
    const parameters = {
      count: 100000,
      size: 0.01,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984',
      galaxyRotationSpeed: 55,
    };

    let galaxyGeometry = null;
    let galaxy = null;
    let galaxyMaterial = null;

    const generateGalaxy = () => {
      const insideColor = new THREE.Color(parameters.insideColor);
      const outsideColor = new THREE.Color(parameters.outsideColor);

      //Destory old galaxy
      if (galaxy !== null) {
        galaxyGeometry.dispose();
        galaxyMaterial.dispose();
        scene.remove(galaxy);
      }

      galaxyGeometry = new THREE.BufferGeometry();
      const particles = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count * 3; i++) {
        //position
        const index = i * 3;

        const radius = Math.random() * parameters.radius;
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
        const spinAngle = radius * parameters.spin;

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;

        particles[index + 0] =
          Math.cos(branchAngle + spinAngle) * radius + randomX;
        particles[index + 1] = 0 + randomY;
        particles[index + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        //color
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius);

        colors[index + 0] = mixedColor.r;
        colors[index + 1] = mixedColor.g;
        colors[index + 2] = mixedColor.b;
      }
      galaxyGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particles, 3),
      );
      galaxyGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3),
      );

      galaxyMaterial = new PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        alphaMap: star,
      });

      galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
      scene.add(galaxy);
    };
    generateGalaxy();

    //control panel
    const gui = new dat.GUI({ width: 400 });

    gui
      .add(parameters, 'count')
      .name('Particles count')
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(generateGalaxy);

    gui
      .add(parameters, 'size')
      .name('Particles size')
      .min(0.0001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'radius')
      .name('Particles radius')
      .min(0.1)
      .max(20)
      .step(0.01)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'branches')
      .name('Particles branches')
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'spin')
      .name('Particles spin')
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'randomness')
      .name('Particles randomness')
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'randomnessPower')
      .name('Particles randomnessPower')
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'galaxyRotationSpeed')
      .name('Galaxy rotation speed')
      .min(1)
      .max(100)
      .step(1)
      .onFinishChange(generateGalaxy);
    gui
      .addColor(parameters, 'insideColor')
      .name('Particles inside color')
      .onFinishChange(generateGalaxy);
    gui
      .addColor(parameters, 'outsideColor')
      .name('Particles outside color')
      .onFinishChange(generateGalaxy);

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();

      galaxy.rotation.y = (elapsedTime / 100) * parameters.galaxyRotationSpeed;
      controls.update();
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
