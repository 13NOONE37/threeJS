import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Geometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { GeometryUtils } from 'three';

import * as dat from 'dat.gui';

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
    camera.position.z = 3;

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

    const parameters = {
      color: 0x123499,
      spin: () => {
        gsap.to(cube.rotation, {
          x: cube.rotation.x + Math.PI * 2,
          duration: 1.5,
        });
      },
    };

    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: parameters.color,
      //   wireframe: true,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    // Debug
    const gui = new dat.GUI({ closed: true });

    gui.add(cube.position, 'x', -5, 5, 0.01);
    gui.add(cube.position, 'y', -5, 5, 0.01);
    // gui.add(cube.position, 'z', -5, 5, 0.01);
    gui.add(cube.position, 'z').min(-5).max(5).step(0.01).name('CubeZ: ');

    cube.visible = true;
    gui.add(cube, 'visible').name('Toggle cube visible');

    gui.add(cubeMaterial, 'wireframe');
    //do materiału obiektu można się dostać również poprzez naszObiekt.material

    gui.addColor(parameters, 'color').onChange(() => {
      //when color is changed
      cubeMaterial.color.set(parameters.color);
    });

    gui.add(parameters, 'spin');

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      //   Update controls; zeby Damping działał
      controls.update();

      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
