import React, { useState } from "react";
import AppViewer from "./components/AppViewer";
import { useMaterial } from "./contexts/MaterialContext";
import { useModel } from "./contexts/ModelContext";

export default function Container() {
  const { hasModel, fileName, modelFile } = useModel();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const { currentMaterial } = useMaterial();

  if (!currentMaterial) {
    return <div>loading</div>;
  }

  return (
    <>
      {hasModel && (
        <AppViewer modelFile={modelFile} currentMaterial={currentMaterial} />
      )}
      {hasModel && loadingPercentage === 100 && (
        <div>Scroll to zoom, drag to rotate</div>
      )}
      {hasModel && loadingPercentage !== 100 && (
        <div>Loading Model: {loadingPercentage}%</div>
      )}
    </>
  );
}
