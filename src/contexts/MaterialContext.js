import React, { useState, useEffect } from "react";
import createCtx from "./Index";

export const [useMaterial, CtxProvider] = createCtx();

export default function MaterialProvider(props) {
  const [materials, setMaterials] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState(null);

  useEffect(() => {
    let filaments = require("./materials.json");
    setMaterials(filaments);
  }, []);

  useEffect(() => {
    console.log(materials);
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
