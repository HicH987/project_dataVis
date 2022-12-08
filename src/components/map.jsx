import "./map.scss";
import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";
import { useMapTools } from "../hooks/useMapTools";
import * as handlers from "../handlers/mapHandler";
import {
  AiOutlineCaretDown,
  AiOutlineCaretLeft,
  AiOutlineCaretUp,
  AiOutlineCaretRight,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";

let margin;
let width, height;
let innerWidth, innerHeight;
let zoom;

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

const initCanvas = (ref) => {
  const svg = d3.select(ref.current).attr("class", "main-svg");
  [width, height] = convertToNum([svg.style("width"), svg.style("height")]);
  initCanvasDim(width, height);
  zoom = d3
    .zoom()
    .scaleExtent([1, 10])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", handlers.zoomed);
  svg.call(zoom);
};
const renderMap = (ref, mapData) => {
  const svg = d3.select(ref.current);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  if (!mapData.loading) {
    var projection = d3
      .geoIdentity()
      .angle([25])
      .reflectY(true)
      .fitSize([innerWidth, innerHeight], mapData.data);

    var path = d3.geoPath(projection);
    g.append("g")
      .selectAll("path")
      .data(mapData.data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", (d) => {
        return d.properties.fill;
      })
      .style("stroke-width", "1")
      .style("stroke", "black");
  }
};

export default function Map() {
  const { mapData } = useMapTools("../../data/usthb.geojson");
  const ref = useRef();

  useEffect(() => initCanvas(ref), []);
  useEffect(() => renderMap(ref, mapData), [mapData]);

  return (
    <div className="map" id="wrapper">
      <svg ref={ref}></svg>
      <dir className="btns">
        <button className="btn-plus" onClick={() => handlers.btnZoomIn(zoom)}>
          <AiOutlinePlus />
        </button>
        <button className="btn-minus" onClick={() => handlers.btnZoomOut(zoom)}>
          <AiOutlineMinus />
        </button>
        <button className="btn-left" onClick={() => handlers.btnLeft(zoom)}>
          <AiOutlineCaretLeft />
        </button>
        <button className="btn-right" onClick={() => handlers.btnRight(zoom)}>
          <AiOutlineCaretRight />
        </button>
        <button className="btn-up" onClick={() => handlers.btnUp(zoom)}>
          <AiOutlineCaretUp />
        </button>
        <button className="btn-down" onClick={() => handlers.btnDown(zoom)}>
          <AiOutlineCaretDown />
        </button>
      </dir>
    </div>
  );
}
