import * as d3 from "d3";
import React from "react";
import { isEmpty } from "lodash";
import { gClass } from "../global/const";
import { renderSchedule, onZoomResult } from "../handlers/mapRenderResult.js";
import "./eventsDay.scss";

export default function EventsDay(props) {
  let el = [];
  if (props.day) {
    el = props.day.map((d, idx) => {
      if (!isEmpty(d.cours))
        return (
          <CourEvent
            key={idx}
            mapData={props.mapData}
            c={d.cours}
            isProf={false}
          />
        );

      if (!isEmpty(d.groups))
        return (
          <GroupsEvent key={idx} mapData={props.mapData} groups={d.groups} />
        );
    });
  }

  if (props.teacherEvents) {
    el = props.teacherEvents.map((d, idx) => {
      return (
        <CourEvent key={idx} mapData={props.mapData} c={d} isProf={true} />
      );
    });
  }

  return <div className="EventsDay">{el}</div>;
}

function GroupsEvent(props) {
  let arr = Object.keys(props.groups).map((k) => props.groups[k]);
  const groupsEl = arr.map((g, idx) => {
    let gIdx = idx + 1;
    return <GroupEvent key={idx} mapData={props.mapData} gIdx={gIdx} g={g} />;
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
  backgroundColor: "#4694DD",
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
    <div className="GroupEvent " onClick={clicked}>
      <li className="event-label btn" style={!isClicked ? onClickStyle : null}>
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

  if (!props.isProf)
    return (
      <div className="CourEvent ">
        <li className="time-label">{props.c.time}</li>
        <li
          className="event-label btn"
          style={!isClicked ? onClickStyle : null}
          onClick={clicked}
        >
          <span style={!isClicked ? onClickStyle : null}>
            {" "}
            All:&nbsp;&nbsp;{" "}
          </span>{" "}
          Course-{props.c.sub}
        </li>
      </div>
    );
  else
    return (
      <div className="CourEvent ">
        <li className="time-label">
          [{props.c.sem}] {props.c.day} : {props.c.time}{" "}
        </li>
        <li
          className="event-label btn"
          style={!isClicked ? onClickStyle : null}
          onClick={clicked}
        >
          <span style={!isClicked ? onClickStyle : null}>
            {!props.c.e ? "Course" : props.c.e}:&nbsp;&nbsp;{props.c.sub}
            <br />
            Specialty:&nbsp;&nbsp;{props.c.lvl}-{props.c.spc}
          </span>
        </li>
      </div>
    );
}
