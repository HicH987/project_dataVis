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

import * as d3 from "d3";

// d3.json("../data/schedule.json").then((json) => {
//   console.log("schedule:\n",json);
// });
d3.json("../data/sch.json").then((json) => {
  console.log("schedule:\n",json);

  console.log(json.IV.M1.S1.Dim[0]);
  // console.log(json.speciamot);
});
