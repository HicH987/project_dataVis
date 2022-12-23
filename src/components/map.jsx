import React from "react";
import * as ai from "react-icons/ai";
import { MdFilterCenterFocus } from "react-icons/md";
import { useRef, useEffect } from "react";
import EventsDay from "./eventsDay";
import { useGetDataFrom } from "../hooks/useGetDataFrom";

import * as zoomHandlers from "../handlers/mapZoomHandler";
import { renderMap } from "../handlers/mapRender";
import { initCanvas } from "../handlers/mapInitCanvas";
import { renderSchedule } from "../handlers/mapRenderResult.js";

import { glob } from "../global/var";

import "./map.scss";
// ---------------------------------------------------------

export default function Map(props) {
  const mapData = useGetDataFrom("../../data/usthb-3.geojson");
  const refSvg = useRef();
  const refG = useRef();

  const tip_style = {
    visibility: "hidden",
    position: "absolute",
    zindex: 10,
  };

  useEffect(() => {
    initCanvas(refSvg, refG);
  }, []);

  useEffect(() => {
    renderMap(mapData);
  }, [mapData]);

  useEffect(() => {
    if (props.courData) renderSchedule(mapData, props.courData, false);
  }, [props.courData]);
  useEffect(() => {
    if (props.groupsData) renderSchedule(mapData, props.groupsData, false);
  }, [props.groupsData]);

  return (
    <div className="map" id="wrapper">
      <div className="map-day">
        <svg ref={refSvg}>
          {" "}
          <g ref={refG}></g>
        </svg>
        <dir className="btns">
          <div className="move-btn">
            <button
              className="btn-z left"
              onClick={() => zoomHandlers.btnLeft(glob.zoom)}
            >
              <ai.AiOutlineCaretLeft />
            </button>
            <button
              className="btn-z center"
              onClick={() => zoomHandlers.btnCenter(glob.zoom)}
            >
              <MdFilterCenterFocus />
            </button>
            <button
              className="btn-z right"
              onClick={() => zoomHandlers.btnRight(glob.zoom)}
            >
              <ai.AiOutlineCaretRight />
            </button>

            <button
              className="btn-z up"
              onClick={() => zoomHandlers.btnUp(glob.zoom)}
            >
              <ai.AiOutlineCaretUp />
            </button>

            <button
              className="btn-z down"
              onClick={() => zoomHandlers.btnDown(glob.zoom)}
            >
              <ai.AiOutlineCaretDown />
            </button>
          </div>

          <div className="zoom-btn">
            <button
              className="btn-z plus"
              onClick={() => zoomHandlers.btnZoomIn(glob.zoom)}
            >
              <ai.AiOutlinePlus />
            </button>
            <button
              className="btn-z minus"
              onClick={() => zoomHandlers.btnZoomOut(glob.zoom)}
            >
              <ai.AiOutlineMinus />
            </button>
          </div>
        </dir>

        {props.dayData ? (
          <EventsDay mapData={mapData} day={props.dayData} />
        ) : (
          <></>
        )}
      </div>
      <div className="tooltip" style={tip_style}></div>
      <div className="classtip" style={tip_style}></div>
    </div>
  );
}
