import React, { useEffect } from "react";
import { useMaterial } from "../contexts/MaterialContext";
import { useModel } from "../contexts/ModelContext";

import "../index.css";

export default function Demo() {
  const {
    loading,
    hasModel,
    model,
    metaData,
    modelSize,
    fileName,
    loadModel,
    clearModel,
  } = useModel();

  const { materials, currentMaterial, setMaterial } = useMaterial();

  function onMaterialSelect(index) {
    setMaterial(materials[index]);
  }

  function setFile(file) {
    loadModel(file.name, file);
  }

  function clear() {
    clearModel();
  }

  let sizeString = "";
  if (modelSize) {
    sizeString = `l: ${Math.ceil(modelSize.x)}mm b: ${Math.ceil(
      modelSize.y
    )}mm h: ${Math.ceil(modelSize.z)}mm`;
  }

  function round2(value) {
    return Math.round(value * 100) / 100;
  }

  let metaString = "";
  if (metaData) {
    const estimatedTime = `${Math.floor(
      metaData.printTime / 3600
    )}h ${Math.floor((metaData.printTime % 3600) / 60)}m ${Math.floor(
      (metaData.printTime % 3600) % 60
    )}s`;

    const cm3 = metaData.filamentUsage / 1000.0;
    const grams = cm3 * 1.24;
    const euros = grams * 0.001 * 25; // 25€ für 1kg
    metaString = `Filamentnutzung: ${round2(cm3)}cm³, ${round2(
      grams
    )}g Material, Druckzeit: ${estimatedTime}, Kosten: ${round2(euros)}€`;
  }

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  for (var i = 0; i < materials.length; i++) {
    materials[i].index = i;
  }
  const groupedMaterials = groupBy(materials, "material");

  if (hasModel) {
    // console.log(materials);
    return (
      <div>
        Model: {fileName} loaded.{" "}
        <div>
          <h3>
            Abmessungen: <small>{sizeString}</small>
          </h3>
          <h3>
            Druckinfo: <small>{metaString}</small>
          </h3>
        </div>
        <input type="button" value="Leeren" onClick={() => clear()} />
        <select
          value={materials.indexOf(currentMaterial)}
          onChange={(e) => onMaterialSelect(e.currentTarget.value)}
        >
          <optgroup label="PLA">
            {groupedMaterials.PLA.map((material) => {
              return (
                <option key={material.name} value={material.index}>
                  {material.name}
                </option>
              );
            })}
          </optgroup>
          <optgroup label="PETG">
            {groupedMaterials.PETG.map((material) => {
              return (
                <option key={material.name} value={material.index}>
                  {material.name}
                </option>
              );
            })}
          </optgroup>
        </select>
      </div>
    );
  }

  return (
    <>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      {materials.map((material) => {
        return (
          <div
            className="rectangle"
            style={{ backgroundColor: material.color }}
            key={material.name + "box"}
            value={material.index}
          >
            {material.name}
          </div>
        );
      })}
    </>
  );
}
