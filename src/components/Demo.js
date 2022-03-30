import React, { useEffect } from "react";
import { useMaterial } from "../contexts/MaterialContext";
import { useModel } from "../contexts/ModelContext";

export default function Demo() {
  const {
    loading,
    hasModel,
    model,
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
    return (
      <div>
        Model: {fileName} loaded.{" "}
        <div>
          <h3>
            Abmessungen: <small>{sizeString}</small>
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

  return <input type="file" onChange={(e) => setFile(e.target.files[0])} />;
}
