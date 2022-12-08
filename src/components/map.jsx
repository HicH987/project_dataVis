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

// G groupe (of main SVG) dimensions
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

  // console.log(mapData.data);
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
        // if (d.properties.type === "eau") return "#75cff0";
        // if (d.properties.type === "batiment") return "#e5e3df";
        // if (d.properties.type === "garden") return "#aae08f";
        // if (d.properties.type === "road") return "#ffffff";
        // return "none";
        return d.properties.fill
      })
      .style("stroke-width", "1")
      .style("stroke", "black");
    /*
      g.append("g")
      .selectAll("text")
      .data(mapData.data.features)
      .enter()
      .append("text")
      .text((d) => {
        if (d.properties.name != null) return d.properties.name;
      })
      .attr("text-anchor", "middle")
      .attr("x", (d) => path.centroid(d)[0])
      .attr("y", (d) => path.centroid(d)[1])
      .attr("font-size", "7px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .style(
        "text-shadow",
        "0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black"
        );
*/
  }
};

export default function Map() {
  // const { mapData } = useMapTools("../../data/elhamma.geojson");
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
