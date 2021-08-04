import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import gsap from "gsap";

export default function Lesson7() {
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
    // camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100,
    // );

    console.log(camera.position.length());

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    box.current.appendChild(renderer.domElement);

    const handleResize = () => {
      aspectRatio = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = aspectRatio;
      //   camera.left = -1 * aspectRatio;
      //   camera.right = 1 * aspectRatio;
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
      //   cube.rotation.x = cursor.y;
      //   cube.rotation.y = cursor.x;

      //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
      //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
      //   camera.position.y = cursor.y * 5;
      //   camera.lookAt(cube.position);

      //   Update controls; zeby Damping działał
      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("resize", handleResize);
  }, []);
  return <div ref={box}></div>;
}
