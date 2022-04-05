import React, { useState, useEffect } from "react";
import createCtx from "./Index";

export const [useModel, CtxProvider] = createCtx();

export default function ModelProvider(props) {
  const [loading, setLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [modelFile, setModelFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [modelSize, setSize] = useState();
  const [progress, setProgressIntern] = useState(0);
  const [metaData, setMetadata] = useState();

  useEffect(async () => {
    await reloadFile();
  }, []);

  const setModelSize = (size) => {
    setSize(size);
  };

  const setMetaData = (meta) => {
    setMetadata(meta);
  };

  const setProgress = (perc) => {
    setProgressIntern(perc);
  };

  const reloadFile = async () => {
    await loadFromLocalStorage();
  };

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], { type: mimeString });
  }

  async function saveToLocalStorage(fileName, file) {
    if (!fileName || !file) {
      localStorage.removeItem("3d_model_fileName");
      localStorage.removeItem("3d_model_file");
    } else {
      const buffer = await readFileAsync(file);
      localStorage.setItem("3d_model_fileName", fileName);
      localStorage.setItem("3d_model_file", buffer);
    }
  }

  async function loadFromLocalStorage() {
    let file = localStorage.getItem("3d_model_file");
    let fileName = localStorage.getItem("3d_model_fileName");

    if (file && fileName) {
      const blob = dataURItoBlob(file);
      setFileName(fileName);
      setModelFile(blob);
      setHasModel(true);
    } else {
      setHasModel(false);
      setModelFile(null);
      setFileName(null);
    }
  }

  const loadModel = async (fileName, file) => {
    try {
      setLoading(true);
      await saveToLocalStorage(fileName, file);
      await loadFromLocalStorage();
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearModel = async () => {
    try {
      setLoading(true);
      await saveToLocalStorage(null, null);
      await loadFromLocalStorage();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    loading,
    hasModel,
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
    reloadFile,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
