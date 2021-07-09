import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Lesson4() {
  const box = useRef(null);

  useEffect(() => {
    let rerender, camera, scene;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
    );
    camera.position.set(1, 1, 5);

    rerender = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rerender.setSize(window.innerWidth, window.innerHeight);
    box.current.appendChild(rerender.domElement);

    const handleResize = () => {
      rerender.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x666099 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    //tworzenie grupy
    const group = new THREE.Group();
    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0x666099,
      }),
    );
    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0x666099,
      }),
    );
    cube2.position.set(1.4, 0, 0);
    group.rotation.reorder('YXZ');
    group.add(cube1, cube2);
    //teraz mozemy poruszac całą grupą
    group.position.set(1.5, 1.5, 1.5);

    //  position
    mesh.position.set(3, -2, -5);

    //scale
    mesh.scale.set(1, 4, 3);

    //rotate
    //takie obracanie jest względne tj. jeśli najpierw obrócimy daną oś to nastepne będą do niej relatywne możemy to rozwiązać poprzez reorder
    // mesh.rotation.x = 40;
    // mesh.rotation.y = 10;
    // mesh.rotation.y = Math.PI / 2; //jesli checmy obrócić o 360 stopni musimy użyć PI razy 2 ponieważ 2 PI to własnie obwód koła
    //Math.Pi/2 to 90stopni; Math.PI/4 to 45stopni itd.

    //absolute rotation (reorder)
    mesh.rotation.reorder('YZX');
    mesh.rotation.x = Math.PI * 0.35;
    mesh.rotation.y = Math.PI * 0.6;
    //dzieki temu najpierw wykona się obrót Y i nie powstaną jakieś dziwne rzeczy
    //zapobiega też to zjawisku gimball lock które w pewnym momencie blokuje obracanie

    // mesh.rotation.z = 10;
    // mesh.rotation.set(40, 5, 5); // to tak jakbyś obracali tą linią pomocniczą

    //quaternion inny sposób obracania - ułatwia niektóre rzeczy; podczas użytwania rotation on też jest używany przez libkę oraz na odwrót
    // mesh.quaternion.set();

    //miejsce w któr ma patrzeć kamera
    // camera.lookAt(new THREE.Vector3(3, 3, 3));
    camera.lookAt(mesh.position);

    // console.log(mesh.position.length());
    // console.log(mesh.position.distanceTo(new THREE.Vector3(0, 1, 2))); //odległość do konkretnego punktu
    // console.log(
    //   'Length from object to camera',
    //   mesh.position.distanceTo(camera.position),
    // ); //odleglosc obiektu od kamery równie dobrze może to być inny obiekt
    // mesh.position.normalize(); //przywraca pozycje 1,1,1 dla obiektu

    // axis helper
    const axesHelper = new THREE.AxesHelper(10); //jako argument podajemy dlugosc tych lini pomocniczych
    scene.add(axesHelper);

    const loop = () => {
      rerender.render(scene, camera);
      mesh.rotation.x += 0.001;
      mesh.rotation.y += 0.001;
      group.rotation.y += 0.001;
      group.rotation.x += 0.001;
      requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('resize', handleResize);
  }, []);
  return <div ref={box}></div>;
}
