import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as dat from "dat.gui";

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
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let aspectRatio = window.innerWidth / window.innerHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //For good realistic render
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;

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

    const gui = new dat.GUI();

    //Loaders
    const textureLoader = new THREE.TextureLoader();

    // Geometry
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

    // Material
    const material = new THREE.MeshBasicMaterial();

    alert("22 minuta");
    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //Animation
    const clock = new THREE.Clock();

    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      //Update controls
      controls.update();

      //Render
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("resize", handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
