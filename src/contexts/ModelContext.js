import React, { useState, useEffect } from "react";
import createCtx from "./Index";
import Localbase from "localbase";

export const [useModel, CtxProvider] = createCtx();

export default function ModelProvider(props) {
  const [loading, setLoading] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [modelFile, setModelFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [modelSize, setSize] = useState();
  const [progress, setProgressIntern] = useState(0);
  const [metaData, setMetadata] = useState();

  const db = new Localbase("db");
  db.config.debug = false;

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

  const dataURItoBlob = (dataURI) => {
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
  };

  async function saveToLocalStorage(fileName, file) {
    if (!fileName || !file) {
      await db.collection("3d_model").doc({ id: 1 }).delete();
    } else {
      let tmpFile = await db.collection("3d_model").doc({ id: 1 }).get();
      if (tmpFile) {
        await db.collection("3d_model").doc({ id: 1 }).update({ data: file });
      } else {
        await db.collection("3d_model").add({ id: 1, data: file });
      }
    }
  }

  async function loadFromLocalStorage() {
    let file = await db.collection("3d_model").doc({ id: 1 }).get();

    if (file && file.data) {
      setFileName(file.data.name);
      setModelFile(file.data);
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
    dataURItoBlob,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
