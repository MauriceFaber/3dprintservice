// import React, { Component } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
// import { useModel } from "../contexts/ModelContext";
// const style = {
//   height: "90vh", // we can control scene size by setting container dimensions
// };

// export default class AppViewer extends Component {
//   componentDidMount() {
//     this.sceneSetup();
//     this.addLights();
//     this.loadTheModel();
//     this.startAnimationLoop();
//     window.addEventListener("resize", this.handleWindowResize);
//   }

//   componentWillUnmount() {
//     window.removeEventListener("resize", this.handleWindowResize);
//     window.cancelAnimationFrame(this.requestID);
//     this.controls.dispose();
//   }

//   // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
//   // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
//   sceneSetup = () => {
//     // get container dimensions and use them for scene sizing
//     const width = this.mount.clientWidth;
//     const height = this.mount.clientHeight;

//     this.scene = new THREE.Scene();
//     this.camera = new THREE.PerspectiveCamera(
//       30, // fov = field of view
//       width / height, // aspect ratio
//       0.1, // near plane
//       1000 // far plane
//     );
//     this.camera.position.z = 100; // is used here to set some distance from a cube that is located at z = 0
//     // OrbitControls allow a camera to orbit around the object
//     // https://threejs.org/docs/#examples/controls/OrbitControls
//     this.controls = new OrbitControls(this.camera, this.mount);
//     this.renderer = new THREE.WebGLRenderer();
//     this.renderer.setClearColor(0xff0000, 0);
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     this.renderer.setSize(width, height);
//     this.mount.appendChild(this.renderer.domElement); // mount using React ref
//   };

//   // Code below is taken from Three.js OBJ Loader example
//   // https://threejs.org/docs/#examples/en/loaders/OBJLoader
//   loadTheModel = async () => {
//     // instantiate a loader

//     const file = this.props.modelFile;
//     if (!file) {
//       console.log("no file");
//       return;
//     }

//     const toBase64 = (file) =>
//       new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = () => resolve(reader.result);
//         reader.onerror = (error) => reject(error);
//       });

//     const asData = await toBase64(file);
//     const name = file.name;

//     // const asData = "./JoystickHalter1.stl";
//     // const name = "Joystick";

//     const loader = new STLLoader();

//     // load a resource
//     loader.load(
//       // resource URL relative to the /public/index.html of the app
//       asData,
//       (geometry) => {
//         var material = new THREE.MeshLambertMaterial({
//           color: this.props.currentMaterial.color,
//         });

//         let mesh = new THREE.Mesh(geometry, material);
//         mesh.name = name;
//         this.scene.add(mesh);

//         // get the newly added object by name specified in the OBJ model (that is Elephant_4 in my case)
//         // you can always set console.log(this.scene) and check its children to know the name of a model
//         const el = this.scene.getObjectByName(name);

//         // change some custom props of the element: placement, color, rotation, anything that should be
//         // done once the model was loaded and ready for display

//         function getCenterPoint(mesh) {
//           var middle = new THREE.Vector3();
//           var geometry = mesh.geometry;

//           geometry.computeBoundingBox();

//           middle.x =
//             (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
//           middle.y =
//             (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
//           middle.z =
//             (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

//           mesh.localToWorld(middle);
//           return middle;
//         }

//         var center = getCenterPoint(mesh);
//         el.position.set(center.x, center.y, center.z);

//         // make this element available inside of the whole component to do any animation later
//         this.model = el;
//       },
//       // called when loading is in progresses
//       (xhr) => {
//         const loadingPercentage = Math.ceil((xhr.loaded / xhr.total) * 100);
//         // console.log(loadingPercentage + "% loaded");
//         // update parent react component to display loading percentage
//         this.props.onProgress(loadingPercentage);
//       },
//       // called when loading has errors
//       (error) => {
//         // console.log("An error happened:" + error);
//       }
//     );
//   };

//   // adding some lights to the scene
//   addLights = () => {
//     const ambient = new THREE.AmbientLight(0xffffff, 0.2);
//     ambient.castShadow = true;
//     this.scene.add(ambient);

//     const intensity = 0.4;

//     var sunLight = new THREE.PointLight(0xffffff, intensity);
//     sunLight.position.set(0, 20, 100);
//     this.scene.add(sunLight);
//     // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
//     sunLight = new THREE.PointLight(0xffffff, intensity);
//     sunLight.position.set(100, 20, 100);
//     this.scene.add(sunLight);
//     // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
//     sunLight = new THREE.PointLight(0xffffff, intensity);
//     sunLight.position.set(-100, 20, 100);
//     this.scene.add(sunLight);
//     // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));

//     sunLight = new THREE.PointLight(0xffffff, intensity);
//     sunLight.position.set(0, 20, -100);
//     this.scene.add(sunLight);
//     // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
//     sunLight = new THREE.PointLight(0xffffff, intensity);
//     sunLight.position.set(100, 20, -100);
//     this.scene.add(sunLight);
//     // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
//     sunLight = new THREE.PointLight(0xffffff, intensity);
//     sunLight.position.set(-100, 20, -100);
//     this.scene.add(sunLight);
//     // this.scene.add(new THREE.PointLightHelper(sunLight, 1, 0xff0000));
//   };

//   startAnimationLoop = () => {
//     // slowly rotate an object
//     const rotation = 0.002;
//     if (this.model) this.model.rotation.z += rotation;
//     if (this.model) this.model.rotation.x += rotation;
//     if (this.model) this.model.rotation.y += rotation;

//     this.renderer.render(this.scene, this.camera);

//     // The window.requestAnimationFrame() method tells the browser that you wish to perform
//     // an animation and requests that the browser call a specified function
//     // to update an animation before the next repaint
//     this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
//   };

//   handleWindowResize = () => {
//     const width = this.mount.clientWidth;
//     const height = this.mount.clientHeight;

//     this.renderer.setSize(width, height);
//     this.camera.aspect = width / height;

//     // Note that after making changes to most of camera properties you have to call
//     // .updateProjectionMatrix for the changes to take effect.
//     this.camera.updateProjectionMatrix();
//   };

//   render() {
//     return <div style={style} ref={(ref) => (this.mount = ref)} />;
//   }
// }
