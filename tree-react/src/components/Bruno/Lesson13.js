import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Geometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { GeometryUtils } from 'three';
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

import texture1 from '../textures/matcaps/8.png';

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
    camera.position.z = 16;

    gsap.to(camera.position, { z: 4.4, duration: 3 });

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

    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x006600,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -2;
    // scene.add(cube);

    //Textures
    const textureLoader = new THREE.TextureLoader();
    const matcap1 = textureLoader.load(texture1);

    //Fonts
    const textGeometry = new THREE.TextGeometry('Czesio Cheetos', {
      font: new THREE.Font(typefaceFont),
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });
    // const fontLoader = new THREE.FontLoader();
    // fontLoader.load('path/path', (font) =>{
    //     //create text geometry, material and mesh and; 'font' is our font
    // })

    textGeometry.center();
    //OR
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
    // );

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcap1,
    });
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    console.time('donuts');
    //add donuts
    const torusGeo = new THREE.TorusBufferGeometry(0.025, 0.02, 15, 45);

    const donutGroup = new THREE.Group();
    for (let i = 0; i < 3500; i++) {
      const torus = new THREE.Mesh(torusGeo, material);
      torus.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
      );
      const scaleValue = Math.random();
      torus.scale.set(scaleValue, scaleValue, scaleValue);
      torus.rotation.x = Math.random() * Math.PI * 0.35;
      torus.rotation.y = Math.random() * Math.PI * 0.35;
      donutGroup.add(torus);
    }
    scene.add(donutGroup);
    console.timeEnd('donuts');

    camera.lookAt(text.position);
    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      //   Update controls; zeby Damping działał
      donutGroup.rotation.x = elapsedTime * 0.025;
      donutGroup.rotation.y = elapsedTime * 0.025;
      camera.position.x = Math.sin(elapsedTime);
      camera.position.y = Math.cos(elapsedTime);
      controls.update();
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
