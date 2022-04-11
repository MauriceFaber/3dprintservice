import React, { useState, useEffect } from "react";
import { useMaterial } from "../contexts/MaterialContext";
import { useModel } from "../contexts/ModelContext";
import { useShoppingCart } from "../contexts/ShoppingCartContext";

import "../index.css";

export default function Demo() {
  const {
    hasModel,
    metaData,
    modelSize,
    fileName,
    modelFile,
    loadModel,
    clearModel,
    progress,
  } = useModel();

  const { materials, currentMaterial, setMaterial } = useMaterial();
  const [singlePrice, setSinglePrice] = useState(0);
  const { addPosition } = useShoppingCart();

  function getPriceFromGrams(filamentUsage) {
    const cm3 = filamentUsage / 1000.0;
    const gram = cm3 * 1.24;
    const euros = gram * 0.001 * 25; // 25€ für 1kg
    return { cm3, gram, euros };
  }

  function onMaterialSelect(index) {
    setMaterial(materials[index]);
  }

  function addToCart() {
    addPosition(modelFile, fileName, 1, singlePrice, currentMaterial);
  }

  useEffect(() => {
    if (metaData) {
      setSinglePrice(getPriceFromGrams(metaData.filamentUsage).euros);
    }
  }, [metaData]);

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
    sizeString = `${Math.ceil(modelSize.x)}x${Math.ceil(
      modelSize.y
    )}x${Math.ceil(modelSize.z)}mm`;
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

    const { cm3, gram, euros } = getPriceFromGrams(metaData.filamentUsage);

    filamentUsage = `${round2(cm3)}cm³`;
    grams = `${round2(gram)}g`;
    estimated = `${estimatedTime}`;
    costs = `${round2(euros)}€`;
  }

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  if (!materials || materials.length === 0) {
    return null;
  }

  for (var i = 0; i < materials.length; i++) {
    materials[i].index = i;
  }
  const groupedMaterials = groupBy(materials, "material");
  console.log(groupedMaterials);

  if (!hasModel) {
    return null;
  }
  if (hasModel) {
    return (
      <>
        <small className="bottomRightFixed disable-select">
          <i>{fileName}</i>
        </small>
        <div className="printControl" id="printControlSection">
          <input type="button" value="Unload" onClick={() => clear()} />
          <input
            type="button"
            value="Add to Cart"
            onClick={() => addToCart()}
          />
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
            <optgroup label="TPU">
              {groupedMaterials.TPU.map((material) => {
                return (
                  <option key={material.name} value={material.index}>
                    {material.name}
                  </option>
                );
              })}
            </optgroup>
            <optgroup label="TPC">
              {groupedMaterials.TPC.map((material) => {
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
          ) : null}
        </div>
        {progress === 100 ? (
          <ul className="infoBox noList disable-select">
            <li>
              <b>Measurements</b> {sizeString}
            </li>
            <li>
              <b>Print time</b> {estimated}
            </li>
            <li>
              <b>Material usage</b> {filamentUsage}
            </li>
            <li>
              <b>Weight</b> {grams}
            </li>
            <li>
              <b>Costs</b> {costs}
            </li>
          </ul>
        ) : null}
      </>
    );
  }
}
