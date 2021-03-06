import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Geometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { GeometryUtils } from "three";

export default function Lesson8() {
  const box = useRef(null);

  useEffect(() => {
    let cursor = {
      x: 0,
      y: 0,
    };
    window.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX / window.innerWidth - 0.5;
      cursor.y = -(e.clientY / window.innerHeight - 0.5);
    });

    let renderer, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, //45 or 75 is the most popular
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.z = 3;

    let aspectRatio = window.innerWidth / window.innerHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    box.current.appendChild(renderer.domElement);

    const handleResize = () => {
      aspectRatio = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // jeśli użytkownik przeniesie na inny ekran również zmieniamy pixelRatio

      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    };
    const controls = new OrbitControls(camera, box.current);
    controls.enableDamping = true;

    const colorBlue = new THREE.Color("hsl(210,54%,40%)");

    //Buffer geometry jest zdecydowanie wydajniejsze lecz trudniejszy do implementacji

    //Cube Buffer
    // const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);
    // const cubeMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00,
    //   wireframe: true,
    // });
    // const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // scene.add(cube);

    //Own buffer
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const cubeGeometry = new THREE.BufferGeometry();

    const count = 40;
    const positionsArray = new Float32Array(count * 3 * 3);

    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = Math.random() - 0.5;
    }

    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
    cubeGeometry.setAttribute("position", positionsAttribute);

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      //   Update controls; zeby Damping działał

      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("resize", handleResize);

    //Full screen handle
    window.addEventListener("dblclick", () => {
      //Deciding does it Normal browser or Safari
      const screenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      if (!screenElement) {
        //without full
        if (box.current.requestFullscreen) {
          //normal
          box.current.requestFullscreen();
        } else if (box.current.webkitRequestFullscreen) {
          //safari
          box.current.webkitRequestFullscreen();
        }
      } else {
        //fullscreen
        if (document.exitFullscreen) {
          //normal
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          //safari
          document.webkitExitFullscreen();
        }
      }
    });
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
