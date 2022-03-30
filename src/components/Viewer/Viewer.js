// import React, {useEffect} from "react";
// import { Canvas } from "react-three-fiber";
// import { useModel } from "../../contexts/ModelContext";
// import { OrbitControls, Stars } from "drei";

// import "./styles.css";

// export default function Viewer() {
//   const { model, fileName } = useModel();

//   const loader = new OBJLoader();
//   const scene = new THREE.Scene();
//   let loadedModel;

// 	function load(){
//         loader.load(
//             fileName,
//             ( object ) => {
//                 scene.add( object );

//                 // get the newly added object by name specified in the OBJ model (that is Elephant_4 in my case)
//                 // you can always set console.log(this.scene) and check its children to know the name of a model
//                 const el = scene.getObjectByName("Elephant_4");

//                 // change some custom props of the element: placement, color, rotation, anything that should be
//                 // done once the model was loaded and ready for display
//                 el.position.set(0, -150,0 );
//                 el.material.color.set(0x50C878);
//                 el.rotation.x = 23.5;

//                 // make this element available inside of the whole component to do any animation later
//                 loadedModel = el;
//             },
//             // called when loading is in progresses
//              ( xhr ) => {
//                 const loadingPercentage = Math.ceil(xhr.loaded / xhr.total * 100);
//                 console.log( ( loadingPercentage ) + '% loaded' );

//                 // update parent react component to display loading percentage
//                 this.props.onProgress(loadingPercentage);
//             },
//             // called when loading has errors
//              ( error ) => {
//                 console.log( 'An error happened:' + error );
//             });
// 		}
// }

//   useEffect(()=>{
// 	  load();
//   }, [model]);

//   return (
//     <Canvas>
//       <OrbitControls />
//       <Stars></Stars>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 15, 10]} angle={0.3} />
//       <Box />
//     </Canvas>
//   );
// }
