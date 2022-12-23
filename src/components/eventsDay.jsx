import * as d3 from "d3";
import React from "react";
import { isEmpty } from "lodash";
import { glob } from "../global/var";
import { gClass } from "../global/const";
import { filtreMapDataBy } from "../handlers/filtreHandlers";
import { renderSchedule } from "../handlers/mapRenderResult.js";
import "./eventsDay.scss";

const onZoomResult = (mapData, courData) => {
  let d = filtreMapDataBy.cour(mapData, courData)[0];
  var centroid = glob.path.centroid(d);

  const width = parseFloat(d3.select(`svg`).style("width"));
  const height = parseFloat(d3.select(`svg`).style("height"));

  let k = 8;
  let x = width / 2 - centroid[0] * k;
  let y = height / 2 - centroid[1] * k;

  let transform = d3.zoomIdentity.translate(x, y).scale(k);

  d3.select(`svg`)
    .transition()
    .duration(700)
    .call(glob.zoom.transform, transform);
};

export default function EventsDay(props) {
  const el = props.day.map((d, idx) => {
    if (!isEmpty(d.cours))
      return <CourEvent key={idx} mapData={props.mapData} c={d.cours} />;

    if (!isEmpty(d.groups))
      return (
        <GroupsEvent key={idx} mapData={props.mapData} groups={d.groups} />
      );
  });
  return <div className="EventsDay">{el}</div>;
}

function GroupsEvent(props) {
  let arr = Object.keys(props.groups).map((k) => props.groups[k]);
  const groupsEl = arr.map((g, idx) => {
    return (
      <GroupEvent key={idx} mapData={props.mapData} gIdx={idx + 1} g={g} />
    );
  });

  return (
    <div className="GroupsEvent">
      <li className="time-label">{arr[0].time}</li>
      {groupsEl}
    </div>
  );
}

const onClickStyle = {
  color: "#000",
  backgroundColor: "#fff",
};

function GroupEvent(props) {
  const [toDltID, setToDltID] = React.useState("");
  const [isClicked, setClicked] = React.useState(true);

  const clicked = () => {
    setClicked((prevState) => !prevState);
    isClicked
      ? setToDltID(renderSchedule(props.mapData, { [group]: props.g }, true))
      : d3.select(`.${gClass}`).select(`#${toDltID}`).remove();

    onZoomResult(props.mapData, props.g);
  };

  const group = `G${props.gIdx}`;

  return (
    <div
      className="GroupEvent btn"
      style={!isClicked ? onClickStyle : null}
      onClick={clicked}
    >
      <li className="event-label">
        <span style={!isClicked ? onClickStyle : null}>
          {group}:&nbsp;&nbsp;{" "}
        </span>{" "}
        {props.g.e}-{props.g.sub}
      </li>
    </div>
  );
}

function CourEvent(props) {
  const [isClicked, setClicked] = React.useState(true);
  const [toDltID, setToDltID] = React.useState("");
  const clicked = () => {
    setClicked((prevState) => !prevState);
    isClicked
      ? setToDltID(renderSchedule(props.mapData, props.c, true))
      : d3.select(`.${gClass}`).select(`#${toDltID}`).remove();

    onZoomResult(props.mapData, props.c);
  };
  return (
    <div className="CourEvent ">
      <li className="time-label">{props.c.time}</li>
      <li
        className="event-label btn"
        style={!isClicked ? onClickStyle : null}
        onClick={clicked}
      >
        <span style={!isClicked ? onClickStyle : null}> All:&nbsp;&nbsp; </span>{" "}
        Course-{props.c.sub}
      </li>
    </div>
  );
}
