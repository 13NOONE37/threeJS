import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Lesson4() {
  const box = useRef(null);

  useEffect(() => {
    let renderer, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.set(0, 1, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    box.current.appendChild(renderer.domElement);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    const colorBlue = new THREE.Color("hsl(110,54%,40%)");
    const boxG = new THREE.BoxGeometry(1, 1, 1);
    const boxM = new THREE.MeshBasicMaterial({ color: colorBlue });
    const cube = new THREE.Mesh(boxG, boxM);
    scene.add(cube);

    gsap.to(cube.position, {
      duration: 1,
      delay: 1,
      x: 2,
    });

    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      //   cube.rotation.y = elapsedTime;
      //   cube.rotation.y = elapsedTime * Math.PI * 2; //pelny obrót na sekunde
      //   camera.position.y = Math.sin(elapsedTime);
      //   camera.position.x = Math.cos(elapsedTime);
      //   camera.lookAt(cube.position);
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    // let time = Date.now();
    // const loop = () => {
    //   // Time - aby animacje trwały tyle samo na każdym urządzeniu
    //   const currentTime = Date.now();
    //   const deltaTime = currentTime - time;
    //   time = currentTime;

    //   cube.rotation.y += 0.001 * deltaTime;

    //   renderer.render(scene, camera);
    //   requestAnimationFrame(loop);
    // };
    // loop();

    window.addEventListener("resize", handleResize);
  }, []);
  return <div ref={box}></div>;
}
