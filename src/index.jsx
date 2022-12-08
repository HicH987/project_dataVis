import React from "react";
import ReactDOM from "react-dom/client";

import Header from "./components/header";
import App from "./components/app";


import "./index.scss";

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);



root.render(
  <React.StrictMode>
    <Header />
    <App/>
  </React.StrictMode>
);


