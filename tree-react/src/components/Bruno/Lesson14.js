import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import gsap from 'gsap';
import texture1 from '../textures/matcaps/8.png';
import { DoubleSide, SpotLightHelper } from 'three';
import * as dat from 'dat.gui';
import { dir } from 'async';

export default function Lesson8() {
  const box = useRef(null);

  useEffect(() => {
    let cursor = {
      x: 0,
      y: 0,
    };
    let rerender, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, //45 or 75 is the most popular
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    );
    camera.position.z = 8;
    camera.position.y = 2;

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

    //texture
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(texture1);

    //Content

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    // const pointLight = new THREE.PointLight(0xffffff, 0.5);
    // pointLight.position.x = 2;
    // pointLight.position.y = 2;
    // pointLight.position.z = 2;
    // scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xff0000, 0.3);
    directionalLight.position.set(0, 0.25, 1);
    scene.add(directionalLight);

    const hemisphere = new THREE.HemisphereLight(0xff0000, 0x333333, 0.5);
    scene.add(hemisphere);

    const pointLight = new THREE.PointLight(0xff9900, 0.5, 10, 2);
    pointLight.position.set(1, 0.5, 1);
    scene.add(pointLight);

    const rectAreaLight = new THREE.RectAreaLight(0xf6ff00, 12, 2, 2);
    rectAreaLight.position.set(-4, 0, 6);
    rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(rectAreaLight);
    //RectAreaLight działa tylko z MeshStandardMaterial lub MeshPhysicalMaterial

    //latarka
    const spotLight = new THREE.SpotLight(
      0x78ff00,
      2.5, //intenstywnosc
      10, //odleglosc
      Math.PI * 0.1, //szerokosc swiatla
      0.2, //rozproszczenie
      1,
    );
    spotLight.position.set(0, 2, 3);
    spotLight.target.position.x = -1.5; //.target  to miejsce w które trafia światło
    scene.add(spotLight, spotLight.target);

    //shapes
    // const mainMaterial = new THREE.MeshMatcapMaterial({
    //   matcap: matcapTexture,
    //   side: THREE.DoubleSide,
    // });
    const mainMaterial = new THREE.MeshStandardMaterial();
    mainMaterial.side = THREE.DoubleSide;
    mainMaterial.roughness = 0.4;

    const planeGeometry = new THREE.PlaneBufferGeometry(12, 12);
    const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereBufferGeometry(1, 24, 24);
    const torusGeometry = new THREE.TorusKnotBufferGeometry(0.85, 0.3, 12, 12);

    const plane = new THREE.Mesh(planeGeometry, mainMaterial);
    const cube = new THREE.Mesh(boxGeometry, mainMaterial);
    const sphere = new THREE.Mesh(sphereGeometry, mainMaterial);
    const torus = new THREE.Mesh(torusGeometry, mainMaterial);
    scene.add(plane, cube, sphere, torus);

    cube.position.y = 2;
    sphere.position.y = 2;
    torus.position.y = 2;

    cube.position.x = -2;
    sphere.position.x = 0;
    torus.position.x = 3;

    plane.rotation.x = Math.PI / 2;

    //Debug
    const gui = new dat.GUI();
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.0001);

    //Helpers
    const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphere);
    // scene.add(hemisphereHelper);

    const directionalHelper = new THREE.DirectionalLightHelper(
      directionalLight,
    );
    // scene.add(directionalHelper);

    const pointHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(pointHelper);

    const spotHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotHelper);
    window.requestAnimationFrame(() => {
      spotHelper.update();
    });

    //Loop
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();

      cube.rotation.x = elapsedTime / 2;
      cube.rotation.y = elapsedTime / 2;

      sphere.rotation.x = elapsedTime / 2;
      sphere.rotation.y = elapsedTime / 2;

      torus.rotation.x = elapsedTime / 2;
      torus.rotation.y = elapsedTime / 2;

      controls.update();
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
