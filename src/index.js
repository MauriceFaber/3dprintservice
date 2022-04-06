import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import MaterialProvider from "./contexts/MaterialContext";
import ModelProvider from "./contexts/ModelContext";
import ShoppingCartProvider from "./contexts/ShoppingCartContext";

ReactDOM.render(
  <ShoppingCartProvider>
    <MaterialProvider>
      <ModelProvider>
        <App />
      </ModelProvider>
    </MaterialProvider>
  </ShoppingCartProvider>,
  document.getElementById("root")
);
