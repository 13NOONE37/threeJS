import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sprite, TetrahedronBufferGeometry } from 'three';

export default function SolarSystem() {
  const box = useRef(null);

  useEffect(() => {
    let rerender, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      145,
      window.innerWidth / window.innerHeight,
    );
    camera.position.set(0, 5, 50);

    rerender = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rerender.setSize(window.innerWidth, window.innerHeight);
    box.current.appendChild(rerender.domElement);

    const handleResize = () => {
      rerender.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    const createPointLight = (c = 'x0ffffff', i = 50) => {
      return new THREE.PointLight(c, i);
    };

    const colorLight = new THREE.Color('hsl(54,80%,55%)');

    const light1 = createPointLight(colorLight, 10);
    const light2 = createPointLight(colorLight, 5);
    light2.position.set(0, 0, 90);
    scene.add(light1, light2);

    const createSphere = (r = 1, c = 'x0ffffff') => {
      const sphereGeo = new THREE.SphereGeometry(r, 50, 50);
      const sphereMaterial = new THREE.MeshLambertMaterial({ color: c });
      return new THREE.Mesh(sphereGeo, sphereMaterial);
    };

    const createPivot = (r = 1, c = 'x0ffffff') => {
      const sphere = createSphere(r, c);
      const pivot = new THREE.Object3D();
      pivot.add(sphere);
      return {
        sphere,
        pivot,
      };
    };

    const sun = createSphere(15, colorLight);

    const planet1 = createPivot(2, colorLight);
    planet1.sphere.position.x = 30;
    const planet2 = createPivot(2, colorLight);
    planet2.sphere.position.x = 50;
    const planet3 = createPivot(2, colorLight);
    planet3.sphere.position.x = 70;
    const planet4 = createPivot(2, colorLight);
    planet4.sphere.position.x = 110;
    sun.add(planet1.pivot, planet2.pivot, planet3.pivot, planet4.pivot);

    scene.add(sun);

    const loop = () => {
      rerender.render(scene, camera);
      planet1.pivot.rotation.y += 0.01;

      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('resize', handleResize);
  }, []);
  return <div ref={box}></div>;
}
