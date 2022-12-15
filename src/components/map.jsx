import "./map.scss";
import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";
import { useMapTools } from "../hooks/useMapTools";
import * as handlers from "../handlers/mapHandler";
import { AiOutlineCaretDown, AiOutlineCaretLeft, AiOutlineCaretUp, AiOutlineCaretRight, AiOutlineMinus, AiOutlinePlus} from "react-icons/ai";
// check if object is: "{}" OR "don't exist"
const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

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

const initCanvas = (refSvg, refG) => {
  const svg = d3.select(refSvg.current).attr("class", "main-svg");

  [width, height] = convertToNum([svg.style("width"), svg.style("height")]);
  initCanvasDim(width, height);

  zoom = d3
    .zoom()
    .scaleExtent([1, 50])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", handlers.zoomed);
  svg.call(zoom);

  const g = d3
    .select(refG.current)
    .attr("class", "main-g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
};

const renderMap = (refG, mapData) => {
  const g = d3.select(refG.current);

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
        if(isEmpty(d.properties.fill)) return "#B5B09A"
        return d.properties.fill;
      })
      .style("stroke-width", "0.3")
      .style("stroke", "black")
      .style("vector-effect", "non-scaling-stroke");
  }
};

const renderSchedule = (refG, mapData, props) => {
  const g = d3.select(refG.current);

  if (!mapData.loading) {
    var projection = d3
      .geoIdentity()
      .angle([25])
      .reflectY(true)
      .fitSize([innerWidth, innerHeight], mapData.data);

    var path = d3.geoPath(projection);

    if (props.scheduleData) {
      const scData = !isEmpty(props.scheduleData.cours)
        ? props.scheduleData.cours
        : props.scheduleData.groups;
      const data = mapData.data.features.filter(
        (d) =>
          d.properties.bat === scData.G1.bat &&
          d.properties.floor1 == scData.G1.loc
      );
      console.log(data);

      g.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", (d) => {
          return "white";
        })
    }
  }
};

export default function Map(props) {
  const { mapData } = useMapTools("../../data/usthb-3.geojson");
  const refSvg = useRef();
  const refG = useRef();

  useEffect(() => initCanvas(refSvg, refG), []);
  useEffect(() => renderMap(refG, mapData), [mapData]);

  // useEffect(() => {console.log(props.scheduleData);}, [props]);
  useEffect(() => renderSchedule(refG, mapData, props), [props]);

  return (
    <div className="map" id="wrapper">
      <svg ref={refSvg}>
        {" "}
        <g ref={refG}></g>
      </svg>
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
