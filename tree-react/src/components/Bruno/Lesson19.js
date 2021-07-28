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
    camera.position.z = 4;

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

    //mouse
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (e) => {
      mouse.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * -2 + 1,
      );
    });

    window.addEventListener('click', (e) => {
      if (currentIntersect) {
        switch (currentIntersect.object) {
          case sphere1: {
            console.log('click sphere1');
            break;
          }
          case sphere2: {
            console.log('click sphere2');
            break;
          }
          case sphere3: {
            console.log('click sphere3');
            break;
          }
        }
      }
    });
    //shapes
    const sphereGeometry = new THREE.SphereBufferGeometry(0.3, 24, 24);
    const sphereMaterial1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphereMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphereMaterial3 = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
    const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    const sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial3);

    sphere1.position.x = -1;
    sphere3.position.x = 1;
    scene.add(sphere1, sphere2, sphere3);

    //raycaster
    const raycaster = new THREE.Raycaster();
    let currentIntersect = null;
    /*const raycaster = new THREE.Raycaster();
    
    const rayOrigin = new THREE.Vector3(-3, 0, 0); //where ray start
    const rayDirection = new THREE.Vector3(10, 0, 0); //kierunek
    // console.log(rayDirection.length());
    rayDirection.normalize(); //set length of ray to default 1
    // console.log(rayDirection.length());
    
    raycaster.set(rayOrigin, rayDirection);

    const intersect = raycaster.intersectObject(sphere1);
    console.log(intersect);
    const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
    console.log(intersects);*/

    //control panel
    const gui = new dat.GUI({ width: 400 });

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();

      sphere1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
      sphere2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
      sphere3.position.y = Math.sin(elapsedTime * 1.3) * 1.5;

      raycaster.setFromCamera(mouse, camera);

      //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
      //   const rayDirection = new THREE.Vector3(1, 0, 0);
      //   rayDirection.normalize();

      //   raycaster.set(rayOrigin, rayDirection);

      const sphereArray = [sphere1, sphere2, sphere3];
      const intersects = raycaster.intersectObjects(sphereArray);

      sphereArray.forEach((sphere) => {
        sphere.material.color.set('#ffffff');
      });

      for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff');
      }

      if (intersects.length) {
        if (currentIntersect === null) {
          console.log('mouse enter');
        }
        currentIntersect = intersects[0];
      } else {
        if (currentIntersect !== null) {
          console.log('mouse leave');
        }
        currentIntersect = null;
      }
      controls.update();
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
