import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Color, Geometry, MeshBasicMaterial, PointsMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import * as dat from 'dat.gui';

import texturePx from '../textures/environmentMaps/0/px.jpg';
import textureNx from '../textures/environmentMaps/0/nx.jpg';
import texturePy from '../textures/environmentMaps/0/py.jpg';
import textureNy from '../textures/environmentMaps/0/ny.jpg';
import texturePz from '../textures/environmentMaps/0/pz.jpg';
import textureNz from '../textures/environmentMaps/0/nz.jpg';

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

      //For good realistic render
    rerender.physicallyCorrectLights=true;
    rerender.outputEncoding=THREE.sRGBEncoding;
    rerender.toneMapping = THREE.ReinhardToneMapping;
    rerender.toneMappingExposure = 3;
      

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
    
    const gui = new dat.GUI();
    const debugObject = {envIntensity:5}

    //Loaders
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    
    const updateAllMaterials = () => {
     scene.traverse((child) => {
      if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
        console.log(child);
        child.material.envMap = enviormentMap;
        child.material.envMapIntensity=debugObject.envIntensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
     })
    }
    
    //test sphere
    const testSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 24,24),
      new THREE.MeshStandardMaterial()
    );
    // scene.add(testSphere);

    //textures
      const enviormentMap =  cubeTextureLoader.load([texturePx, textureNx, texturePy, textureNy, texturePz, textureNz])
     enviormentMap.encoding = THREE.sRGBEncoding;
      scene.background = enviormentMap;
      scene.environment = enviormentMap;
   
      //lights
      const directionalLight = new THREE.DirectionalLight('#ffffff', 5);
      directionalLight.castShadow=true;
      directionalLight.position.set(0,5,-5);
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.mapSize.set(1024,1024)

      directionalLight.shadow.normalBias = 0.051; //for burger
      scene.add(directionalLight)
      // scene.add(new THREE.CameraHelper(directionalLight.shadow.camera))
      //model
      gltfLoader.load(
        'models/FlightHelmet/glTF/FlightHelmet.gltf', 
        // 'hamburger.glb', 
      (gltf)=>{
        console.log('loaded');
        console.log(gltf);
        gltf.scene.scale.set(7,7,7);
        // gltf.scene.scale.set(0.3,0.3,0.3) //for burger
        
        gltf.scene.position.y=-2;
        scene.add(gltf.scene)
        gui.add(gltf.scene.rotation, 'y').
        min(-Math.PI)
        .max(Math.PI).
        step(0.001)
        .name("Rotation")

        updateAllMaterials();
      })

    //Debug
    gui.add(directionalLight, 'intensity').min(0.001).max(10).step(0.001)
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
    gui.add(directionalLight.shadow, 'normalBias').min(-5).max(5).step(0.0001);
    
    gui.add(debugObject, 'envIntensity').min(0).max(10).step(0.01).onChange(updateAllMaterials)
    gui.add(rerender, 'toneMapping', {
      Linear: THREE.NoToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
    }).onFinishChange(()=>{
      rerender.toneMapping = Number(rerender.toneMapping)
      updateAllMaterials()
    })
    gui.add(rerender, 'toneMappingExposure').min(0.1).max(10).step(0.01);

    //Animation
    const clock = new THREE.Clock();

    let previousTime = 0;
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
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
