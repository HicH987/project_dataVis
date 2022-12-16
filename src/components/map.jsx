import "./map.scss";
import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";
import { useMapTools } from "../hooks/useMapTools";
import * as handlers from "../handlers/mapHandler";
import * as ai from "react-icons/ai";

// check if object is: "{}" OR "don't exist"
const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

let margin;
let width, height;
let innerWidth, innerHeight;
let zoom;
let z;

let fontSize = 8;
let fSize = fontSize;
const zoomed = (event, refG) => {
  const g = d3.select(refG.current);

  d3.select("svg").selectAll("path").attr("transform", event.transform);
  d3.select("svg").selectAll("text").attr("transform", event.transform);

  let zoomInOut = -1 * Math.sign(event.sourceEvent.deltaY);

  if (zoomInOut === 1) fSize > 1 ? (fSize = fSize - 0.2) : (fSize = 1);
  else if (zoomInOut === -1) {
    if (fSize < fontSize) fSize = fSize + 0.1;
    else fSize = fontSize;
  }

  g.selectAll(".bat").attr("font-size", `${fSize}pt`);
};

const convertToNum = (listStr) => {
  const w = parseFloat(listStr[0]);
  const h = parseFloat(listStr[1]);
  return [w, h];
};

const initCanvasDim = (width, height) => {
  margin = { top: 10, right: 20, bottom: 10, left: 20 };
  innerWidth = width - (margin.left + margin.right);
  innerHeight = height - (margin.bottom + margin.top);
};

const initCanvas = (refSvg, refG) => {
  const svg = d3.select(refSvg.current).attr("class", "main-svg");

  [width, height] = convertToNum([svg.style("width"), svg.style("height")]);
  initCanvasDim(width, height);

  z = d3
    .zoom()
    .scaleExtent([1, 50])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", handlers.zoomed);

  zoom = d3
    .zoom()
    .scaleExtent([1, 50])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", (e) => zoomed(e, refG));
  svg.call(zoom);

  const g = d3
    .select(refG.current)
    .attr("class", "main-g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
};

const pathMap = (mapData) => {
  let projection = d3
    .geoIdentity()
    .angle([25])
    .reflectY(true)
    .fitSize([innerWidth, innerHeight], mapData.data);

  return d3.geoPath(projection);
};

const renderMap = (refG, mapData) => {
  const g = d3.select(refG.current);

  if (!mapData.loading) {
    var path = pathMap(mapData);

    g.append("g")
      .selectAll("path")
      .data(mapData.data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", (d) => {
        if (isEmpty(d.properties.fill)) return "#B5B09A";
        return d.properties.fill;
      })
      .style("stroke-width", "0.3")
      .style("stroke", "black")
      .style("vector-effect", "non-scaling-stroke");

    g.append("g")
      .selectAll("text")
      .data(mapData.data.features)
      .enter()
      .append("text")
      .attr("class", "bat")
      .text((d) => {
        if (Object.keys(d.properties).length === 2 && !d.properties.floor1) {
          return d.properties.bat;
        }
      })
      .attr("x", (d) => path.centroid(d)[0])
      .attr("y", (d) => path.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("font-size", `${fontSize}px`)
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .style(
        "text-shadow",
        "0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black"
      );
  }
};

const courMapData = (mapData, courData) => {
  return mapData.data.features.filter(
    (d) =>
      d.properties.bat === courData.bat &&
      d.properties[courData.floor] == courData.loc
  );
};
const groupsMapData = (mapData, groupsData) => {
  let data = [];
  for (const [key, value] of Object.entries(groupsData)) {
    data.push(
      mapData.data.features.filter(
        (d) =>
          d.properties.bat == value.bat &&
          d.properties[value.floor] == value.loc.substring(3, 6)
      )[0]
    );
  }
  return data;
};

const renderSchedule = (refG, mapData, props) => {
  const g = d3.select(refG.current);
  let path = pathMap(mapData);

  if (!mapData.loading) {
    try {
      g.selectAll(".toDlt").remove()
    }
    catch(err) {
      console.log(err);
    }
    if (props.courData) {
      var crMapData = courMapData(mapData, props.courData);
      console.log("data", crMapData);

      g.append("g")
        .selectAll("path")
        .data(crMapData)
        .enter()
        .append("path")
        .attr("class", "toDlt")
        .attr("d", path)
        .style("fill", (d) => (d.properties.floor1 ? "#0ebeff" : "#5e95e6"))
        .style("stroke-width", "0.1")
        .style("stroke", "black");
    }
    if (props.groupsData) {
      var grMapData = groupsMapData(mapData, props.groupsData);
      console.log("grMapData", grMapData);

      g.append("g")
        .selectAll("path")
        .data(grMapData)
        .enter()
        .append("path")
        .attr("class", "toDlt")
        .attr("d", path)
        .style("fill", (d) => (d.properties.floor1 ? "#0ebeff" : "#5e95e6"))
        .style("stroke-width", "0.1")
        .style("stroke", "black");
    }
  }
};

export default function Map(props) {
  const { mapData } = useMapTools("../../data/usthb-3.geojson");
  const refSvg = useRef();
  const refG = useRef();

  useEffect(() => initCanvas(refSvg, refG), []);
  useEffect(() => renderMap(refG, mapData), [mapData]);

  useEffect(() => renderSchedule(refG, mapData, props), [props]);

  return (
    <div className="map" id="wrapper">
      <svg ref={refSvg}>
        {" "}
        <g ref={refG}></g>
      </svg>
      <dir className="btns">
        <button className="btn-plus" onClick={() => handlers.btnZoomIn(z)}>
          <ai.AiOutlinePlus />
        </button>
        <button className="btn-minus" onClick={() => handlers.btnZoomOut(z)}>
          <ai.AiOutlineMinus />
        </button>
        <button className="btn-left" onClick={() => handlers.btnLeft(z)}>
          <ai.AiOutlineCaretLeft />
        </button>
        <button className="btn-right" onClick={() => handlers.btnRight(z)}>
          <ai.AiOutlineCaretRight />
        </button>
        <button className="btn-up" onClick={() => handlers.btnUp(z)}>
          <ai.AiOutlineCaretUp />
        </button>
        <button className="btn-down" onClick={() => handlers.btnDown(z)}>
          <ai.AiOutlineCaretDown />
        </button>
      </dir>
    </div>
  );
}
