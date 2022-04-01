import React from "react";
import { useMaterial } from "../contexts/MaterialContext";
import { useModel } from "../contexts/ModelContext";

import "../index.css";

export default function Demo() {
  const {
    hasModel,
    metaData,
    modelSize,
    fileName,
    loadModel,
    clearModel,
    progress,
  } = useModel();

  const { materials, currentMaterial, setMaterial } = useMaterial();

  function onMaterialSelect(index) {
    setMaterial(materials[index]);
  }

  function clear() {
    function removeFadeOut(el, speed) {
      var seconds = speed / 1000;
      el.style.transition = "opacity " + seconds + "s ease";
      el.style.opacity = 0;
      setTimeout(function () {}, speed);
    }
    const duration = 200;
    removeFadeOut(document.getElementById("printControlSection"), duration);
    removeFadeOut(document.getElementById("fullSpaceSection"), duration);

    setTimeout(() => {
      clearModel();
    }, duration);
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

  let estimated = "";
  let filamentUsage = "";
  let grams = "";
  let costs = "";
  if (metaData) {
    const estimatedTime = `${Math.floor(
      metaData.printTime / 3600
    )}h ${Math.floor((metaData.printTime % 3600) / 60)}m ${Math.floor(
      (metaData.printTime % 3600) % 60
    )}s`;

    const cm3 = metaData.filamentUsage / 1000.0;
    const gram = cm3 * 1.24;
    const euros = gram * 0.001 * 25; // 25€ für 1kg

    filamentUsage = `Filamentnutzung: ${round2(cm3)}cm³`;
    grams = `Materialnutzung: ${round2(gram)}g`;
    estimated = `Druckzeit: ${estimatedTime}`;
    costs = `Kosten: ${round2(euros)}€`;
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
      <div className="printControl" id="printControlSection">
        <small className="bottomRightFixed">
          <i>{fileName}</i>
        </small>
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
        {progress < 100 ? (
          <>
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            {progress} % <i>(slicing) </i>
          </>
        ) : (
          <ul className="infoBox noList">
            <dt>Abmessungen</dt>
            <li>{sizeString}</li>
            <dt>Abmessungen</dt>
            <li>{estimated}</li>
            <dt>Abmessungen</dt>
            <li>{filamentUsage}</li>
            <dt>Abmessungen</dt>
            <li>{grams}</li>
            <dt>Abmessungen</dt>
            <li>{costs}</li>
          </ul>
        )}
      </div>
    );
  }
  return (
    <>
      {/* <input type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
      {/* {materials.map((material) => {
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
      })} */}
    </>
  );
}
