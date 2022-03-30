import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import MaterialProvider from "./contexts/MaterialContext";
import ModelProvider from "./contexts/ModelContext";

ReactDOM.render(
  <MaterialProvider>
    <ModelProvider>
      <App />
    </ModelProvider>
  </MaterialProvider>,
  document.getElementById("root")
);
