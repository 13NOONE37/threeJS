import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

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

    console.log(camera.position.length());

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
    const boxG = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const boxM = new THREE.MeshBasicMaterial({ color: colorBlue });
    const cube = new THREE.Mesh(boxG, boxM);
    scene.add(cube);
    camera.lookAt(cube.position);

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
  return <div class="divFor3d" ref={box}></div>;
}
