import React from "react";
import ReactDOM from "react-dom/client";

import Header from "./components/header";
import Form from "./components/form";
import Map from "./components/map";

import "./index.scss";

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <Header />
    <div className="main-app">
      <Map />
      <Form />
    </div>
  </React.StrictMode>
);
