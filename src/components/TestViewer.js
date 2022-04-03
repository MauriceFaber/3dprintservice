import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useModel } from "../contexts/ModelContext";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useMaterial } from "../contexts/MaterialContext";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { CuraWASM } from "cura-wasm";
import { resolveDefinition } from "cura-wasm-definitions";
import fileToArrayBuffer from "file-to-array-buffer";
// import { GCodeLoader } from "three/examples/jsm/loaders/GCodeLoader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import TWEEN from "tween";

import "../index.css";

let mesh;
let sphere;
let scene;
let initialized = false;
let camera;
var renderer;
export default function TestViewer() {
  const { modelFile, setModelSize, setMetaData, setProgress, loadModel } =
    useModel();
  const { currentMaterial } = useMaterial();

  const mountRef = useRef(null);

  let width;
  let height;
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

  var animate = function (time) {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
  };

  const handleWindowResize = () => {
    width = mountRef.current.clientWidth;
    height = mountRef.current.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  useEffect(async () => {
    setMaterial();
  }, [currentMaterial]);

  function initialize() {
    if (initialized) {
      return;
    }
    width = mountRef.current.clientWidth;
    height = mountRef.current.clientHeight;
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    let backgroundColor = 0x888888;
    backgroundColor = 0xffffff;
    renderer.setClearColor(backgroundColor, 1);
    camera = new THREE.PerspectiveCamera(
      20, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      4000 // far plane
    );
    camera.position.z = 1;
    camera.position.x = 100;
    mountRef.current.appendChild(renderer.domElement);
    new OrbitControls(camera, renderer.domElement);
    initialized = true;
  }

  useEffect(async () => {
    if (!modelFile) {
      scene?.remove(mesh);
      scene?.remove(sphere);
      mesh = null;
      sphere = null;
    } else {
      await loadFile();
    }
  }, [modelFile]);

  const handleMouseDown = () => {
    if (sphere) {
      //scene?.add(sphere);
    }
  };
  const handleMouseUp = () => {
    if (sphere) {
      scene?.remove(sphere);
    }
  };

  useEffect(async () => {
    initialize();
    addLights();
    animate();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      mountRef.current.innerHTML = "";
    };
  }, []);

  const addLights = () => {
    const light = new THREE.AmbientLight(0xf0f0f0); // soft white light
    scene.add(light);
    const intensity = 0.2;

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

    // let rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);

    rectLight = new THREE.RectAreaLight(0xffffff, 1, w, h);
    rectLight.position.set(0, -100, 0);
    rectLight.lookAt(0, 0, 0);
    rectLight.castShadow = true;
    scene.add(rectLight);

    // rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);

    rectLight = new THREE.RectAreaLight(0xffffff, 1, w, h);
    rectLight.position.set(100, 0, 0);
    rectLight.lookAt(0, 0, 0);
    rectLight.castShadow = true;
    scene.add(rectLight);

    // rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);

    rectLight = new THREE.RectAreaLight(0xffffff, 1, w, h);
    rectLight.position.set(-100, 0, 0);
    rectLight.lookAt(0, 0, 0);
    rectLight.castShadow = true;
    scene.add(rectLight);

    // rectLightHelper = new RectAreaLightHelper(rectLight, rectLight.color);
    // scene.add(rectLightHelper);
  };

  function setMaterial() {
    if (mesh) {
      const duration = 500;
      const newColor = new THREE.Color(currentMaterial.color);
      var t = new TWEEN.Tween(mesh.material)
        .to(
          {
            roughness: currentMaterial.roughness,
            metalness: currentMaterial.metalness,
          },
          duration
        )
        .onUpdate(function () {
          //   console.log(this.roughness);
        })
        .start();

      t = new TWEEN.Tween(mesh.material.color)
        .to(
          {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
          },
          duration
        )
        .onUpdate(function () {
          //   console.log(this.roughness);
        })
        .start();

      mesh.material.color.set(currentMaterial.color);
      //   mesh.material.roughness = currentMaterial.roughness
      //     ? currentMaterial.roughness
      //     : 0.5;
      //   mesh.material.metalness = currentMaterial.metalness
      //     ? currentMaterial.metalness
      //     : 1;

      sphere.material.color.set(currentMaterial.color);
      sphere.material.roughness = currentMaterial.roughness
        ? currentMaterial.roughness
        : 0.5;
      sphere.material.metalness = currentMaterial.metalness
        ? currentMaterial.metalness
        : 1;
    }
  }

  function getCenterPoint(mesh) {
    var middle = new THREE.Vector3();
    var geometry1 = mesh.geometry;

    geometry1.computeBoundingBox();

    middle.x = (geometry1.boundingBox.max.x + geometry1.boundingBox.min.x) / 2;
    middle.y = (geometry1.boundingBox.max.y + geometry1.boundingBox.min.y) / 2;
    middle.z = (geometry1.boundingBox.max.z + geometry1.boundingBox.min.z) / 2;

    mesh.localToWorld(middle);
    return middle;
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async function loadFile() {
    if (!initialized) {
      setTimeout(async () => {
        await loadFile();
      }, 1000);
      return;
    }

    handleWindowResize();

    async function loadPrintInfo(file) {
      let overrides = require("./ender3overrides.json");

      const slicer = new CuraWASM({
        /*
         * The 3D printer definition to slice for (See the src/definitions directory
         * or https://github.com/Ultimaker/Cura/tree/master/resources/definitions
         * for a list of built-in definitions)
         */
        // command: "slice -o Model.gcode -l Model.stl",
        definition: resolveDefinition("creality_ender3"),
        overrides: overrides,
      });

      //Load your STL as an ArrayBuffer
      const stl = await fileToArrayBuffer(file);

      //Progress logger (Ranges from 0 to 100)
      slicer.on("progress", (percent) => {
        setProgress(percent);
      });

      //Slice (This can take multiple minutes to resolve!)
      const { gcode, metadata } = await slicer.slice(stl, "stl");
      setMetaData(metadata);

      // const gLoader = new GCodeLoader();
      // const gCodeGroup = await gLoader.loadAsync(gcode);
      // console.log(gCodeGroup);

      //Do something with the GCODE (ArrayBuffer)
      //WASM END
    }

    async function displayFile(file) {
      const asData = await toBase64(file);
      name = file.name;

      const loader = new STLLoader();

      const geometry = await loader.loadAsync(asData);
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
      const el = scene.getObjectByName(name);

      scene.remove(boxHelper);

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

        const col = document.getElementsByClassName("fullSpace");
        col[0].style.transition = "none";
        col[0].style.opacity = 1;
        col[0].classList.add("fadeInAnim");
      }

      let longestSide = size.x > size.y ? size.x : size.y;
      longestSide = size.z > longestSide ? size.z : longestSide;
      fitCameraToObject(camera, el, longestSide * 2);

      const sphereGeo = new THREE.SphereGeometry(longestSide / 2);
      material = new THREE.MeshBasicMaterial();
      material.wireframe = true;
      if (sphere) {
        scene.remove(sphere);
      }
      sphere = new THREE.Mesh(sphereGeo, material);
      setMaterial();
    }

    await Promise.all([loadPrintInfo(modelFile), displayFile(modelFile)]);
  }

  const [fileInput, setFileInput] = useState(undefined);
  /**
   * Handler zum Öffnen einer Datei
   */
  function handleOpen() {
    fileInput.click();
  }

  async function open(e) {
    await loadModel(e.name, e);
  }

  function setRoughness(val) {
    mesh.material.roughness = val;
  }

  function setMetalness(val) {
    mesh.material.metalness = val;
  }

  function setPolygons(val) {
    mesh.material.wireframe = val;
  }

  return (
    <div className="border">
      {!modelFile ? (
        <div className="big">
          <h5>
            STL Datei hochladen{" "}
            <a href="#" className="uploadIcon">
              <FontAwesomeIcon onClick={handleOpen} icon={faCube} />
            </a>
            <input
              type="file"
              className="hidden"
              onChange={(e) => open(e.target.files[0])}
              ref={(input) => setFileInput(input)}
            ></input>
          </h5>
        </div>
      ) : null}
      {modelFile ? (
        <>
          {/* <input
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
          /> */}
          {/* <input
            type="checkbox"
            step="0.02"
            onChange={(e) => setPolygons(e.target.checked)}
          /> */}
        </>
      ) : null}
      <div
        id="fullSpaceSection"
        onMouseDown={() => handleMouseDown()}
        onMouseUp={() => handleMouseUp()}
        className="fullSpace"
        ref={mountRef}
      ></div>
    </div>
  );
}
