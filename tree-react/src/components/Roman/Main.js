import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Main() {
  const box = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      24,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    ); //pierwszy argument ogniskowa im wyższa tym elementy zdają się być bliżej; drugi argument proporcje; 3 najblizszy punkt przy kamerze; 4 najdalszy punkt...

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    box.current.appendChild(renderer.domElement);

    const colorWood = new THREE.Color('hsl(20,60%,70%)');
    const colorYellow = new THREE.Color('hsl(50,60%,70%)');
    const colorPink = new THREE.Color('hsl(305,60%,70%)');
    const colorLight = new THREE.Color('hsl(40,100%,95%)');
    const colorSun = new THREE.Color('hsl(66, 85%, 90%)');

    const cubeGeometry = new THREE.BoxGeometry(2, 1.5, 3.9);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: colorYellow,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.rotation.x = 20;
    cube.rotation.z = -20;
    scene.add(cube);

    const octahedronGeometry = new THREE.OctahedronGeometry(1, 0);
    const octahedronMaterial = new THREE.MeshLambertMaterial({
      color: colorWood,
    });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(5, 1.8, -3);
    scene.add(octahedron);

    const knotGeometry = new THREE.TorusKnotGeometry(2, 0.7, 132, 65);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: colorPink,
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    knot.position.set(-5, -2, -10);
    scene.add(knot);

    // const light = new THREE.AmbientLight(colorLight, 2); //oswietla wszysko równo
    const light = new THREE.PointLight(colorLight, 1);
    // const light = new THREE.DirectionalLight(colorLight, 0.5);
    // const light = new THREE.HemisphereLight(colorSun, colorPink, 1); //kolor nieba, kolor podloza, intensyhwnosc
    const light2 = new THREE.PointLight(colorLight, 0.2);

    light.position.set(-40, -20, 20);
    light2.position.set(40, 20, 10);

    scene.add(light);
    scene.add(light2);

    camera.position.z = 15;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.02;
      cube.rotation.z -= 0.02;
      octahedron.rotation.x += 0.01;
      octahedron.rotation.y -= 0.01;
      octahedron.rotation.z -= 0.05;
      knot.rotation.x += 0.02;
      knot.rotation.z -= 0.02;
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  return <div ref={box}></div>;
}
