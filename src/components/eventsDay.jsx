import * as d3 from "d3";
import { isEmpty } from "lodash";
import { glob } from "../global/var";
import { filtreMapDataBy } from "../handlers/filtreHandlers";
import { renderSchedule } from "../handlers/mapRenderResult.js";
import "./eventsDay.scss";

const onZoomResult = (mapData, courData) => {
  let d = filtreMapDataBy.cour(mapData, courData)[0];
  var centroid = glob.path.centroid(d);

  let k = 8;
  let x = glob.innerWidth / 2 - centroid[0] * k;
  let y = glob.innerHeight / 2 - centroid[1] * k;

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

  return <div className="GroupsEvent">{groupsEl}</div>;
}

function GroupEvent(props) {
  const group = `G${props.gIdx}`;
  return (
    <div
      className="GroupEvent btn"
      onClick={() => {
        renderSchedule(props.mapData, null, { [group]: props.g }, true);
        onZoomResult(props.mapData, props.g);
      }}
    >
      <span>{group}</span>
      <li>&nbsp;&nbsp;Time: {props.g.time}</li>
      <li>
        &nbsp;&nbsp;{props.g.e}: {props.g.sub}
      </li>
      {/* <li>Prof: {props.g.prof}</li> */}
    </div>
  );
}

function CourEvent(props) {
  return (
    <div
      className="CourEvent btn"
      onClick={() => {
        renderSchedule(props.mapData, props.c, null, true);
        onZoomResult(props.mapData, props.c);
      }}
    >
      <li>Course: {props.c.sub}</li>
      <li>&nbsp;&nbsp;Time: {props.c.time}</li>
      {/* <li>Prof: {props.c.prof}</li> */}
      {/* <button className="eventExit">x</button> */}
    </div>
  );
}
