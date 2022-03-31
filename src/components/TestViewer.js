import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useModel } from "../contexts/ModelContext";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useMaterial } from "../contexts/MaterialContext";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { CuraWASM } from "cura-wasm";
import { resolveDefinition } from "cura-wasm-definitions";
import { decode as atob, encode as btoa } from "base-64";
import fileToArrayBuffer from "file-to-array-buffer";
import { GCodeLoader } from "three/examples/jsm/loaders/GCodeLoader";

let mesh;
export default function TestViewer() {
  const { modelFile, setModelSize, setMetaData } = useModel();
  const { currentMaterial } = useMaterial();

  const mountRef = useRef(null);

  var renderer;
  let width;
  let scene;
  let height;
  let camera;
  let name;

  // obj - your object (THREE.Object3D or derived)
  // point - the point of rotation (THREE.Vector3)
  // axis - the axis of rotation (normalized THREE.Vector3)
  // theta - radian value of rotation
  // pointIsWorld - boolean indicating the point is in world coordinates (default = false)
  function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

    if (pointIsWorld) {
      obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld) {
      obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
  }

  var animate = function () {
    requestAnimationFrame(animate);
    if (mesh) {
      rotateAboutPoint(
        mesh,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1),
        THREE.Math.degToRad(0.04)
      );
    }
    renderer.render(scene, camera);
  };

  useEffect(async () => {
    console.log("file changed");
    if (modelFile) {
      await loadFile();
    }
  }, [modelFile]);

  const handleWindowResize = () => {
    width = mountRef.current.clientWidth;
    height = mountRef.current.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  useEffect(async () => {
    setMaterial();
    console.log("material changed");
  }, [currentMaterial]);

  useEffect(() => {
    if (!modelFile) {
      window.removeEventListener("resize", handleWindowResize);
      mountRef.current.innerHTML = "";
    } else if (modelFile && mountRef.current) {
      window.addEventListener("resize", handleWindowResize);
      console.log("file changed");
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setSize(width, height);
      renderer.setClearColor(0x888888, 1);
      camera = new THREE.PerspectiveCamera(
        20, // fov = field of view
        width / height, // aspect ratio
        0.1, // near plane
        4000 // far plane
      );
      camera.position.z = 1;
      camera.position.x = 100;
      mountRef.current.appendChild(renderer.domElement);
      let controls = new OrbitControls(camera, renderer.domElement);
    }
  }, [modelFile]);

  const addLights = () => {
    const light = new THREE.AmbientLight(0xf0f0f0); // soft white light
    scene.add(light);
    const intensity = 0.2;

    // const ambientLight = new THREE.HemisphereLight(
    //   "white", // bright sky color
    //   "darkslategrey", // dim ground color
    //   5 // intensity
    // );
    //scene.add(ambientLight);
    const pHeight = 100;
    var sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(0, pHeight, 100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(100, pHeight, 100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(-100, pHeight, 100);
    scene.add(sunLight);

    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(0, pHeight, -100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(100, pHeight, -100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(-100, pHeight, -100);
    scene.add(sunLight);

    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(0, -pHeight, 100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(100, -pHeight, 100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(-100, -pHeight, 100);
    scene.add(sunLight);

    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(0, -pHeight, -100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(100, -pHeight, -100);
    scene.add(sunLight);
    sunLight = new THREE.PointLight(0xffffff, intensity);
    sunLight.position.set(-100, -pHeight, -100);
    scene.add(sunLight);

    const w = 60;
    const h = w;
    let rectLight = new THREE.RectAreaLight(0xffffff, 1, w, h);
    rectLight.position.set(0, 100, 0);
    rectLight.lookAt(0, 0, 0);
    rectLight.castShadow = true;
    scene.add(rectLight);

    let rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);

    rectLight = new THREE.RectAreaLight(0xffffff, 1, w, h);
    rectLight.position.set(0, -100, 0);
    rectLight.lookAt(0, 0, 0);
    rectLight.castShadow = true;
    scene.add(rectLight);

    rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);

    rectLight = new THREE.RectAreaLight(0xffffff, 1, w, h);
    rectLight.position.set(100, 0, 0);
    rectLight.lookAt(0, 0, 0);
    rectLight.castShadow = true;
    scene.add(rectLight);

    rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);

    rectLight = new THREE.RectAreaLight(0xffffff, 1, w, h);
    rectLight.position.set(-100, 0, 0);
    rectLight.lookAt(0, 0, 0);
    rectLight.castShadow = true;
    scene.add(rectLight);

    rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);
  };

  function setMaterial() {
    if (mesh) {
      mesh.material.color.set(currentMaterial.color);
      mesh.material.roughness = currentMaterial.roughness
        ? currentMaterial.roughness
        : 0.5;
      mesh.material.metalness = currentMaterial.metalness
        ? currentMaterial.metalness
        : 1;
    }
  }

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

    //WASM
    function _base64ToArrayBuffer(base64) {
      var binary_string = atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    const slicer = new CuraWASM({
      /*
       * The 3D printer definition to slice for (See the src/definitions directory
       * or https://github.com/Ultimaker/Cura/tree/master/resources/definitions
       * for a list of built-in definitions)
       */
      command:
        "slice -j definitions/printer.def.json -o Model.gcode -s infill=100 -s layer_height=0.02 -l Model.stl",
      definition: resolveDefinition("creality_ender3"),
    });

    //Load your STL as an ArrayBuffer
    const stl = await fileToArrayBuffer(file);

    //Progress logger (Ranges from 0 to 100)
    slicer.on("progress", (percent) => {
      console.log(`Progress: ${percent}%`);
    });

    //Slice (This can take multiple minutes to resolve!)
    const { gcode, metadata } = await slicer.slice(stl, "stl");
    console.log(metadata);
    setMetaData(metadata);

    console.log(gcode);

    const gLoader = new GCodeLoader();
    gLoader.load(gcode, function (data) {
      console.log(data);
      //   var layers = data[0];
      //   console.log(layers);
      //   var layerIndices = data[1];
    });

    //Do something with the GCODE (ArrayBuffer)
    //WASM END

    loader.load(asData, async (geometry) => {
      var material = new THREE.MeshStandardMaterial();
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;

      var boxHelper = new THREE.BoxHelper(mesh, 0x00ff00);
      //scene.add(boxHelper);

      var box3 = new THREE.Box3();
      var size = new THREE.Vector3();
      box3.setFromObject(boxHelper);

      scene.add(mesh);
      box3.getSize(size);
      setModelSize(size);

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      setMaterial();
      const el = scene.getObjectByName(name);

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

      var boxCenter = getCenterPoint(el);
      el.position.set(-boxCenter.x, -boxCenter.y, -boxCenter.z);

      camera.position.x = 100;

      function fitCameraToObject(camera, object, offset) {
        offset = offset || 1.5;

        const boundingBox = new THREE.Box3();

        boundingBox.setFromObject(object);

        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        const startDistance = center.distanceTo(camera.position);
        // here we must check if the screen is horizontal or vertical, because camera.fov is
        // based on the vertical direction.
        const endDistance =
          camera.aspect > 1
            ? (size.y / 2 + offset) / Math.abs(Math.tan(camera.fov / 2))
            : (size.y / 2 + offset) /
              Math.abs(Math.tan(camera.fov / 2)) /
              camera.aspect;

        camera.position.set(
          (camera.position.x * endDistance) / startDistance,
          (camera.position.y * endDistance) / startDistance,
          (camera.position.z * endDistance) / startDistance
        );
        camera.lookAt(center);
      }

      let longestSide = size.x > size.y ? size.x : size.y;
      longestSide = size.z > longestSide ? size.z : longestSide;
      fitCameraToObject(camera, el, longestSide * 2);

      addLights();

      animate();
    });
  }

  function setRoughness(val) {
    mesh.material.roughness = val;
    console.log("roughness set to:", val);
  }

  function setMetalness(val) {
    mesh.material.metalness = val;
    console.log("metalness set to:", val);
  }

  if (!modelFile) {
    return <div ref={mountRef}></div>;
  }

  return (
    <div className="border">
      <input
        type="range"
        min="0"
        max="1"
        step="0.02"
        onChange={(e) => setRoughness(e.target.value)}
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.02"
        onChange={(e) => setMetalness(e.target.value)}
      />
      <div className="fullSpace" ref={mountRef}></div>
    </div>
  );
}
