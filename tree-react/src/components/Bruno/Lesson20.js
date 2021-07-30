import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Color, Geometry, MeshBasicMaterial, PointsMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es';

import texturePx from '../textures/environmentMaps2/0/px.png';
import textureNx from '../textures/environmentMaps2/0/nx.png';
import texturePy from '../textures/environmentMaps2/0/py.png';
import textureNy from '../textures/environmentMaps2/0/ny.png';
import texturePz from '../textures/environmentMaps2/0/pz.png';
import textureNz from '../textures/environmentMaps2/0/nz.png';

import sound1 from '../textures/hit.mp3';

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
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let aspectRatio = window.innerWidth / window.innerHeight;
    rerender = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rerender.setSize(window.innerWidth, window.innerHeight);
    rerender.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //ustawia maksymalnie pixelRatio na 2 jesli pixelRatio urzadzenia jest wieksze od 2
    rerender.shadowMap.enabled = true;
    rerender.shadowMap.type = THREE.PCFSoftShadowMap;

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

    /**
     * Debug
     */
    const gui = new dat.GUI();
    const debugObject = {};
    debugObject.createSphere = () => {
      createSphere(Math.random() * 1.2, {
        x: Math.random() * 3,
        y: 3,
        z: Math.random() * 3,
      });
    };
    debugObject.createBox = () => {
      createBox(0.4, 0.2, 0.1, { x: 0, y: 4, z: 0 });
    };
    debugObject.reset = () => {
      objectsToUpdate.forEach((object) => {
        //remove body
        object.body.removeEventListener('collide', playSound);
        world.removeBody(object.body);

        //remove mesh
        scene.remove(object.mesh);
      });
    };
    gui.add(debugObject, 'createSphere');
    gui.add(debugObject, 'createBox');
    gui.add(debugObject, 'reset');

    //Sounds
    let currentSoundTime = 0;
    const hitSound = new Audio(sound1);
    const playSound = (collision) => {
      if (Date.now() > currentSoundTime + 10) {
        // delay between sound play
        const strengthImpact = Math.min(
          collision.contact.getImpactVelocityAlongNormal(),
          10,
        );

        if (strengthImpact > 1.5) {
          hitSound.volume = Math.min(1, (strengthImpact / 100) * 2);
          hitSound.currentTime = 0;
          hitSound.play();
        }
      }
      currentSoundTime = Date.now();
    };

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      texturePx,
      textureNx,

      texturePy,
      textureNy,

      texturePz,
      textureNz,
    ]);

    //Physics

    //World
    const world = new CANNON.World();
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;
    world.gravity.set(0, -9.82, 0); //second argument int this case is earth gravity const
    //Materials
    // const concreteMaterial = new CANNON.Material('concrete');
    // const plasticMaterial = new CANNON.Material('plastic');

    // const contactPlasticConcretMaterial = new CANNON.ContactMaterial(
    //   concreteMaterial,
    //   plasticMaterial,
    //   { friction: 0.1, restitution: 0.7 },
    // ); //whats going to happend when materials touch themselves
    // world.addContactMaterial(contactPlasticConcretMaterial);
    const defaultMaterial = new CANNON.Material('default');

    const contactDefaultMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      { friction: 0.1, restitution: 0.7 },
    );
    world.defaultContactMaterial = contactDefaultMaterial; //Simplest way but in only simple projects

    //Sphere
    // const sphereShape = new CANNON.Sphere(0.5);
    // const sphereBody = new CANNON.Body({
    //   mass: 1,
    //   position: new CANNON.Vec3(0, 3, 0),
    //   shape: sphereShape,
    //   // material: defaultMaterial,
    // });
    // sphereBody.applyLocalForce(
    //   new CANNON.Vec3(150, 0, 0), //power
    //   new CANNON.Vec3(0, 0, 0), //position
    // );
    // world.addBody(sphereBody);

    //Floor
    const planeShape = new CANNON.Plane(); // in CANNON plane is infinite
    const planeBody = new CANNON.Body({
      mass: 0,
      shape: planeShape,
      // material: defaultMaterial,
    });
    planeBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5,
    ); // pierwszy argument to oś według której obracamy a drugi to stopień
    world.addBody(planeBody);

    /**
     * Test sphere
     */
    // const sphere = new THREE.Mesh(
    //   new THREE.SphereBufferGeometry(0.5, 32, 32),
    //   new THREE.MeshStandardMaterial({
    //     metalness: 0.3,
    //     roughness: 0.4,
    //     envMap: environmentMapTexture,
    //   }),
    // );
    // sphere.castShadow = true;
    // sphere.position.y = 0.5;
    // scene.add(sphere);

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
      }),
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    //Utils
    const objectsToUpdate = []; //when we create object that will be update we push it here

    const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    });

    const createSphere = (radius, position) => {
      //three.js
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.scale.set(radius, radius, radius); //musimy tak zrobić ponieważ promień definiujemy poza tą funkcją
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      //cannon.js
      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        mass: 1,
        position: position,
        shape: shape,
        material: defaultMaterial,
      });
      body.addEventListener('collide', playSound);
      world.addBody(body);

      //add to update array
      objectsToUpdate.push({
        mesh: mesh,
        body: body,
      });
    };

    const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    });

    const createBox = (width, height, depth, position) => {
      const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
      mesh.scale.set(width, height, depth);
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2),
      );
      const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        material: defaultMaterial,
      });
      body.position.copy(position);

      body.addEventListener('collide', playSound);
      world.addBody(body);

      objectsToUpdate.push({ mesh, body });
    };
    //Animation
    const clock = new THREE.Clock();
    let oldElpaseTime = 0;
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElpaseTime; //czas który upłynął od poprzedniej klatki
      oldElpaseTime = elapsedTime;

      //Update physics world
      // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

      world.step(1 / 60, deltaTime, 3);

      objectsToUpdate.forEach((object) => {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
        // object.body.applyForce(
        //   new CANNON.Vec3(-0.1, 0, 0),
        //   object.body.position,
        // );
      });
      //update threejs world
      // sphere.position.copy(sphereBody.position); //this is the same what below
      // sphere.position.x = sphereBody.position.x;
      // sphere.position.y = sphereBody.position.y;
      // sphere.position.z = sphereBody.position.z;

      //Update controls
      controls.update();

      //Render
      rerender.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
