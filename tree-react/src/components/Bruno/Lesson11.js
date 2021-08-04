import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Geometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { GeometryUtils } from "three";

import metalTestTexture from "../textures/MetalFloor/color.jpg";
import colorTexture from "../textures/minecraft.png";
import alphaTexture from "../textures/door/alpha.jpg";
import heightTexture from "../textures/door/height.jpg";
import normalTexture from "../textures/door/normal.jpg";
import ambientOcclusionTexture from "../textures/door/ambientOcclusion.jpg";
import metalnessTexture from "../textures/door/metalness.jpg";
import roughnessTexture from "../textures/door/roughness.jpg";

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

    //Texture
    //Old
    // const image = new Image();
    // const texture = new THREE.Texture(image);
    // image.onload = () => {
    //   texture.needsUpdate = true;
    // };
    // image.src = imageTexture;
    //Best
    const loadingManager = new THREE.LoadingManager(); //daje name informacje o ladowaniu; ktore zaladowane; w ilu procentach
    loadingManager.onStart = () => {
      console.log("onStart");
    };
    loadingManager.onProgress = () => {
      console.log("onProgres"); //można użyć do paska ładowania
    };
    loadingManager.onLoad = () => {
      console.log("loaded");
    };
    loadingManager.onError = () => {
      console.log("error");
    };
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const texture = textureLoader.load(colorTexture);
    const texture2 = textureLoader.load(metalTestTexture);

    //One textureLoader can load more than one texture
    // const texture2 = textureLoader.load(imageTexture1);
    // const texture3 = textureLoader.load(imageTexture2);

    //transform texture
    //Repeat texture
    // texture.repeat.x = 3;
    // texture.repeat.y = 3;

    // Repeat texture
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    //Mirror reflection
    // texture.wrapS = THREE.MirroredRepeatWrapping;
    // texture.wrapT = THREE.MirroredRepeatWrapping;

    //Offset
    // texture.offset.x = 0.5;
    // texture.offset.y = 0.5;

    //rotate
    // texture.rotation = Math.PI * 0.25; // w radianach; Math.PI * 2 = 360 stopni
    // texture.center.x = 0.5; //odpowiednik transform-origin:center;
    // texture.center.y = 0.5;

    //mip mapping
    //defaultowo jest linearFilter
    //kiedy ustawimy zarówno minFilter jak i magFilter na NearestFilter pomijamy mipmapping musimy tylko dodać texture.generateMipmaps = false
    texture.generateMipmaps = false;
    /*kiedy bilsko*/ texture.minFilter = THREE.NearestFilter;
    /*kiedy daleko*/ texture.magFilter = THREE.NearestFilter; //przydatne np. do minecrafta; nie bluruje nam to zbyt malych textur np. 8 na 8 pikseli gdy naniesiemy je na większy obiekt
    //używanie NearestFilter jest lepsze dla wydajności

    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      //   wireframe: true,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      //   Update controls; zeby Damping działał

      controls.update();
      //texture.rotation = elapsedTime / 5; // rotate texture
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("resize", handleResize);
  }, []);
  return <div className="divFor3d" ref={box}></div>;
}
