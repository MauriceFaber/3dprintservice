import React, { useState, useEffect } from "react";
import createCtx from "./Index";

export const [useMaterial, CtxProvider] = createCtx();
let materialLoaded = false;
export default function MaterialProvider(props) {
  const [materials, setMaterials] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState(null);

  if (!materialLoaded) {
    setMaterials(require("./materials.json"));
    materialLoaded = true;
  }

  useEffect(() => {
    if (materials) {
      setCurrentMaterial(materials[0]);
    }
  }, [materials]);

  const setMaterial = (material) => {
    setCurrentMaterial(material);
  };

  const contextValue = {
    materials,
    currentMaterial,
    setMaterial,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
