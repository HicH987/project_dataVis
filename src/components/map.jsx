import React from "react";
import { useRef, useEffect } from "react";

import * as ai from "react-icons/ai";
import { GoThreeBars } from "react-icons/go";
import { MdFilterCenterFocus } from "react-icons/md";

import EventsDay from "./eventsDay";
import { useGetDataFrom } from "../hooks/useGetDataFrom";

import * as zoomHandlers from "../handlers/mapZoomHandler";
import { renderMap } from "../handlers/mapRender";
import { initCanvas } from "../handlers/mapInitCanvas";
import { deleteAllResult } from "../handlers/mapRenderResult.js";

import { glob } from "../global/var";

import "./map.scss";
import { isEmpty } from "lodash";
// ---------------------------------------------------------

export default function Map(props) {
  const mapData = useGetDataFrom("../../data/usthb-3.geojson");
  const refSvg = useRef();
  const refG = useRef();
  const [displayEventsList, setDisplayEventsList] = React.useState(true);
  const [displayProfEvntList, setDisplayProfEvntList] = React.useState(true);
  const [displaySpecList, setDisplaySpecList] = React.useState(true);

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
    deleteAllResult();
    if (props.dayData) {
      props.setShowSdBar(true);
      setDisplayEventsList(true);
    } else setDisplayEventsList(false);
  }, [props.dayData]);

  useEffect(() => {
    deleteAllResult();
    if (!isEmpty(props.teacherEvents)) {
      setDisplayProfEvntList(true);
    } else setDisplayProfEvntList(false);
  }, [props.teacherEvents]);

  useEffect(() => {
    deleteAllResult();
    if (!isEmpty(props.specEvents)) {
      setDisplaySpecList(true);
    } else setDisplaySpecList(false);
  }, [props.specEvents]);

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

        <div className={props.showSdBar ? "side-div" : "side-div-hide"}>
          <button
            className="side-btn"
            onClick={() => props.setShowSdBar((prev) => !prev)}
          >
            <GoThreeBars />
          </button>

          <div className={props.showSdBar ? "sidebar" : "sidebar-hide"}>
            <div>
              <div>
                <div
                  className="sidebar-title"
                  onClick={() => setDisplayEventsList((prev) => !prev)}
                >
                  <span className="current-day">
                    {" "}
                    {!props.day ? "Day's" : props.day}{" "}
                  </span>
                  Events
                </div>
                <div
                  className="list-event"
                  style={displayEventsList ? {} : { display: "none" }}
                >
                  {!props.dayData ? (
                    <EmptyList />
                  ) : (
                    <EventsDay
                      mapData={mapData}
                      day={props.dayData}
                      teacherEvents={null}
                    />
                  )}
                </div>
              </div>

              <div>
                <div
                  className="sidebar-title"
                  onClick={() => setDisplayProfEvntList((prev) => !prev)}
                >
                  <span className="current-day"> Teacher </span>Events
                </div>
                <div
                  className="list-event"
                  style={displayProfEvntList ? {} : { display: "none" }}
                >
                  {isEmpty(props.teacherEvents) ? (
                    <EmptyList />
                  ) : (
                    <EventsDay
                      mapData={mapData}
                      day={null}
                      teacherEvents={props.teacherEvents}
                    />
                  )}
                </div>
              </div>

              <div>
                <div
                  className="sidebar-title"
                  onClick={() => setDisplaySpecList((prev) => !prev)}
                >
                  &nbsp;&nbsp;All
                  <span className="current-day">
                    {" "}
                    {!isEmpty(props.specEvents)
                      ? `${props.specEvents[0].spc}-${props.specEvents[0].lvl}`
                      : ""}
                  </span>
                  &nbsp; Events
                </div>
                <div
                  className="list-event"
                  style={displaySpecList ? {} : { display: "none" }}
                >
                  {isEmpty(props.specEvents) ? (
                    <EmptyList />
                  ) : (
                    <EventsDay
                      mapData={mapData}
                      day={null}
                      teacherEvents={props.specEvents}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tooltip" style={tip_style}></div>
      <div className="classtip" style={tip_style}></div>
    </div>
  );
}
function EmptyList() {
  return (
    <div className="empty-list">
      <img src="../../assets/no-task.png" />
      <div className="txt">
        <p className="txt-1">Empty Events's List</p>
        <p className="txt-2">Please Run a Search</p>
      </div>
    </div>
  );
}
