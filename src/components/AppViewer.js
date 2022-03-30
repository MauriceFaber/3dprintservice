import React, { Component, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useMaterial } from "../contexts/MaterialContext";
import { useModel } from "../contexts/ModelContext";
const style = {
  height: "40vh",
};

export default function AppViewer() {
  const { modelFile } = useModel();
  const { currentMaterial } = useMaterial();
  const mount = useRef(null);

  let scene;
  let camera;
  let model;
  let controls;
  let renderer;
  let requestID;

  useEffect(() => {
    sceneSetup();
    addLights();
    loadTheModel();
    startAnimationLoop();
    // window.addEventListener("resize", handleWindowResize);
    return () => {
      //   window.removeEventListener("resize", handleWindowResize);
      //   window.cancelAnimationFrame(requestID);
      //   controls.dispose();
    };
  }, []);

  const sceneSetup = () => {
    const width = window.clientWidth;
    const height = window.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      30, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    controls = new OrbitControls(camera, renderer.domElement);
    renderer.setClearColor(0xff0000, 1);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height);
    mount.current.appendChild(renderer.domElement);
  };

  const loadTheModel = async () => {
    const file = modelFile;
    if (!file) {
      console.log("no file");
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
    const name = file.name;

    const loader = new STLLoader();

    loader.load(
      asData,
      (geometry) => {
        var material = new THREE.MeshLambertMaterial({
          color: currentMaterial.color,
        });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = name;
        scene.add(mesh);

        const el = scene.getObjectByName(name);

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
      },
      // called when loading is in progresses
      (xhr) => {},
      // called when loading has errors
      (error) => {
        // console.log("An error happened:" + error);
      }
    );
  };

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

  const startAnimationLoop = () => {
    const rotation = 0.002;
    if (model) model.rotation.z += rotation;
    if (model) model.rotation.x += rotation;
    if (model) model.rotation.y += rotation;

    renderer.render(scene, camera);
    requestID = window.requestAnimationFrame(startAnimationLoop);
  };

  //   const handleWindowResize = () => {
  //     const width = mount.clientWidth;
  //     const height = mount.clientHeight;
  //     renderer.setSize(width, height);
  //     camera.aspect = width / height;
  //     camera.updateProjectionMatrix();
  //   };

  return <div ref={mount} />;
}
