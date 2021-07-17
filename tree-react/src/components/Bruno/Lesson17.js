import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Color, Geometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

import particleTextureFile from '../textures/particles/4.png';
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

    //texture
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(particleTextureFile);

    //particles
    const bufferGeometry = new THREE.BufferGeometry();

    const count = 40000;
    const array = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      array[i] = (Math.random() - 0.5) * 20;
      colors[i] = Math.random();
    }

    bufferGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(array, 3),
    );
    bufferGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    // const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32);

    const particlesMaterial = new THREE.PointsMaterial();
    // particlesMaterial.color = new Color('#ff88cc');
    particlesMaterial.size = 0.2;
    particlesMaterial.sizeAttenuation = true;
    particlesMaterial.transparent = true;
    particlesMaterial.alphaMap = particleTexture;
    // particlesMaterial.alphaTest = 0.001;
    // particlesMaterial.depthTest = false; //powoduje bugi kiedy jest wiecej obiektow o innym kolorze
    particlesMaterial.depthWrite = false;
    particlesMaterial.blending = THREE.AdditiveBlending; // wpływa na wydajność negatywnie ale powoduje bardzo fajny efekt kiedy particlesy nadchodzą na siebie zamiast je nadpisywać rozjaśnia poszczegolne piksele

    particlesMaterial.vertexColors = true; //aby kolory dzialaly które dostarczamy wyżej

    //points
    const particles = new THREE.Points(bufferGeometry, particlesMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();

      //   particles.rotation.y = elapsedTime * 0.03; //whole particles animationDelay:
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = bufferGeometry.attributes.position.array[i3];
        bufferGeometry.attributes.position.array[i3 + 1] = Math.sin(
          elapsedTime + x,
        );
      }
      bufferGeometry.attributes.position.needsUpdate = true;

      controls.update();
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
