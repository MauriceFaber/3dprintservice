import React, { useState } from "react";
import createCtx from "./Index";

export const [useModel, CtxProvider] = createCtx();

export default function ModelProvider(props) {
  const [loading, setLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [modelFile, setModelFile] = useState(null);
  const [model, setModel] = useState(null);
  const [fileName, setFileName] = useState("");

  const [modelSize, setSize] = useState();
  const [progress, setProgressIntern] = useState(0);
  const [metaData, setMetadata] = useState();

  const setModelSize = (size) => {
    setSize(size);
  };

  const setMetaData = (meta) => {
    setMetadata(meta);
  };

  const setProgress = (perc) => {
    setProgressIntern(perc);
  };

  const loadModel = async (fileName, file) => {
    try {
      setLoading(true);
      setFileName(fileName);
      setModelFile(file);
      setHasModel(true);
      setModel({});
      //todo load into model
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearModel = () => {
    try {
      setLoading(true);
      setHasModel(false);
      setFileName("");
      setModelFile(null);
      setModel(null);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    loading,
    hasModel,
    model,
    fileName,
    modelFile,
    modelSize,
    metaData,
    progress,
    loadModel,
    clearModel,
    setModelSize,
    setMetaData,
    setProgress,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
