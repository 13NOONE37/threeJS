import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Atom() {
  const box = useRef(null);

  useEffect(() => {
    let scene, camera, renderer;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      44,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 50);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    box.current.appendChild(renderer.domElement);

    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };

    const createSphere = (r = 1, color = 0xffffff) => {
      const sphereGeometry = new THREE.SphereGeometry(r, 20, 20);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 20,
      });
      return new THREE.Mesh(sphereGeometry, sphereMaterial);
    };
    const createPointLight = (i = 1, color = 0xffffff) =>
      new THREE.PointLight(color, i);

    const createElectron = (r = 0.4, color = 0xffffff) => {
      const sphere = createSphere(r, color);
      const pivot = new THREE.Object3D();
      pivot.add(sphere);

      return {
        sphere,
        pivot,
      };
    };

    const nucleus = createSphere(3);
    const l1 = createPointLight(0.9);
    const l2 = createPointLight(0.4);
    l1.position.set(30, 5, 10);
    l2.position.set(-60, 0, 20);

    scene.add(nucleus, l1, l2);

    const e1 = createElectron();
    e1.sphere.position.set(-10, 0, 0);
    const e2 = createElectron();
    e2.sphere.position.set(-5, 0, 0);
    const e3 = createElectron();
    e3.sphere.position.set(5, 0, 0);
    const e4 = createElectron();
    e4.sphere.position.set(10, 0, 0);

    nucleus.add(e1.pivot, e2.pivot, e3.pivot, e4.pivot);

    e2.pivot.rotation.y = 120;
    e2.pivot.rotation.y = 60;
    e2.pivot.rotation.y = -60;
    e2.pivot.rotation.y = 120;

    const loop = () => {
      renderer.render(scene, camera);
      nucleus.rotation.x += 0.01;
      nucleus.rotation.y += 0.02;
      nucleus.rotation.z += 0.03;
      e1.pivot.rotation.z += 0.04;
      e2.pivot.rotation.z += 0.03;
      e3.pivot.rotation.z += 0.03;
      e4.pivot.rotation.z += 0.04;
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', handleResize);
  }, []);
  return <div ref={box}></div>;
}
