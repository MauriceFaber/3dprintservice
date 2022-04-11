import React, { useState, useEffect } from "react";
import createCtx from "./Index";

export const [useMaterial, CtxProvider] = createCtx();
let materialLoaded = false;
export default function MaterialProvider(props) {
  const [materials, setMaterials] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState(null);

  useEffect(async () => {
    const domainInfo = require("./domain.json");
    const testMode = true;
    const domain = testMode ? domainInfo.testDomain : domainInfo.domain;
    const res = await fetch(domain + "/materials");
    const asJson = await res.json();
    console.log(asJson);
    if (res.ok) {
      setMaterials(asJson);
    }
  }, []);

  useEffect(() => {
    if (materials) {
      var success = false;
      const storedName = localStorage.getItem("selected_material_name");
      if (storedName) {
        const mat = materials.find((m) => m.name === storedName);
        if (mat) {
          setCurrentMaterial(mat);
          success = true;
        }
      }
      if (!success) {
        setCurrentMaterial(materials[0]);
      }
    }
  }, [materials]);

  const setMaterial = (material) => {
    setCurrentMaterial(material);
    localStorage.setItem("selected_material_name", material.name);
  };

  const contextValue = {
    materials,
    currentMaterial,
    setMaterial,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
