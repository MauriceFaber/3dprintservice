import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useModel } from "../contexts/ModelContext";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useMaterial } from "../contexts/MaterialContext";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene = null;
let renderer = null;
let camera = null;
let name;
let model;
export default function TestViewer() {
  const { modelFile, setModelSize } = useModel();
  const { currentMaterial } = useMaterial();

  const mountRef = useRef(null);

  const width = window.innerWidth;
  const height = window.innerHeight;

  if (!scene) {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    camera = new THREE.PerspectiveCamera(
      30, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    camera.position.z = 1;
    camera.position.x = 100;
  }
  var animate = function () {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.x += 0.001;
    }
    renderer.render(scene, camera);
  };

  useEffect(() => {
    return () => {
      return () => mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const addLights = () => {
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    ambient.castShadow = true;
    scene.add(ambient);

    const intensity = 0.4;

    var sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(0, 20, 100);
    scene.add(sunLight);
    // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(100, 20, 100);
    scene.add(sunLight);
    // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(-100, 20, 100);
    scene.add(sunLight);
    // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));

    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(0, 20, -100);
    scene.add(sunLight);
    // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(100, 20, -100);
    scene.add(sunLight);
    // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(-100, 20, -100);
    scene.add(sunLight);
    // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
  };

  async function loadFile() {
    const file = modelFile;
    if (!file) {
      return;
    }

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const asData = await toBase64(file);
    name = file.name;

    const loader = new STLLoader();

    loader.load(asData, (geometry) => {
      var material = new THREE.MeshLambertMaterial({
        color: currentMaterial.color,
      });

      let mesh = new THREE.Mesh(geometry, material);

      mesh.name = name;
      scene.add(mesh);
      const el = scene.getObjectByName(name);

      var boxHelper = new THREE.BoxHelper(el, 0x00ff00);
      scene.add(boxHelper);

      var box3 = new THREE.Box3();
      var size = new THREE.Vector3();
      box3.setFromObject(boxHelper); // or from mesh, same answer

      box3.getSize(size); // pass in size so a new Vector3 is not allocated
      setModelSize(size);
      scene.remove(boxHelper);
      function getCenterPoint(mesh) {
        var middle = new THREE.Vector3();
        var geometry = mesh.geometry;

        geometry.computeBoundingBox();

        middle.x =
          (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
        middle.y =
          (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
        middle.z =
          (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

        mesh.localToWorld(middle);
        return middle;
      }

      var center = getCenterPoint(mesh);
      el.position.set(center.x, center.y, center.z);
      model = el;

      renderer.setSize(width, height);
      renderer.setClearColor(0xaaaaaa, 1);

      mountRef.current.appendChild(renderer.domElement);
      let controls = new OrbitControls(camera, renderer.domElement);

      camera.position.z = 5;
      addLights();

      animate();
    });
  }

  useEffect(async () => {
    await loadFile();
  }, [modelFile]);

  useEffect(async () => {
    if (model) {
      model.material.color = new THREE.Color(currentMaterial.color);
    }
  }, [currentMaterial]);

  return <div ref={mountRef}></div>;
}
